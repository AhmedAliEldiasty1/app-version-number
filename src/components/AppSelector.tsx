import React, { useCallback, useMemo } from "react";
import { useLanguage } from "../i18n/LanguageContext";

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
  const { t } = useLanguage();

  // App types configuration
  const appTypes = useMemo<AppType[]>(
    () => [
      { value: "employee", name: t.employeeApp, icon: "👨‍💼" },
      { value: "OurEducation", name: t.parentApp, icon: "👨‍👩‍👧" },
    ],
    [t]
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
      <h2>{t.configurationTitle}</h2>

      <div className="form-group">
        <label htmlFor="schoolSelect">
          {t.selectSchool}: <span className="required">{t.required}</span>
        </label>
        <select
          id="schoolSelect"
          value={selectedSchool}
          onChange={handleSchoolChange}
          aria-label={t.selectSchool}
          aria-required="true"
        >
          <option value="">{t.selectSchoolPlaceholder}</option>
          {sortedSchoolEntries.map(([key, config]) => (
            <option key={key} value={key}>
              {config.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="appTypeSelect">
          {t.selectAppType}: <span className="required">{t.required}</span>
        </label>
        <select
          id="appTypeSelect"
          value={selectedAppType}
          onChange={handleAppTypeChange}
          aria-label={t.selectAppType}
          aria-required="true"
        >
          <option value="">{t.selectAppTypePlaceholder}</option>
          {appTypes.map((app) => (
            <option key={app.value} value={app.value}>
              {app.name}
            </option>
          ))}
        </select>
      </div>

      {currentSchoolConfig && (
        <div className="form-group">
          <label htmlFor="baseUrl">{t.apiBaseUrl}:</label>
          <input
            type="text"
            id="baseUrl"
            value={currentSchoolConfig.baseUrl}
            readOnly
            aria-label={t.apiBaseUrl}
            className="readonly-input"
          />
          <small className="help-text">{t.apiBaseUrlHelp}</small>
        </div>
      )}
    </div>
  );
};

export default React.memo(AppSelector);
