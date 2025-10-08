import React, { useState, useCallback, useMemo } from "react";
import { useLanguage } from "../i18n/LanguageContext";

/**
 * Form data interface
 */
interface FormData {
  version: string;
  type: string;
  is_active: string;
}

/**
 * Platform option interface
 */
interface PlatformOption {
  value: string;
  label: string;
  icon: string;
}

/**
 * Status option interface
 */
interface StatusOption {
  value: string;
  label: string;
  icon: string;
}

/**
 * Submit data interface
 */
interface SubmitData {
  version: string;
  type: string;
  is_active: boolean;
}

/**
 * Error response interface
 */
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

/**
 * VersionForm Component Props
 */
interface VersionFormProps {
  selectedSchool?: string;
  selectedAppType?: string;
  onSubmit: (data: Partial<SubmitData>) => Promise<void>;
}

/**
 * VersionForm Component
 * Form for adding or updating mobile app versions
 *
 * @component
 */
const VersionForm: React.FC<VersionFormProps> = ({
  selectedSchool = "",
  selectedAppType = "",
  onSubmit,
}) => {
  const { t } = useLanguage();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    version: "",
    type: "",
    is_active: "",
  });

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  /**
   * Platform options configuration
   */
  const platformOptions = useMemo<PlatformOption[]>(
    () => [
      { value: "ios", label: t.ios, icon: "" },
      { value: "android", label: t.android, icon: "🤖" },
    ],
    [t]
  );

  /**
   * Status options configuration
   */
  const statusOptions = useMemo<StatusOption[]>(
    () => [
      { value: "true", label: t.active, icon: "✅" },
      { value: "false", label: t.inactive, icon: "❌" },
    ],
    [t]
  );

  /**
   * Check if form can be submitted
   */
  const canSubmit = useMemo<boolean>(
    () =>
      Boolean(
        selectedSchool &&
          selectedAppType &&
          formData.version &&
          formData.type &&
          formData.is_active &&
          !loading
      ),
    [selectedSchool, selectedAppType, formData, loading]
  );

  /**
   * Check if configuration is complete
   */
  const isConfigComplete = useMemo<boolean>(
    () => Boolean(selectedSchool && selectedAppType),
    [selectedSchool, selectedAppType]
  );

  /**
   * Handles input field changes
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear messages on input change
      setError("");
      setSuccess("");
    },
    []
  );

  /**
   * Validates version format (semantic versioning)
   */
  const validateVersion = useCallback((version: string): boolean => {
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
    return semverRegex.test(version);
  }, []);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validation
      if (!isConfigComplete) {
        setError(t.selectBothMessage);
        return;
      }

      if (!validateVersion(formData.version)) {
        setError(t.invalidVersionFormat);
        return;
      }

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const submitData: SubmitData = {
          version: formData.version.trim(),
          type: formData.type,
          is_active: formData.is_active === "true",
        };

        await onSubmit(submitData);

        setSuccess(
          `${t.version} ${submitData.version} ${
            submitData.is_active ? t.versionActivated : t.versionDeactivated
          } ${t.versionSavedSuccess}`
        );

        // Keep form data for easier updates
      } catch (err) {
        console.error("Error submitting version:", err);

        const typedError = err as ErrorResponse;
        const errorMessage =
          typedError.response?.data?.message ||
          typedError.response?.data?.error ||
          typedError.message ||
          "An unexpected error occurred";

        setError(`${t.failedToSave}: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    },
    [isConfigComplete, formData, onSubmit, validateVersion, t]
  );

  /**
   * Resets the form
   */
  const handleReset = useCallback(() => {
    setFormData({
      version: "",
      type: "",
      is_active: "",
    });
    setError("");
    setSuccess("");
  }, []);

  return (
    <div className="tab-content active">
      <h2>{t.addUpdateVersionTitle}</h2>

      {!isConfigComplete && (
        <div className="error" role="alert">
          <strong>{t.configRequired}:</strong> {t.configRequiredMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="versionInput">
            {t.versionNumber}: <span className="required">{t.required}</span>
          </label>
          <input
            type="text"
            id="versionInput"
            name="version"
            value={formData.version}
            onChange={handleInputChange}
            placeholder={t.versionPlaceholder}
            required
            disabled={!isConfigComplete}
            aria-required="true"
            aria-invalid={error.includes("version") ? "true" : "false"}
            pattern="^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$"
          />
          <small className="help-text">{t.versionHelp}</small>
        </div>

        <div className="form-group">
          <label htmlFor="typeSelect">
            {t.platformType}: <span className="required">{t.required}</span>
          </label>
          <select
            id="typeSelect"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            disabled={!isConfigComplete}
            aria-required="true"
          >
            <option value="">{t.selectPlatformPlaceholder}</option>
            {platformOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="isActiveSelect">
            {t.status}: <span className="required">{t.required}</span>
          </label>
          <select
            id="isActiveSelect"
            name="is_active"
            value={formData.is_active}
            onChange={handleInputChange}
            required
            disabled={!isConfigComplete}
            aria-required="true"
          >
            <option value="">{t.selectStatusPlaceholder}</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
          <small className="help-text">{t.statusHelp}</small>
        </div>

        {loading && (
          <div className="loading" role="status" aria-live="polite">
            {t.submittingVersion}
          </div>
        )}

        {error && (
          <div className="error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {success && (
          <div className="success" role="status" aria-live="polite">
            {success}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!canSubmit}
            aria-label={t.saveVersion}
          >
            {t.saveVersion}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
            aria-label={t.resetForm}
          >
            {t.resetForm}
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(VersionForm);
