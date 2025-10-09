import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { SchoolSyncService } from "../utils/schoolSync";
import { testFirestoreConnection } from "../utils/firestoreTest";

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

  // Handle cloud sync state changes and subscriptions
  useEffect(() => {
    localStorage.setItem("cloudSyncEnabled", String(isCloudEnabled));
    console.log("Cloud sync state updated:", isCloudEnabled);

    if (isCloudEnabled) {
      console.log("Cloud sync enabled, subscribing to updates");
      const unsubscribe = SchoolSyncService.subscribeToSchools((schools) => {
        onSyncComplete(schools);
      });

      return () => {
        console.log("Unsubscribing from cloud updates");
        unsubscribe();
      };
    }
  }, [isCloudEnabled]); // Only when cloud sync is toggled

  // Debounced sync effect
  useEffect(() => {
    if (!isCloudEnabled) return;

    const timer = setTimeout(() => {
      console.log("Debounced sync to cloud", customSchools);
      handleSyncToCloud();
    }, 2000); // Debounce for 2 seconds

    return () => clearTimeout(timer);
  }, [customSchools, isCloudEnabled]);
  const handleSyncToCloud = async () => {
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
  };

  const handleSyncFromCloud = async () => {
    setIsSyncing(true);
    setSyncStatus("idle");
    setMessage("");

    try {
      const schools = await SchoolSyncService.getAllSchools();
      onSyncComplete(schools);
      setSyncStatus("success");
      setMessage(t.syncedFromCloud);
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (error) {
      setSyncStatus("error");
      setMessage(t.syncError);
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

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
