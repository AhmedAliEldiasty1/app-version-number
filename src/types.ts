/**
 * Shared TypeScript types for the App Version Manager
 */

/**
 * School configuration
 */
export interface SchoolConfig {
  name: string;
  baseUrl: string;
}

/**
 * App configurations object type
 */
export interface AppConfigs {
  [key: string]: SchoolConfig;
}

/**
 * Version data interface
 */
export interface VersionData {
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
 * App type configuration
 */
export interface AppType {
  value: string;
  name: string;
  icon: string;
}

/**
 * Platform option
 */
export interface PlatformOption {
  value: string;
  label: string;
  icon: string;
}

/**
 * Status option
 */
export interface StatusOption {
  value: string;
  label: string;
  icon: string;
}

/**
 * Form data for version submission
 */
export interface SubmitVersionData {
  version: string;
  type: string;
  is_active: boolean;
}

/**
 * API Response interface
 */
export interface ApiResponse {
  data: VersionData[];
}

/**
 * API Error response
 */
export interface ApiErrorResponse {
  message?: string;
  error?: string;
}
