import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

/**
 * VersionList Component
 * Displays a list of mobile app versions with filtering and toggle functionality
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.selectedSchool - Currently selected school identifier
 * @param {string} props.selectedAppType - Currently selected app type
 * @param {Array} props.versions - Array of version objects
 * @param {boolean} props.loading - Loading state indicator
 * @param {string} props.error - Error message if any
 * @param {Function} props.onFetchVersions - Callback to fetch versions
 * @param {Function} props.onToggleStatus - Callback to toggle version status
 */
const VersionList = ({
  selectedSchool,
  selectedAppType,
  versions = [],
  loading = false,
  error = null,
  onFetchVersions,
  onToggleStatus,
}) => {
  const [platform, setPlatform] = useState("ios");
  const [togglingVersion, setTogglingVersion] = useState(null);

  /**
   * Handles refresh button click
   */
  const handleRefresh = useCallback(() => {
    if (onFetchVersions) {
      onFetchVersions(platform);
    }
  }, [platform, onFetchVersions]);

  /**
   * Handles platform selection change
   */
  const handlePlatformChange = useCallback((e) => {
    setPlatform(e.target.value);
  }, []);

  /**
   * Toggles the active status of a version
   * @param {Object} versionData - The version data to toggle
   */
  const handleToggleStatus = useCallback(
    async (versionData) => {
      if (!onToggleStatus || togglingVersion) return;

      const versionKey = `${versionData.version}-${versionData.type}`;
      setTogglingVersion(versionKey);

      try {
        await onToggleStatus({
          version: versionData.version,
          type: versionData.type,
          is_active: !versionData.is_active,
        });

        // Refresh the list after successful toggle
        await handleRefresh();
      } catch (err) {
        console.error("Failed to toggle status:", err);
        // Error handling is done in parent component
      } finally {
        setTogglingVersion(null);
      }
    },
    [onToggleStatus, togglingVersion, handleRefresh]
  );

  /**
   * Formats version data from different API response formats
   * @param {Object} version - Raw version data
   * @returns {Object} Formatted version data
   */
  const formatVersionData = useCallback((version) => {
    return version?.attributes || version;
  }, []);

  /**
   * Checks if selection is complete
   */
  const isSelectionComplete = useMemo(
    () => Boolean(selectedSchool && selectedAppType),
    [selectedSchool, selectedAppType]
  );

  /**
   * Checks if data should be shown
   */
  const shouldShowData = useMemo(
    () => !loading && !error && versions.length > 0,
    [loading, error, versions.length]
  );

  /**
   * Checks if empty state should be shown
   */
  const shouldShowEmptyState = useMemo(
    () => isSelectionComplete && !loading && !error && versions.length === 0,
    [isSelectionComplete, loading, error, versions.length]
  );

  /**
   * Renders a single version card
   */
  const renderVersionCard = useCallback(
    (version, index) => {
      const versionData = formatVersionData(version);
      const versionKey = `${versionData.version}-${versionData.type}`;
      const isToggling = togglingVersion === versionKey;

      return (
        <div key={versionData.id || index} className="version-card">
          <div className="version-header">
            <div className="version-number">
              Version: {versionData.version || "Unknown"}
            </div>

            <span
              className={`status-badge ${
                versionData.is_active ? "status-active" : "status-inactive"
              } ${isToggling ? "status-toggling" : ""}`}
              onClick={() => !isToggling && handleToggleStatus(versionData)}
              style={{
                cursor: isToggling ? "wait" : "pointer",
                userSelect: "none",
                opacity: isToggling ? 0.6 : 1,
              }}
              title={
                isToggling ? "Toggling status..." : "Click to toggle status"
              }
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  !isToggling && handleToggleStatus(versionData);
                }
              }}
            >
              {isToggling
                ? "Updating..."
                : versionData.is_active
                ? "Active"
                : "Inactive"}
            </span>
          </div>

          <div className="version-details">
            <div>
              <strong>App:</strong> {versionData.app_name || selectedAppType}
            </div>
            <div>
              <strong>Platform:</strong> {versionData.type || platform}
            </div>
            {versionData.created_at && (
              <div>
                <strong>Created:</strong>{" "}
                {new Date(versionData.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}
            {versionData.updated_at && (
              <div>
                <strong>Updated:</strong>{" "}
                {new Date(versionData.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}
          </div>
        </div>
      );
    },
    [
      formatVersionData,
      selectedAppType,
      platform,
      togglingVersion,
      handleToggleStatus,
    ]
  );

  return (
    <div className="tab-content active">
      <h2>📱 App Versions</h2>

      <div className="platform-filter">
        <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
          <label htmlFor="platformSelect">Platform:</label>
          <select
            id="platformSelect"
            value={platform}
            onChange={handlePlatformChange}
            aria-label="Select platform"
          >
            <option value="ios">iOS</option>
            <option value="android">Android</option>
          </select>
        </div>
        <button
          onClick={handleRefresh}
          className="btn btn-secondary"
          disabled={!isSelectionComplete || loading}
          aria-label="Refresh version data"
        >
          🔄 Refresh Data
        </button>
      </div>

      {loading && (
        <div className="loading" role="status" aria-live="polite">
          Loading versions...
        </div>
      )}

      {error && (
        <div className="error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      {!isSelectionComplete && !loading && (
        <div className="no-data" role="status">
          Select both school and app type from the configuration section above
        </div>
      )}

      {shouldShowEmptyState && (
        <div className="no-data" role="status">
          No versions found. Click "Refresh Data" to load versions.
        </div>
      )}

      {shouldShowData && (
        <div className="versions-container">
          {versions.map(renderVersionCard)}
        </div>
      )}
    </div>
  );
};

// PropTypes for type checking
VersionList.propTypes = {
  selectedSchool: PropTypes.string,
  selectedAppType: PropTypes.string,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      version: PropTypes.string,
      type: PropTypes.string,
      is_active: PropTypes.bool,
      app_name: PropTypes.string,
      created_at: PropTypes.string,
      updated_at: PropTypes.string,
      attributes: PropTypes.object,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onFetchVersions: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
};

export default React.memo(VersionList);
