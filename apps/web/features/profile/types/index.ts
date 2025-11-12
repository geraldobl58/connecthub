export interface GetProfileApiResponse {
  userId: string;
  email: string;
  name: string;
  avatar: string | null;
  tenantId: string;
  tenant: {
    id: string;
    plan: string;
    planExpiresAt: string;
  };
}

export interface GetProfileResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    name: string;
    username: string;
    email: string;
    tenantId: string;
    planName: string;
    expiresAt: string;
    avatar?: string | null;
    twoFactorEnabled: boolean;
  };
}

// Re-export avatar types
export type { UploadAvatarApiResponse, UploadAvatarResponse } from "./avatar";

// Re-export change password types
export type {
  ChangePasswordApiResponse,
  ChangePasswordResponse,
} from "./change-password";

// Re-export 2FA types
export type {
  Generate2FAApiResponse,
  Generate2FAResponse,
  Enable2FAApiResponse,
  Enable2FAResponse,
  Disable2FAApiResponse,
  Disable2FAResponse,
  Check2FAStatusApiResponse,
  Check2FAStatusResponse,
  RegenerateBakupCodesApiResponse,
  RegenerateBakupCodesResponse,
} from "./two-factor";
