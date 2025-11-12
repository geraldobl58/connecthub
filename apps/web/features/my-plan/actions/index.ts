"use server";

import { HTTPError } from "ky";
import {
  getCurrentPlan,
  upgradePlan,
  getAvailablePlans,
  cancelPlan,
  getPlanHistory,
  getPlanHistoryDetailed,
  reactivatePlan,
  createCheckoutSession,
  createBillingPortalSession,
  validateSubscription,
} from "../http";
import {
  PlanCurrentInfoResponse,
  PlanUpgradeDto,
  PlanUpgradeResponse,
} from "../types";
import type {
  AvailablePlan,
  CancelResponse,
  PlanHistoryResponse,
  PlanHistoryDetailEvent,
  CheckoutSessionResponse,
  BillingPortalResponse,
  ValidationResponse,
} from "../http";

export async function getCurrentPlanAction(): Promise<PlanCurrentInfoResponse> {
  try {
    const response = await getCurrentPlan();

    if (!response.success) {
      return {
        success: false,
        message: "Failed to retrieve current plan",
      };
    }

    return {
      success: true,
      message: "Current plan retrieved successfully",
      data: response.data,
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as { message?: string };
        return {
          success: false,
          message:
            errorData.message ||
            "Error retrieving current plan. Please try again.",
        };
      } catch {
        return {
          success: false,
          message: "Error processing server response.",
        };
      }
    }

    return {
      success: false,
      message: "Unexpected error. Please try again later.",
    };
  }
}

export async function getAvailablePlansAction(): Promise<{
  success: boolean;
  message: string;
  data?: AvailablePlan[];
}> {
  try {
    const response = await getAvailablePlans();

    return {
      success: true,
      message: "Available plans retrieved successfully",
      data: response,
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as { message?: string };
        return {
          success: false,
          message:
            errorData.message ||
            "Error retrieving available plans. Please try again.",
        };
      } catch {
        return {
          success: false,
          message: "Error processing server response.",
        };
      }
    }

    return {
      success: false,
      message: "Unexpected error. Please try again later.",
    };
  }
}

export async function upgradePlanAction(
  dto: PlanUpgradeDto
): Promise<PlanUpgradeResponse> {
  try {
    const response = await upgradePlan(dto);

    return {
      success: true,
      message: response.message || "Plan upgraded successfully",
      newPlan: response.newPlan,
      nextBillingDate: response.nextBillingDate,
    };
  } catch (error) {
    const errorResponse: PlanUpgradeResponse = {
      success: false,
      message: "Unexpected error. Please try again later.",
      newPlan: {
        id: "",
        name: "",
        price: 0,
        currency: "",
        hasAPI: false,
        description: "",
        planExpiresAt: "",
        createdAt: "",
        status: "",
      },
      nextBillingDate: "",
    };

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as { message?: string };
        errorResponse.message =
          errorData.message || "Error upgrading plan. Please try again.";
        return errorResponse;
      } catch {
        errorResponse.message = "Error processing server response.";
        return errorResponse;
      }
    }

    return errorResponse;
  }
}

export async function cancelPlanAction(): Promise<CancelResponse> {
  try {
    const response = await cancelPlan();

    return {
      success: true,
      message: response.message || "Plan cancelled successfully",
    };
  } catch (error) {
    const errorResponse: CancelResponse = {
      success: false,
      message: "Unexpected error. Please try again later.",
    };

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as { message?: string };
        errorResponse.message =
          errorData.message || "Error cancelling plan. Please try again.";
        return errorResponse;
      } catch {
        errorResponse.message = "Error processing server response.";
        return errorResponse;
      }
    }

    return errorResponse;
  }
}

export async function getPlanHistoryAction(): Promise<{
  success: boolean;
  message: string;
  data?: PlanHistoryResponse;
}> {
  try {
    const response = await getPlanHistory();

    return {
      success: true,
      message: "Plan history retrieved successfully",
      data: response,
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as { message?: string };
        return {
          success: false,
          message:
            errorData.message ||
            "Error retrieving plan history. Please try again.",
        };
      } catch {
        return {
          success: false,
          message: "Error processing server response.",
        };
      }
    }

    return {
      success: false,
      message: "Unexpected error. Please try again later.",
    };
  }
}

export async function getPlanHistoryDetailedAction(): Promise<{
  success: boolean;
  message: string;
  data?: PlanHistoryDetailEvent[];
}> {
  try {
    const response = await getPlanHistoryDetailed();

    return {
      success: true,
      message: "Plan history retrieved successfully",
      data: response,
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as { message?: string };
        return {
          success: false,
          message:
            errorData.message ||
            "Error retrieving plan history. Please try again.",
        };
      } catch {
        return {
          success: false,
          message: "Error processing server response.",
        };
      }
    }

    return {
      success: false,
      message: "Unexpected error. Please try again later.",
    };
  }
}

export async function reactivatePlanAction(): Promise<CancelResponse> {
  try {
    const response = await reactivatePlan();

    return {
      success: true,
      message: response.message || "Plan reactivated successfully",
    };
  } catch (error) {
    const errorResponse: CancelResponse = {
      success: false,
      message: "Unexpected error. Please try again later.",
    };

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as { message?: string };
        errorResponse.message =
          errorData.message || "Error reactivating plan. Please try again.";
        return errorResponse;
      } catch {
        errorResponse.message = "Error processing server response.";
        return errorResponse;
      }
    }

    return errorResponse;
  }
}

export async function createCheckoutSessionAction(dto: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: CheckoutSessionResponse;
}> {
  try {
    const response = await createCheckoutSession(dto);

    return {
      success: true,
      message: "Checkout session created successfully",
      data: response,
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as { message?: string };
        return {
          success: false,
          message:
            errorData.message ||
            "Error creating checkout session. Please try again.",
        };
      } catch {
        return {
          success: false,
          message: "Error processing server response.",
        };
      }
    }

    return {
      success: false,
      message: "Unexpected error. Please try again later.",
    };
  }
}

export async function createBillingPortalSessionAction(dto: {
  returnUrl: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: BillingPortalResponse;
}> {
  try {
    const response = await createBillingPortalSession(dto);

    return {
      success: true,
      message: "Billing portal session created successfully",
      data: response,
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as { message?: string };
        return {
          success: false,
          message:
            errorData.message ||
            "Error creating billing portal session. Please try again.",
        };
      } catch {
        return {
          success: false,
          message: "Error processing server response.",
        };
      }
    }

    return {
      success: false,
      message: "Unexpected error. Please try again later.",
    };
  }
}

export async function validateSubscriptionAction(): Promise<{
  success: boolean;
  message: string;
  data?: ValidationResponse;
}> {
  try {
    const response = await validateSubscription();

    return {
      success: true,
      message: "Subscription validated successfully",
      data: response,
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as { message?: string };
        return {
          success: false,
          message:
            errorData.message ||
            "Error validating subscription. Please try again.",
        };
      } catch {
        return {
          success: false,
          message: "Error processing server response.",
        };
      }
    }

    return {
      success: false,
      message: "Unexpected error. Please try again later.",
    };
  }
}
