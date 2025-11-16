import { encrypt } from "./security";

/**
 * Encrypted API Configuration
 * This file contains encrypted API endpoints for security
 */

interface SchoolConfig {
  name: string;
  baseUrl: string;
}

interface AppConfigs {
  [key: string]: SchoolConfig;
}

// Original configurations (will be encrypted)
const ORIGINAL_CONFIGS: AppConfigs = {
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

// Encrypt each configuration
const encryptedConfigs: { [key: string]: string } = {};
Object.keys(ORIGINAL_CONFIGS).forEach((key) => {
  encryptedConfigs[key] = encrypt(JSON.stringify(ORIGINAL_CONFIGS[key]));
});

// Export encrypted configurations
export const ENCRYPTED_APP_CONFIGS = encryptedConfigs;

// Export original for development (remove in production)
export const APP_CONFIGS = ORIGINAL_CONFIGS;

/**
 * Get decrypted configuration by key
 */
export const getConfig = (key: string): SchoolConfig | null => {
  // In development, return original config
  if (process.env.NODE_ENV === "development") {
    return APP_CONFIGS[key] || null;
  }

  // In production, decrypt the config
  try {
    const encrypted = ENCRYPTED_APP_CONFIGS[key];
    if (!encrypted) return null;

    const { decrypt } = require("./security");
    const decrypted = decrypt(encrypted);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Failed to decrypt config:", error);
    return null;
  }
};

/**
 * Get all configuration keys
 */
export const getConfigKeys = (): string[] => {
  return Object.keys(APP_CONFIGS);
};
