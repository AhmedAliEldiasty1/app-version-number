/**
 * English translations
 */

import { Translations } from "./translations";

export const en: Translations = {
  // Header
  appTitle: "📱 App Version Manager",
  appSubtitle: "Manage mobile app versions for different applications",

  // Configuration Section
  configurationTitle: "🔧 Configuration",
  selectSchool: "Select School",
  selectSchoolPlaceholder: "Choose a school...",
  selectAppType: "Select App Type",
  selectAppTypePlaceholder: "Choose an app type...",
  apiBaseUrl: "API Base URL",
  apiBaseUrlHelp:
    "This URL is used for all API requests to the selected school",
  required: "*",

  // App Types
  employeeApp: "👨‍💼 Employee App",
  parentApp: "👨‍👩‍👧 Parent App",
  ta3lomApp: "📚 Ta3lom App",

  // Tabs
  listVersionsTab: "📋 List Versions",
  addUpdateVersionTab: "➕ Add/Update Version",

  // Version List
  appVersionsTitle: "📱 App Versions",
  platform: "Platform",
  ios: "iOS",
  android: "Android",
  huawei: "Huawei",
  all: "All Platforms",
  refreshData: "🔄 Refresh Data",
  loading: "⏳ Loading",
  loadingVersions: "⏳ Loading versions...",
  version: "Version",
  active: "Active",
  inactive: "Inactive",
  app: "App",
  created: "Created",
  updated: "Updated",
  noDataMessage: "No data available",
  selectConfigMessage:
    "Select both school and app type from the configuration section above",
  noVersionsFound: 'No versions found. Click "Refresh Data" to load versions.',
  clickToToggle: "Click to toggle status",
  togglingStatus: "Toggling status...",
  updating: "⏳ Updating...",

  // Version Form
  addUpdateVersionTitle: "➕ Add/Update Version",
  configRequired: "⚠️ Configuration Required",
  configRequiredMessage:
    "Please select both school and app type from the configuration section first.",
  versionNumber: "Version Number",
  versionPlaceholder: "e.g., 1.0.0",
  versionHelp: "Use semantic versioning format (e.g., 1.0.0, 2.1.3)",
  platformType: "Platform Type",
  selectPlatformPlaceholder: "Select platform...",
  status: "Status",
  selectStatusPlaceholder: "Select status...",
  statusHelp: "Active versions will be available for app updates",
  submittingVersion: "⏳ Submitting version...",
  saveVersion: "💾 Save Version",
  resetForm: "🔄 Reset Form",

  // Messages
  errorPrefix: "Error",
  successPrefix: "Success",
  versionSavedSuccess: "Version saved successfully!",
  versionActivated: "activated",
  versionDeactivated: "deactivated",
  selectBothMessage: "Please select both school and app type first",
  invalidVersionFormat: "Please enter a valid version number (e.g., 1.0.0)",
  failedToSave: "Failed to save version",
  requestFailed: "Request failed",

  // Language Toggle
  language: "Language",
  switchToEnglish: "English",
  switchToArabic: "العربية",

  // School Manager
  addNewSchool: "Add New School",
  addSchoolTitle: "🏫 Add New School Configuration",
  schoolKey: "School Key (ID)",
  schoolKeyPlaceholder: "e.g., my-school",
  schoolKeyHelp: "Lowercase letters, numbers, and hyphens only",
  schoolName: "School Name",
  schoolNamePlaceholder: "e.g., My School Name",
  schoolNameHelp: "Display name for the school",
  apiBaseUrlLabel: "API Base URL",
  apiBaseUrlPlaceholder: "https://api.example.com/api/v1/en",
  apiBaseUrlHelpText: "Full API endpoint URL (must start with https://)",
  schoolKeyRequired: "School key is required",
  schoolNameRequired: "School name is required",
  apiUrlRequired: "API URL is required",
  invalidUrlFormat: "Invalid URL format",
  schoolAddedSuccess: "School added successfully!",
  cancel: "❌ Cancel",
  save: "💾 Save",
  close: "✕ Close",

  // School List & Delete
  viewCustomSchools: "View Custom Schools",
  viewAllSchools: "View All Schools",
  customSchoolsTitle: "📋 Custom Schools",
  allSchoolsTitle: "📋 All Schools",
  updateSchool: "✏️ Update School",
  updateSchoolTitle: "🏫 Update School Configuration",
  schoolUpdatedSuccess: "School updated successfully!",
  deleteSchool: "🗑️ Delete School",
  confirmDeleteSchool: "⚠️ Are you sure you want to delete this school?",
  deleteConfirm: "🗑️ Delete",
  schoolDeletedSuccess: "School deleted successfully!",
  noCustomSchools: "No custom schools added yet",
  noSchools: "No schools available",
  builtIn: "Built-in",
  cannotDeleteBuiltIn: "Cannot delete built-in schools",

  // Cloud Sync
  cloudSync: "Cloud Sync",
  uploadToCloud: "Upload to Cloud",
  downloadFromCloud: "Download from Cloud",
  syncedToCloud: "Uploaded to cloud successfully!",
  syncedFromCloud: "Downloaded from cloud successfully!",
  syncError: "Sync error. Check your connection.",
  cloudSyncEnabled: "Cloud sync enabled",
  cloudSyncDisabled: "Cloud sync disabled",
  cloudSyncHelp:
    "💡 Enable cloud sync to share schools across all your devices",
};
