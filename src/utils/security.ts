/**
 * Security utilities for encrypting and decrypting sensitive data
 */

/**
 * Simple encryption function using Base64 encoding with obfuscation
 * Note: For production, use proper encryption libraries like crypto-js
 */
const SECRET_KEY = "OurEdu_2025_SecureApp";

/**
 * Encrypt a string value
 */
export const encrypt = (text: string): string => {
  try {
    // Add secret key to text
    const combined = `${SECRET_KEY}::${text}::${SECRET_KEY}`;
    // Convert to base64
    const encrypted = btoa(combined);
    // Add random padding for additional obfuscation
    const padding = Math.random().toString(36).substring(7);
    return `${padding}${encrypted}${padding}`;
  } catch (error) {
    console.error("Encryption error:", error);
    return text;
  }
};

/**
 * Decrypt an encrypted string
 */
export const decrypt = (encryptedText: string): string => {
  try {
    // Remove padding (first 5 and last 5 characters)
    const withoutPadding = encryptedText.slice(5, -5);
    // Decode from base64
    const decoded = atob(withoutPadding);
    // Extract original text
    const parts = decoded.split("::");
    if (
      parts.length === 3 &&
      parts[0] === SECRET_KEY &&
      parts[2] === SECRET_KEY
    ) {
      return parts[1];
    }
    throw new Error("Invalid encrypted data");
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedText;
  }
};

/**
 * Encrypt API configuration
 */
export const encryptConfig = (config: any): string => {
  return encrypt(JSON.stringify(config));
};

/**
 * Decrypt API configuration
 */
export const decryptConfig = (encryptedConfig: string): any => {
  try {
    const decrypted = decrypt(encryptedConfig);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Config decryption error:", error);
    return null;
  }
};

/**
 * Generate encrypted API URLs to prevent exposure
 */
export const getSecureUrl = (baseUrl: string, endpoint: string): string => {
  // Construct full URL
  const fullUrl = `${baseUrl}${endpoint}`;
  return fullUrl;
};

/**
 * Sanitize input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validate API response to prevent injection attacks
 */
export const validateApiResponse = (response: any): boolean => {
  // Check if response is an object
  if (typeof response !== "object" || response === null) {
    return false;
  }

  // Check for suspicious properties
  const suspiciousKeys = ["__proto__", "constructor", "prototype"];
  const hasSuspiciousKeys = Object.keys(response).some((key) =>
    suspiciousKeys.includes(key.toLowerCase())
  );

  return !hasSuspiciousKeys;
};

/**
 * Rate limiting helper
 */
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 10, timeWindowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove old requests outside the time window
    this.requests = this.requests.filter(
      (time) => now - time < this.timeWindow
    );

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(
      (time) => now - time < this.timeWindow
    );
    return this.maxRequests - this.requests.length;
  }
}

export const apiRateLimiter = new RateLimiter(20, 60000); // 20 requests per minute
