/**
 * Translations for Arabic and English
 */

import { ar } from "./ar";
import { en } from "./en";

export interface Translations {
  // Header
  appTitle: string;
  appSubtitle: string;

  // Configuration Section
  configurationTitle: string;
  selectSchool: string;
  selectSchoolPlaceholder: string;
  selectAppType: string;
  selectAppTypePlaceholder: string;
  apiBaseUrl: string;
  apiBaseUrlHelp: string;
  required: string;

  // App Types
  employeeApp: string;
  parentApp: string;
  ta3lomApp: string;

  // Tabs
  listVersionsTab: string;
  addUpdateVersionTab: string;

  // Version List
  appVersionsTitle: string;
  platform: string;
  ios: string;
  android: string;
  refreshData: string;
  loading: string;
  loadingVersions: string;
  version: string;
  active: string;
  inactive: string;
  app: string;
  created: string;
  updated: string;
  noDataMessage: string;
  selectConfigMessage: string;
  noVersionsFound: string;
  clickToToggle: string;
  togglingStatus: string;
  updating: string;

  // Version Form
  addUpdateVersionTitle: string;
  configRequired: string;
  configRequiredMessage: string;
  versionNumber: string;
  versionPlaceholder: string;
  versionHelp: string;
  platformType: string;
  selectPlatformPlaceholder: string;
  status: string;
  selectStatusPlaceholder: string;
  statusHelp: string;
  submittingVersion: string;
  saveVersion: string;
  resetForm: string;

  // Messages
  errorPrefix: string;
  successPrefix: string;
  versionSavedSuccess: string;
  versionActivated: string;
  versionDeactivated: string;
  selectBothMessage: string;
  invalidVersionFormat: string;
  failedToSave: string;
  requestFailed: string;

  // Language Toggle
  language: string;
  switchToEnglish: string;
  switchToArabic: string;

  // School Manager
  addNewSchool: string;
  addSchoolTitle: string;
  schoolKey: string;
  schoolKeyPlaceholder: string;
  schoolKeyHelp: string;
  schoolName: string;
  schoolNamePlaceholder: string;
  schoolNameHelp: string;
  apiBaseUrlLabel: string;
  apiBaseUrlPlaceholder: string;
  apiBaseUrlHelpText: string;
  schoolKeyRequired: string;
  schoolNameRequired: string;
  apiUrlRequired: string;
  invalidUrlFormat: string;
  schoolAddedSuccess: string;
  cancel: string;
  save: string;
  close: string;

  // School List & Delete
  viewCustomSchools: string;
  viewAllSchools: string;
  customSchoolsTitle: string;
  allSchoolsTitle: string;
  deleteSchool: string;
  confirmDeleteSchool: string;
  deleteConfirm: string;
  schoolDeletedSuccess: string;
  noCustomSchools: string;
  noSchools: string;
  builtIn: string;
  cannotDeleteBuiltIn: string;

  // Cloud Sync
  cloudSync: string;
  uploadToCloud: string;
  downloadFromCloud: string;
  syncedToCloud: string;
  syncedFromCloud: string;
  syncError: string;
  cloudSyncEnabled: string;
  cloudSyncDisabled: string;
  cloudSyncHelp: string;
}

export const translations: Record<"ar" | "en", Translations> = {
  ar,
  en,
};
