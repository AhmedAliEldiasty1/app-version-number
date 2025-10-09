import React, { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { SchoolSyncService } from "../utils/schoolSync";

interface CloudSyncProps {
  customSchools: Record<string, { name: string; baseUrl: string }>;
  onSyncComplete: (schools: Record<string, { name: string; baseUrl: string }>) => void;
}

export const CloudSync: React.FC<CloudSyncProps> = ({
  customSchools,
  onSyncComplete,
}) => {
  const { t } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");
  const [isCloudEnabled, setIsCloudEnabled] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if cloud sync is enabled
    const enabled = localStorage.getItem("cloudSyncEnabled") === "true";
    setIsCloudEnabled(enabled);

    // Subscribe to real-time updates if enabled
    if (enabled) {
      const unsubscribe = SchoolSyncService.subscribeToSchools((schools) => {
        onSyncComplete(schools);
      });
      return () => unsubscribe();
    }
  }, [isCloudEnabled, onSyncComplete]);

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    setSyncStatus("idle");
    setMessage("");

    try {
      await SchoolSyncService.syncToCloud(customSchools);
      setSyncStatus("success");
      setMessage(t.syncedToCloud);
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (error) {
      setSyncStatus("error");
      setMessage(t.syncError);
      console.error("Sync error:", error);
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

  const toggleCloudSync = () => {
    const newValue = !isCloudEnabled;
    setIsCloudEnabled(newValue);
    localStorage.setItem("cloudSyncEnabled", String(newValue));
    
    if (newValue) {
      setMessage(t.cloudSyncEnabled);
      handleSyncFromCloud();
    } else {
      setMessage(t.cloudSyncDisabled);
    }
  };

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
            disabled={isSyncing || Object.keys(customSchools).length === 0}
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
