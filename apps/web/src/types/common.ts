// Common types used across the application

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Error types for better error handling
export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
      statusCode?: number;
    };
  };
  message?: string;
}
