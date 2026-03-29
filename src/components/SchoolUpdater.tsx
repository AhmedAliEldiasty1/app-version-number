import React, { useState, useCallback, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";

interface SchoolConfig {
  name: string;
  baseUrl: string;
}

interface SchoolUpdaterProps {
  schoolKey: string;
  currentConfig: SchoolConfig;
  onUpdateSchool: (key: string, config: SchoolConfig) => void;
  onCancel: () => void;
}

const SchoolUpdater: React.FC<SchoolUpdaterProps> = ({
  schoolKey,
  currentConfig,
  onUpdateSchool,
  onCancel,
}) => {
  const { t } = useLanguage();
  const [schoolName, setSchoolName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize form with current school data
  useEffect(() => {
    setSchoolName(currentConfig.name);
    setBaseUrl(currentConfig.baseUrl);
  }, [currentConfig]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      // Validation
      if (!schoolName.trim()) {
        setError(t.schoolNameRequired);
        return;
      }

      if (!baseUrl.trim()) {
        setError(t.apiUrlRequired);
        return;
      }

      // Validate URL format
      try {
        new URL(baseUrl);
      } catch {
        setError(t.invalidUrlFormat);
        return;
      }

      // Update school
      onUpdateSchool(schoolKey, {
        name: schoolName.trim(),
        baseUrl: baseUrl.trim(),
      });

      // Show success and reset form
      const isCloudEnabled =
        typeof window !== "undefined" &&
        localStorage.getItem("cloudSyncEnabled") === "true";
      setSuccess(
        isCloudEnabled
          ? t.schoolUpdatedSuccess
          : `${t.schoolUpdatedSuccess} (saved locally)`
      );
      setTimeout(() => {
        onCancel();
      }, 2000);
    },
    [schoolName, baseUrl, schoolKey, onUpdateSchool, t, onCancel]
  );

  const handleCancel = () => {
    setSchoolName(currentConfig.name);
    setBaseUrl(currentConfig.baseUrl);
    setError("");
    setSuccess("");
    onCancel();
  };

  return (
    <div className="school-updater-overlay">
      <div className="school-form-card">
        <div className="school-form-header">
          <h3>{t.updateSchoolTitle}</h3>
          <button
            className="btn-close"
            onClick={handleCancel}
            aria-label={t.close}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="school-form">
          <div className="form-group">
            <label htmlFor="updateSchoolName">
              {t.schoolName} <span className="required">*</span>
            </label>
            <input
              id="updateSchoolName"
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder={t.schoolNamePlaceholder}
              className="form-input"
              autoFocus
            />
            <span className="help-text">{t.schoolNameHelp}</span>
          </div>

          <div className="form-group">
            <label htmlFor="updateBaseUrl">
              {t.apiBaseUrlLabel} <span className="required">*</span>
            </label>
            <input
              id="updateBaseUrl"
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder={t.apiBaseUrlPlaceholder}
              className="form-input"
            />
            <span className="help-text">{t.apiBaseUrlHelpText}</span>
          </div>

          <div className="form-group">
            <p className="school-key-display">
              {t.schoolKey}: <strong>{schoolKey}</strong>
            </p>
          </div>

          {error && (
            <div className="alert alert-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              ✅ {success}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary-outline"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <span className="icon">💾</span>
              <span>Update School</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolUpdater;
