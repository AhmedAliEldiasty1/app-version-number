import React, { useCallback, useMemo } from "react";

/**
 * App type configuration
 */
interface AppType {
  value: string;
  name: string;
  icon: string;
}

/**
 * School configuration
 */
interface SchoolConfig {
  name: string;
  baseUrl: string;
}

/**
 * App configurations object type
 */
interface AppConfigs {
  [key: string]: SchoolConfig;
}

/**
 * AppSelector Component Props
 */
interface AppSelectorProps {
  selectedSchool?: string;
  selectedAppType?: string;
  onSchoolChange: (school: string) => void;
  onAppTypeChange: (appType: string) => void;
  appConfigs: AppConfigs;
}

/**
 * AppSelector Component
 * Provides selection interface for school and app type configuration
 *
 * @component
 */
const AppSelector: React.FC<AppSelectorProps> = ({
  selectedSchool = "",
  selectedAppType = "",
  onSchoolChange,
  onAppTypeChange,
  appConfigs = {},
}) => {
  // App types configuration
  const appTypes = useMemo<AppType[]>(
    () => [
      { value: "employee", name: "Employee App", icon: "👨‍💼" },
      { value: "OurEducation", name: "Parent App", icon: "👨‍👩‍👧" },
    ],
    []
  );

  /**
   * Handles school selection change
   */
  const handleSchoolChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (onSchoolChange) {
        onSchoolChange(value);
      }
    },
    [onSchoolChange]
  );

  /**
   * Handles app type selection change
   */
  const handleAppTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (onAppTypeChange) {
        onAppTypeChange(value);
      }
    },
    [onAppTypeChange]
  );

  /**
   * Get current school configuration
   */
  const currentSchoolConfig = useMemo<SchoolConfig | null>(
    () => (selectedSchool ? appConfigs[selectedSchool] : null),
    [selectedSchool, appConfigs]
  );

  /**
   * Get sorted school entries for consistent display
   */
  const sortedSchoolEntries = useMemo<[string, SchoolConfig][]>(
    () =>
      Object.entries(appConfigs).sort(([, a], [, b]) =>
        a.name.localeCompare(b.name)
      ),
    [appConfigs]
  );

  return (
    <div className="form-section">
      <h2>🔧 Configuration</h2>

      <div className="form-group">
        <label htmlFor="schoolSelect">
          Select School: <span className="required">*</span>
        </label>
        <select
          id="schoolSelect"
          value={selectedSchool}
          onChange={handleSchoolChange}
          aria-label="Select school"
          aria-required="true"
        >
          <option value="">Choose a school...</option>
          {sortedSchoolEntries.map(([key, config]) => (
            <option key={key} value={key}>
              {config.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="appTypeSelect">
          Select App Type: <span className="required">*</span>
        </label>
        <select
          id="appTypeSelect"
          value={selectedAppType}
          onChange={handleAppTypeChange}
          aria-label="Select app type"
          aria-required="true"
        >
          <option value="">Choose an app type...</option>
          {appTypes.map((app) => (
            <option key={app.value} value={app.value}>
              {app.icon} {app.name}
            </option>
          ))}
        </select>
      </div>

      {currentSchoolConfig && (
        <div className="form-group">
          <label htmlFor="baseUrl">API Base URL:</label>
          <input
            type="text"
            id="baseUrl"
            value={currentSchoolConfig.baseUrl}
            readOnly
            aria-label="API base URL"
            className="readonly-input"
          />
          <small className="help-text">
            This URL is used for all API requests to the selected school
          </small>
        </div>
      )}
    </div>
  );
};

export default React.memo(AppSelector);
