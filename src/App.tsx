import React, { useState, useEffect } from "react";
import { AxiosError, AxiosResponse } from "axios";
import AppSelector from "./components/AppSelector";
import VersionList from "./components/VersionList";
import VersionForm from "./components/VersionForm";
import { useLanguage } from "./i18n/LanguageContext";
import { secureApi } from "./utils/apiService";
import { APP_CONFIGS } from "./utils/config";

/**
 * School configuration interface
 */
interface SchoolConfig {
  name: string;
  baseUrl: string;
}

/**
 * Version data interface
 */
interface VersionData {
  id?: string | number;
  version: string;
  type: string;
  is_active: boolean;
  app_name?: string;
  created_at?: string;
  updated_at?: string;
  attributes?: VersionData;
}

/**
 * API Response interface
 */
interface ApiResponse {
  data: VersionData[];
}

function App() {
  const { t, language, setLanguage } = useLanguage();
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedAppType, setSelectedAppType] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("list");
  const [versions, setVersions] = useState<VersionData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSwitchingLanguage, setIsSwitchingLanguage] =
    useState<boolean>(false);

  const currentConfig = selectedSchool ? APP_CONFIGS[selectedSchool] : null;

  // Function to fetch versions
  const fetchVersions = async (platform: string = "ios"): Promise<void> => {
    if (!selectedSchool || !selectedAppType) {
      setError("Please select both school and app type first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = `${
        currentConfig!.baseUrl
      }/mobile-versions/${platform}/${selectedAppType}`;

      // GET request with both Accept and Content-Type headers
      const cfgPlain = {
        responseType: "json" as const,
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
        data: {},
      };
      console.debug("fetchVersions: Config being sent to axios:", cfgPlain);
      console.debug("fetchVersions: Attempting GET to:", url);

      try {
        const responsePlain: AxiosResponse<ApiResponse> = await secureApi.get(
          url,
          cfgPlain
        );
        console.debug("fetchVersions: plain GET success", {
          status: responsePlain.status,
          headers: responsePlain.headers,
        });
        setVersions(responsePlain.data.data || []);
        setLoading(false);
        return;
      } catch (plainErr) {
        const typedError = plainErr as AxiosError;
        console.warn(
          "fetchVersions: plain GET failed",
          cfgPlain,
          typedError?.response?.status,
          typedError?.message
        );
        // If server returned 415 (unsupported media) try with Accept header
        if (typedError?.response?.status === 415) {
          console.debug(
            "fetchVersions: retrying with Accept header due to 415"
          );
          const cfg = {
            headers: {
              Accept: "application/vnd.api+json, application/json;q=0.9",
            },
            responseType: "json" as const,
          };
          try {
            const responseWithAccept: AxiosResponse<ApiResponse> =
              await secureApi.get(url, cfg);
            console.debug("fetchVersions: GET with Accept success", {
              status: responseWithAccept.status,
              headers: responseWithAccept.headers,
            });
            setVersions(responseWithAccept.data.data || []);
            setLoading(false);
            return;
          } catch (acceptErr) {
            const typedAcceptErr = acceptErr as AxiosError;
            console.error(
              "fetchVersions: GET with Accept also failed",
              typedAcceptErr?.response?.status,
              typedAcceptErr?.message
            );
            setError(formatFetchError(typedAcceptErr));
            setVersions([]);
            setLoading(false);
            return;
          }
        }

        // If it wasn't 415, surface the original error
        setError(formatFetchError(typedError));
        setVersions([]);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Unexpected error fetching versions:", err);
      setError(formatFetchError(err as AxiosError));
      setVersions([]);
    } finally {
      // loading is handled in the above flows; ensure it's false as fallback
      setLoading(false);
    }
  };

  // Helper to format fetch errors for UI
  const formatFetchError = (err: AxiosError<any>): string => {
    const status = err?.response?.status;
    const data = err?.response?.data;
    const message = err?.message || "Unknown error";
    return `Request failed${status ? ` (status ${status})` : ""}: ${
      data?.message || JSON.stringify(data) || message
    }`;
  };

  // Function to submit new version
  const submitVersion = async (
    versionData: Partial<VersionData>
  ): Promise<void> => {
    if (!selectedSchool || !selectedAppType) {
      throw new Error("Please select both school and app type first");
    }

    if (
      !versionData.version ||
      !versionData.type ||
      versionData.is_active === undefined
    ) {
      throw new Error("Missing required version data");
    }

    const url = `${currentConfig!.baseUrl}/add-update-mobile-version`;
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

    const response = await secureApi.post(url, payload, {
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
        <h1>{t.appTitle}</h1>
        <p>{t.appSubtitle}</p>
        <button
          className={`language-toggle ${
            isSwitchingLanguage ? "switching" : ""
          }`}
          onClick={() => {
            setIsSwitchingLanguage(true);
            setLanguage(language === "ar" ? "en" : "ar");
            setTimeout(() => setIsSwitchingLanguage(false), 600);
          }}
          aria-label={language === "ar" ? t.switchToEnglish : t.switchToArabic}
          title={language === "ar" ? t.switchToEnglish : t.switchToArabic}
        >
          {language === "ar" ? t.switchToEnglish : t.switchToArabic}
        </button>
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
          {t.listVersionsTab}
        </button>
        <button
          className={`tab-button ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          {t.addUpdateVersionTab}
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
