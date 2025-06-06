import axios from "axios";
import { sanitizeData } from "./axios-sanitizer";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor
api.interceptors.request.use(
  (request) => {
    console.log("Request:", {
      url: request.url,
      method: request.method,
      headers: request.headers,
      data: request.data,
    });
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      const sanitizedResponse = { ...response };
      if (sanitizedResponse.data) {
        sanitizedResponse.data = sanitizeData(sanitizedResponse.data);
      }
      console.log("Response:", {
        status: sanitizedResponse.status,
        data: sanitizedResponse.data,
      });
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("Error:", {
        message: error.message,
        response: error.response
          ? {
              status: error.response.status,
              data: sanitizeData(error.response.data),
            }
          : null,
      });
    }
    return Promise.reject(error);
  },
);
