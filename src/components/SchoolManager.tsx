import React, { useState, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext";

interface SchoolConfig {
  name: string;
  baseUrl: string;
}

interface SchoolManagerProps {
  onAddSchool: (key: string, config: SchoolConfig) => void;
}

const SchoolManager: React.FC<SchoolManagerProps> = ({ onAddSchool }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [schoolKey, setSchoolKey] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      // Validation
      if (!schoolKey.trim()) {
        setError(t.schoolKeyRequired);
        return;
      }

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

      // Convert school key to kebab-case
      const key = schoolKey
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      // Add school
      onAddSchool(key, {
        name: schoolName.trim(),
        baseUrl: baseUrl.trim(),
      });

      // Show success and reset form
      setSuccess(t.schoolAddedSuccess);
      setTimeout(() => {
        setSchoolKey("");
        setSchoolName("");
        setBaseUrl("");
        setSuccess("");
        setIsOpen(false);
      }, 2000);
    },
    [schoolKey, schoolName, baseUrl, onAddSchool, t]
  );

  const handleCancel = () => {
    setSchoolKey("");
    setSchoolName("");
    setBaseUrl("");
    setError("");
    setSuccess("");
    setIsOpen(false);
  };

  return (
    <div className="school-manager">
      {!isOpen ? (
        <button
          className="btn-add-school"
          onClick={() => setIsOpen(true)}
          aria-label={t.addNewSchool}
        >
          <span className="icon">➕</span>
          <span>{t.addNewSchool}</span>
        </button>
      ) : (
        <div className="school-form-card">
          <div className="school-form-header">
            <h3>{t.addSchoolTitle}</h3>
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
              <label htmlFor="schoolKey">
                {t.schoolKey} <span className="required">*</span>
              </label>
              <input
                id="schoolKey"
                type="text"
                value={schoolKey}
                onChange={(e) => setSchoolKey(e.target.value)}
                placeholder={t.schoolKeyPlaceholder}
                className="form-input"
                autoFocus
              />
              <span className="help-text">{t.schoolKeyHelp}</span>
            </div>

            <div className="form-group">
              <label htmlFor="schoolName">
                {t.schoolName} <span className="required">*</span>
              </label>
              <input
                id="schoolName"
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder={t.schoolNamePlaceholder}
                className="form-input"
              />
              <span className="help-text">{t.schoolNameHelp}</span>
            </div>

            <div className="form-group">
              <label htmlFor="baseUrl">
                {t.apiBaseUrlLabel} <span className="required">*</span>
              </label>
              <input
                id="baseUrl"
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder={t.apiBaseUrlPlaceholder}
                className="form-input"
              />
              <span className="help-text">{t.apiBaseUrlHelpText}</span>
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
                <span>Save School</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SchoolManager;
