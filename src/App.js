import React, { useState, useEffect } from "react";
import axios from "axios";
import AppSelector from "./components/AppSelector";
import VersionList from "./components/VersionList";
import VersionForm from "./components/VersionForm";

// Configure axios to not send unnecessary headers
axios.defaults.headers.common = {};
axios.defaults.headers.get = {};
axios.defaults.headers.post = {};
axios.defaults.headers.put = {};
axios.defaults.headers.patch = {};
delete axios.defaults.headers.common["Accept"];

// App configurations with different base URLs
const APP_CONFIGS = {
  "ibn-khaldun": {
    name: "ابن خلدون",
    baseUrl: "https://api.system.ouredu.net/api/v1/ar",
  },
  "dar-al-ahfad": {
    name: "دار الاحفاد",
    baseUrl: "https://api.dar-al-ahfad.ouredu.net/api/v1/ar",
  },
  "al-taib": {
    name: "الكلم الطيب",
    baseUrl: "https://api.altaib.system.ouredu.net/api/v1/ar",
  },
  "high-gate": {
    name: "High Gate",
    baseUrl: "https://api.high-gate.system.ouredu.net/api/v1/ar",
  },
  testing: {
    name: "Testing",
    baseUrl: "https://testing.oetest.tech/api/v1/ar",
  },
  staging: {
    name: "Staging",
    baseUrl: "https://oetest2.tech/api/v1/ar",
  },
};

function App() {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedAppType, setSelectedAppType] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentConfig = selectedSchool ? APP_CONFIGS[selectedSchool] : null;

  // Function to fetch versions
  const fetchVersions = async (platform = "ios") => {
    if (!selectedSchool || !selectedAppType) {
      setError("Please select both school and app type first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = `${currentConfig.baseUrl}/mobile-versions/${platform}/${selectedAppType}`;

      // GET request with both Accept and Content-Type headers
      const cfgPlain = {
        responseType: "json",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
        data: {},
      };
      console.debug("fetchVersions: Config being sent to axios:", cfgPlain);
      console.debug("fetchVersions: Attempting GET to:", url);

      try {
        const responsePlain = await axios.get(url, cfgPlain);
        console.debug("fetchVersions: plain GET success", {
          status: responsePlain.status,
          headers: responsePlain.headers,
        });
        setVersions(responsePlain.data.data || []);
        setLoading(false);
        return;
      } catch (plainErr) {
        console.warn(
          "fetchVersions: plain GET failed",
          cfgPlain,
          plainErr?.response?.status,
          plainErr?.message
        );
        // If server returned 415 (unsupported media) try with Accept header
        if (plainErr?.response?.status === 415) {
          console.debug(
            "fetchVersions: retrying with Accept header due to 415"
          );
          const cfg = {
            headers: {
              Accept: "application/vnd.api+json, application/json;q=0.9",
            },
            responseType: "json",
          };
          try {
            const responseWithAccept = await axios.get(url, cfg);
            console.debug("fetchVersions: GET with Accept success", {
              status: responseWithAccept.status,
              headers: responseWithAccept.headers,
            });
            setVersions(responseWithAccept.data.data || []);
            setLoading(false);
            return;
          } catch (acceptErr) {
            console.error(
              "fetchVersions: GET with Accept also failed",
              acceptErr?.response?.status,
              acceptErr?.message
            );
            setError(formatFetchError(acceptErr));
            setVersions([]);
            setLoading(false);
            return;
          }
        }

        // If it wasn't 415, surface the original error
        setError(formatFetchError(plainErr));
        setVersions([]);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Unexpected error fetching versions:", err);
      setError(formatFetchError(err));
      setVersions([]);
    } finally {
      // loading is handled in the above flows; ensure it's false as fallback
      setLoading(false);
    }
  };

  // Helper to format fetch errors for UI
  const formatFetchError = (err) => {
    const status = err?.response?.status;
    const data = err?.response?.data;
    const message = err?.message || "Unknown error";
    return `Request failed${status ? ` (status ${status})` : ""}: ${
      data?.message || JSON.stringify(data) || message
    }`;
  };

  // Function to submit new version
  const submitVersion = async (versionData) => {
    if (!selectedSchool || !selectedAppType) {
      throw new Error("Please select both school and app type first");
    }

    const url = `${currentConfig.baseUrl}/add-update-mobile-version`;
    const payload = {
      data: {
        type: "user",
        id: "null",
        attributes: {
          app_name: selectedAppType,
          version: versionData.version,
          is_active: versionData.is_active,
          type: versionData.type,
        },
      },
    };

    const response = await axios.post(url, payload, {
      headers: {
        Accept: "application/vnd.api+json, application/json;q=0.9",
        "content-Type": "application/vnd.api+json, application/json;q=0.9",
      },
      responseType: "json",
    });

    return response.data;
  };

  // Reset data when school or app type changes
  useEffect(() => {
    setVersions([]);
    setError("");
  }, [selectedSchool, selectedAppType]);

  return (
    <div className="container">
      <header className="header">
        <h1>📱 App Version Manager</h1>
        <p>Manage mobile app versions for different applications</p>
      </header>

      <AppSelector
        selectedSchool={selectedSchool}
        selectedAppType={selectedAppType}
        onSchoolChange={setSelectedSchool}
        onAppTypeChange={setSelectedAppType}
        appConfigs={APP_CONFIGS}
      />

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "list" ? "active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          📋 List Versions
        </button>
        <button
          className={`tab-button ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          ➕ Add/Update Version
        </button>
      </div>

      {activeTab === "list" && (
        <VersionList
          selectedSchool={selectedSchool}
          selectedAppType={selectedAppType}
          versions={versions}
          loading={loading}
          error={error}
          onFetchVersions={fetchVersions}
          onToggleStatus={submitVersion}
        />
      )}

      {activeTab === "add" && (
        <VersionForm
          selectedSchool={selectedSchool}
          selectedAppType={selectedAppType}
          onSubmit={submitVersion}
        />
      )}
    </div>
  );
}

export default App;
