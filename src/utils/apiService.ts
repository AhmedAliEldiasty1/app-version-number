import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { sanitizeInput, validateApiResponse, apiRateLimiter } from "./security";

/**
 * Secure API Service
 * Handles all API requests with security measures
 */

class SecureApiService {
  private axiosInstance: AxiosInstance;
  private readonly timeout: number;

  constructor() {
    this.timeout = 30000; // 30 seconds

    // Create axios instance with security headers
    this.axiosInstance = axios.create({
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    // Add request interceptor for security
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Check rate limiting
        if (!apiRateLimiter.canMakeRequest()) {
          console.warn(
            "Rate limit exceeded. Please wait before making more requests."
          );
          return Promise.reject(new Error("Rate limit exceeded"));
        }

        // Add timestamp to prevent replay attacks
        if (config.headers) {
          config.headers["X-Request-Time"] = Date.now().toString();
        }

        // Log request (only in development)
        if (process.env.NODE_ENV === "development") {
          console.debug("API Request:", {
            method: config.method,
            url: config.url,
            timestamp: new Date().toISOString(),
          });
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for validation
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Validate response
        if (response.data && !validateApiResponse(response.data)) {
          console.error("Invalid API response detected");
          return Promise.reject(new Error("Invalid API response"));
        }

        return response;
      },
      (error) => {
        // Handle errors securely
        const sanitizedError = this.sanitizeError(error);
        return Promise.reject(sanitizedError);
      }
    );
  }

  /**
   * Sanitize error messages to prevent information leakage
   */
  private sanitizeError(error: any): Error {
    const sanitizedMessage =
      error.response?.data?.message || error.message || "An error occurred";

    // Don't expose detailed error information in production
    if (process.env.NODE_ENV === "production") {
      return new Error("Request failed. Please try again.");
    }

    return new Error(sanitizeInput(sanitizedMessage));
  }

  /**
   * Secure GET request
   */
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Secure POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      // Sanitize input data
      const sanitizedData = this.sanitizeData(data);
      const response = await this.axiosInstance.post<T>(
        url,
        sanitizedData,
        config
      );
      return response;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Secure PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      const sanitizedData = this.sanitizeData(data);
      const response = await this.axiosInstance.patch<T>(
        url,
        sanitizedData,
        config
      );
      return response;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Sanitize data before sending
   */
  private sanitizeData(data: any): any {
    if (typeof data === "string") {
      return sanitizeInput(data);
    }

    if (typeof data === "object" && data !== null) {
      const sanitized: any = Array.isArray(data) ? [] : {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeData(data[key]);
        }
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus(): { remaining: number; maxRequests: number } {
    return {
      remaining: apiRateLimiter.getRemainingRequests(),
      maxRequests: 20,
    };
  }
}

// Export singleton instance
export const secureApi = new SecureApiService();
