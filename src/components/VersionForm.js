import React, { useState } from "react";

const VersionForm = ({ selectedSchool, selectedAppType, onSubmit }) => {
  const [formData, setFormData] = useState({
    version: "",
    type: "",
    is_active: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSchool || !selectedAppType) {
      setError("Please select both school and app type first");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const submitData = {
        version: formData.version,
        type: formData.type,
        is_active: formData.is_active === "true",
      };

      await onSubmit(submitData);

      setSuccess("Version saved successfully!");
      // Don't clear form data - keep it for easier updates
    } catch (err) {
      console.error("Error submitting version:", err);
      setError(
        `Failed to save version: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content active">
      <h2>➕ Add/Update Version</h2>

      {(!selectedSchool || !selectedAppType) && (
        <div className="error">
          Please select both school and app type from the configuration section
          first.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="versionInput">Version:</label>
          <input
            type="text"
            id="versionInput"
            name="version"
            value={formData.version}
            onChange={handleInputChange}
            placeholder="e.g., 1.0.0"
            required
            disabled={!selectedSchool || !selectedAppType}
          />
        </div>

        <div className="form-group">
          <label htmlFor="typeSelect">Platform Type:</label>
          <select
            id="typeSelect"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            disabled={!selectedSchool || !selectedAppType}
          >
            <option value="">Select platform...</option>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="isActiveSelect">Status:</label>
          <select
            id="isActiveSelect"
            name="is_active"
            value={formData.is_active}
            onChange={handleInputChange}
            required
            disabled={!selectedSchool || !selectedAppType}
          >
            <option value="">Select status...</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {loading && <div className="loading">Submitting...</div>}
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!selectedSchool || !selectedAppType || loading}
        >
          💾 Save Version
        </button>
      </form>
    </div>
  );
};

export default VersionForm;
