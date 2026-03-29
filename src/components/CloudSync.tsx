import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { SchoolSyncService } from "../utils/schoolSync";

interface CloudSyncProps {
  customSchools: Record<string, { name: string; baseUrl: string }>;
  onSyncComplete: (
    schools: Record<string, { name: string; baseUrl: string }>
  ) => void;
}

export const CloudSync: React.FC<CloudSyncProps> = ({
  customSchools,
  onSyncComplete,
}) => {
  const { t } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [isCloudEnabled, setIsCloudEnabled] = useState(false);
  const [message, setMessage] = useState("");

  // Initialize cloud sync state
  useEffect(() => {
    const enabled = localStorage.getItem("cloudSyncEnabled") === "true";
    console.log("Initial cloud sync state:", enabled);
    setIsCloudEnabled(enabled);
  }, []); // Only on mount

  // Handle sync from cloud
  const handleSyncFromCloud = useCallback(async () => {
    setIsSyncing(true);
    setSyncStatus("idle");
    setMessage("");

    try {
      const cloudSchools = await SchoolSyncService.getAllSchools();

      // Only update if there are actual differences
      const cloudKeys = Object.keys(cloudSchools);
      const localKeys = Object.keys(customSchools);

      if (
        JSON.stringify(cloudKeys.sort()) !== JSON.stringify(localKeys.sort())
      ) {
        console.log("Updating local schools from cloud");
        onSyncComplete(cloudSchools);
        setSyncStatus("success");
        setMessage(t.syncedFromCloud);
      } else {
        console.log("Local schools already match cloud");
        setSyncStatus("success");
        setMessage("Schools are already in sync");
      }
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (error) {
      setSyncStatus("error");
      setMessage(t.syncError);
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [customSchools, onSyncComplete, t]);

  // Handle cloud sync state changes
  useEffect(() => {
    localStorage.setItem("cloudSyncEnabled", String(isCloudEnabled));
    console.log("Cloud sync state updated:", isCloudEnabled);

    if (isCloudEnabled) {
      // When first enabled, only fetch from cloud
      handleSyncFromCloud();
    }
  }, [isCloudEnabled, handleSyncFromCloud]); // Only when cloud sync is toggled

  // Handle real-time updates subscription
  useEffect(() => {
    if (!isCloudEnabled) return;

    console.log("Setting up cloud subscription");
    const unsubscribe = SchoolSyncService.subscribeToSchools((cloudSchools) => {
      // Check for any differences - both keys and values
      const cloudKeys = Object.keys(cloudSchools).sort();
      const localKeys = Object.keys(customSchools).sort();

      // First check if keys are different
      const keysDifferent =
        JSON.stringify(cloudKeys) !== JSON.stringify(localKeys);

      // Then check if values are different
      let valuesDifferent = false;
      if (!keysDifferent) {
        for (const key of cloudKeys) {
          const cloudSchool = cloudSchools[key];
          const localSchool = customSchools[key];
          if (
            cloudSchool.name !== localSchool.name ||
            cloudSchool.baseUrl !== localSchool.baseUrl
          ) {
            valuesDifferent = true;
            console.log(`School ${key} values changed:`, {
              from: localSchool,
              to: cloudSchool,
            });
            break;
          }
        }
      }

      if (keysDifferent || valuesDifferent) {
        console.log("Received updates from cloud");
        onSyncComplete(cloudSchools);
      }
    });

    return () => {
      console.log("Cleaning up cloud subscription");
      unsubscribe();
    };
  }, [isCloudEnabled, customSchools, onSyncComplete]); // Re-subscribe when schools change

  // Handle sync to cloud
  const handleSyncToCloud = useCallback(async () => {
    if (!isCloudEnabled) {
      console.log("Cloud sync is disabled, skipping sync");
      return;
    }

    setIsSyncing(true);
    setSyncStatus("idle");
    setMessage("");

    try {
      console.log("Starting cloud sync with schools:", customSchools);
      await SchoolSyncService.syncToCloud(customSchools);
      setSyncStatus("success");
      setMessage(t.syncedToCloud);
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (error: any) {
      console.error("Sync error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      setSyncStatus("error");

      // Show specific error message based on error code
      if (error.code === "permission-denied") {
        setMessage(
          "❌ Permission denied. Check Firestore Security Rules (see console for details)"
        );
      } else if (error.code === "failed-precondition") {
        setMessage(
          "❌ Firestore not enabled. Check Firebase Console (see console for details)"
        );
      } else if (error.code === "unavailable") {
        setMessage("❌ Network error. Check your internet connection");
      } else {
        setMessage(t.syncError);
      }
    } finally {
      setIsSyncing(false);
    }
  }, [isCloudEnabled, customSchools, t]);

  const toggleCloudSync = useCallback(() => {
    const newValue = !isCloudEnabled;
    console.log("Toggling cloud sync to:", newValue);
    setIsCloudEnabled(newValue);

    if (newValue) {
      setMessage(t.cloudSyncEnabled);
      handleSyncFromCloud();
    } else {
      setMessage(t.cloudSyncDisabled);
    }
  }, [isCloudEnabled, handleSyncFromCloud, t]);

  return (
    <div className="cloud-sync-container">
      <div className="cloud-sync-header">
        <h3>☁️ {t.cloudSync}</h3>
        <label className="cloud-sync-toggle">
          <input
            type="checkbox"
            checked={isCloudEnabled}
            onChange={toggleCloudSync}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      {isCloudEnabled && (
        <div className="cloud-sync-controls">
          <button
            className="btn-cloud-sync btn-upload"
            onClick={handleSyncToCloud}
            disabled={isSyncing}
          >
            {isSyncing ? "⏳" : "☁️⬆️"} {t.uploadToCloud}
          </button>

          <button
            className="btn-cloud-sync btn-download"
            onClick={handleSyncFromCloud}
            disabled={isSyncing}
          >
            {isSyncing ? "⏳" : "☁️⬇️"} {t.downloadFromCloud}
          </button>
        </div>
      )}

      {message && (
        <div className={`cloud-sync-message ${syncStatus}`}>
          {syncStatus === "success" && "✅ "}
          {syncStatus === "error" && "❌ "}
          {message}
        </div>
      )}

      <p className="cloud-sync-help">{t.cloudSyncHelp}</p>
    </div>
  );
};
