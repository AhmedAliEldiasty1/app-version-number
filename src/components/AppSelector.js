import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";

/**
 * AppSelector Component
 * Provides selection interface for school and app type configuration
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.selectedSchool - Currently selected school identifier
 * @param {string} props.selectedAppType - Currently selected app type
 * @param {Function} props.onSchoolChange - Callback when school selection changes
 * @param {Function} props.onAppTypeChange - Callback when app type selection changes
 * @param {Object} props.appConfigs - Configuration object for available schools
 */
const AppSelector = ({
  selectedSchool = "",
  selectedAppType = "",
  onSchoolChange,
  onAppTypeChange,
  appConfigs = {},
}) => {
  // App types configuration
  const appTypes = useMemo(
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
    (e) => {
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
    (e) => {
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
  const currentSchoolConfig = useMemo(
    () => (selectedSchool ? appConfigs[selectedSchool] : null),
    [selectedSchool, appConfigs]
  );

  /**
   * Get sorted school entries for consistent display
   */
  const sortedSchoolEntries = useMemo(
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

// PropTypes for type checking
AppSelector.propTypes = {
  selectedSchool: PropTypes.string,
  selectedAppType: PropTypes.string,
  onSchoolChange: PropTypes.func.isRequired,
  onAppTypeChange: PropTypes.func.isRequired,
  appConfigs: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      baseUrl: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default React.memo(AppSelector);
