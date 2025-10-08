import React from "react";

const AppSelector = ({
  selectedSchool,
  selectedAppType,
  onSchoolChange,
  onAppTypeChange,
  appConfigs,
}) => {
  const appTypes = [
    { value: "employee", name: "Employee App" },
    { value: "OurEducation", name: "Parent App" },
  ];

  return (
    <div className="form-section">
      <h2>🔧 Configuration</h2>

      <div className="form-group">
        <label htmlFor="schoolSelect">Select School:</label>
        <select
          id="schoolSelect"
          value={selectedSchool}
          onChange={(e) => onSchoolChange(e.target.value)}
        >
          <option value="">Choose a school...</option>
          {Object.entries(appConfigs).map(([key, config]) => (
            <option key={key} value={key}>
              {config.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="appTypeSelect">Select App Type:</label>
        <select
          id="appTypeSelect"
          value={selectedAppType}
          onChange={(e) => onAppTypeChange(e.target.value)}
        >
          <option value="">Choose an app type...</option>
          {appTypes.map((app) => (
            <option key={app.value} value={app.value}>
              {app.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSchool && (
        <div className="form-group">
          <label htmlFor="baseUrl">Base URL:</label>
          <input
            type="text"
            id="baseUrl"
            value={appConfigs[selectedSchool]?.baseUrl || ""}
            readOnly
          />
        </div>
      )}
    </div>
  );
};

export default AppSelector;
