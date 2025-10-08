import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

/**
 * VersionForm Component
 * Form for adding or updating mobile app versions
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.selectedSchool - Currently selected school identifier
 * @param {string} props.selectedAppType - Currently selected app type
 * @param {Function} props.onSubmit - Callback function to handle form submission
 */
const VersionForm = ({
  selectedSchool = "",
  selectedAppType = "",
  onSubmit,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    version: "",
    type: "",
    is_active: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Platform options configuration
   */
  const platformOptions = useMemo(
    () => [
      { value: "ios", label: "iOS", icon: "" },
      { value: "android", label: "Android", icon: "🤖" },
    ],
    []
  );

  /**
   * Status options configuration
   */
  const statusOptions = useMemo(
    () => [
      { value: "true", label: "Active", icon: "✅" },
      { value: "false", label: "Inactive", icon: "❌" },
    ],
    []
  );

  /**
   * Check if form can be submitted
   */
  const canSubmit = useMemo(
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
  const isConfigComplete = useMemo(
    () => Boolean(selectedSchool && selectedAppType),
    [selectedSchool, selectedAppType]
  );

  /**
   * Handles input field changes
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages on input change
    setError("");
    setSuccess("");
  }, []);

  /**
   * Validates version format (semantic versioning)
   */
  const validateVersion = useCallback((version) => {
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
    return semverRegex.test(version);
  }, []);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validation
      if (!isConfigComplete) {
        setError("Please select both school and app type first");
        return;
      }

      if (!validateVersion(formData.version)) {
        setError("Please enter a valid version number (e.g., 1.0.0)");
        return;
      }

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const submitData = {
          version: formData.version.trim(),
          type: formData.type,
          is_active: formData.is_active === "true",
        };

        await onSubmit(submitData);

        setSuccess(
          `Version ${submitData.version} ${
            submitData.is_active ? "activated" : "deactivated"
          } successfully!`
        );

        // Keep form data for easier updates
      } catch (err) {
        console.error("Error submitting version:", err);

        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "An unexpected error occurred";

        setError(`Failed to save version: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    },
    [isConfigComplete, formData, onSubmit, validateVersion]
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
      <h2>➕ Add/Update Version</h2>

      {!isConfigComplete && (
        <div className="error" role="alert">
          <strong>⚠️ Configuration Required:</strong> Please select both school
          and app type from the configuration section first.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="versionInput">
            Version Number: <span className="required">*</span>
          </label>
          <input
            type="text"
            id="versionInput"
            name="version"
            value={formData.version}
            onChange={handleInputChange}
            placeholder="e.g., 1.0.0"
            required
            disabled={!isConfigComplete}
            aria-required="true"
            aria-invalid={error.includes("version") ? "true" : "false"}
            pattern="^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$"
          />
          <small className="help-text">
            Use semantic versioning format (e.g., 1.0.0, 2.1.3)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="typeSelect">
            Platform Type: <span className="required">*</span>
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
            <option value="">Select platform...</option>
            {platformOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="isActiveSelect">
            Status: <span className="required">*</span>
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
            <option value="">Select status...</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
          <small className="help-text">
            Active versions will be available for app updates
          </small>
        </div>

        {loading && (
          <div className="loading" role="status" aria-live="polite">
            Submitting version...
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
            aria-label="Save version"
          >
            💾 Save Version
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
            aria-label="Reset form"
          >
            � Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

// PropTypes for type checking
VersionForm.propTypes = {
  selectedSchool: PropTypes.string,
  selectedAppType: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

export default React.memo(VersionForm);
