export interface ForgotPasswordRequest {
  email: string;
  tenantId: string;
}

export interface ForgotPasswordApiResponse {
  message: string;
  success: boolean;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}
