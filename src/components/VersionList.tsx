import React, { useState, useCallback, useMemo } from "react";

/**
 * Version data interface
 */
interface VersionData {
  id?: string | number;
  version: string;
  type: string;
  is_active: boolean;
  app_name?: string;
  created_at?: string;
  updated_at?: string;
  attributes?: VersionData;
}

/**
 * VersionList Component Props
 */
interface VersionListProps {
  selectedSchool?: string;
  selectedAppType?: string;
  versions?: VersionData[];
  loading?: boolean;
  error?: string | null;
  onFetchVersions: (platform: string) => void;
  onToggleStatus: (versionData: Partial<VersionData>) => Promise<void>;
}

/**
 * VersionList Component
 * Displays a list of mobile app versions with filtering and toggle functionality
 *
 * @component
 */
const VersionList: React.FC<VersionListProps> = ({
  selectedSchool,
  selectedAppType,
  versions = [],
  loading = false,
  error = null,
  onFetchVersions,
  onToggleStatus,
}) => {
  const [platform, setPlatform] = useState<string>("ios");
  const [togglingVersion, setTogglingVersion] = useState<string | null>(null);

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
  const handlePlatformChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPlatform(e.target.value);
    },
    []
  );

  /**
   * Toggles the active status of a version
   * @param versionData - The version data to toggle
   */
  const handleToggleStatus = useCallback(
    async (versionData: VersionData) => {
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
   * @param version - Raw version data
   * @returns Formatted version data
   */
  const formatVersionData = useCallback((version: VersionData): VersionData => {
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
    (version: VersionData, index: number) => {
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
              onKeyPress={(e: React.KeyboardEvent) => {
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

export default React.memo(VersionList);
