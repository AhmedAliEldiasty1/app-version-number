import React, { useState } from "react";

const VersionList = ({
  selectedSchool,
  selectedAppType,
  versions,
  loading,
  error,
  onFetchVersions,
  onToggleStatus,
}) => {
  const [platform, setPlatform] = useState("ios");

  const handleRefresh = () => {
    onFetchVersions(platform);
  };

  const handleToggleStatus = async (versionData) => {
    try {
      // Call the parent component's toggle function with opposite status
      await onToggleStatus({
        version: versionData.version,
        type: versionData.type,
        is_active: !versionData.is_active,
      });
      // Refresh the list after successful toggle
      handleRefresh();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const formatVersionData = (version) => {
    // Handle different response formats
    if (version.attributes) {
      return version.attributes;
    }
    return version;
  };

  return (
    <div className="tab-content active">
      <h2>📱 App Versions</h2>

      <div className="platform-filter">
        <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
          <label htmlFor="platformSelect">Platform:</label>
          <select
            id="platformSelect"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="ios">iOS</option>
            <option value="android">Android</option>
          </select>
        </div>
        <button
          onClick={handleRefresh}
          className="btn btn-secondary"
          disabled={!selectedSchool || !selectedAppType}
        >
          🔄 Refresh Data
        </button>
      </div>

      {loading && <div className="loading">Loading versions...</div>}

      {error && <div className="error">{error}</div>}

      {(!selectedSchool || !selectedAppType) && !loading && (
        <div className="no-data">
          Select both school and app type from the configuration section above
        </div>
      )}

      {selectedSchool &&
        selectedAppType &&
        !loading &&
        !error &&
        versions.length === 0 && (
          <div className="no-data">
            No versions found. Click "Refresh Data" to load versions.
          </div>
        )}

      {versions.length > 0 && (
        <div className="versions-container">
          {versions.map((version, index) => {
            const versionData = formatVersionData(version);
            return (
              <div key={index} className="version-card">
                <div className="version-header">
                  <div className="version-number">
                    Version: {versionData.version || "Unknown"}
                  </div>

                  <span
                    className={`status-badge ${
                      versionData.is_active
                        ? "status-active"
                        : "status-inactive"
                    }`}
                    onClick={() => handleToggleStatus(versionData)}
                    style={{ cursor: "pointer", userSelect: "none" }}
                    title="Click to toggle status"
                  >
                    {versionData.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="version-details">
                  <div>
                    <strong>App:</strong>{" "}
                    {versionData.app_name || selectedAppType}
                  </div>
                  <div>
                    <strong>Platform:</strong> {versionData.type || platform}
                  </div>
                  {versionData.created_at && (
                    <div>
                      <strong>Created:</strong>{" "}
                      {new Date(versionData.created_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VersionList;
