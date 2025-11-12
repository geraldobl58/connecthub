import { GetProfileResponse, GetProfileApiResponse } from "../types";
import { api } from "@/lib/api-client";

/**
 * Fetches current user profile information
 * Requires authentication token
 * @returns Promise with user profile data
 * @throws HTTPError if the request fails
 */
export async function getProfile(): Promise<GetProfileResponse> {
  const response = await api.get("auth/profile").json<GetProfileApiResponse>();

  // Extract username from email (before @)
  const username = response.email.split("@")[0];

  // Transform API response to standardized format
  return {
    success: true,
    message: "Profile retrieved successfully",
    data: {
      id: response.userId,
      name: response.name,
      username: username,
      email: response.email,
      tenantId: response.tenantId,
      planName: response.tenant.plan,
      expiresAt: response.tenant.planExpiresAt,
      avatar: response.avatar || undefined,
      twoFactorEnabled: false,
    },
  };
}

// Re-export avatar HTTP functions
export { uploadAvatar } from "./avatar";

// Re-export change password HTTP functions
export { changePassword } from "./change-password";

// Re-export 2FA HTTP functions
export { generate2FA, enable2FA, disable2FA, check2FAStatus, regenerateBackupCodes } from "./two-factor";
