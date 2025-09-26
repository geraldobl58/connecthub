"use server";

import {
  planHttpService,
  PlanInfo,
  PlanUpgradeRequest,
  PlanRenewalRequest,
} from "@/http/plan";
import { getErrorMessage } from "@/lib/error-utils";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server action para buscar plano atual
 */
export async function getCurrentPlanAction(): Promise<ActionResult<PlanInfo>> {
  try {
    const plan = await planHttpService.getCurrentPlan();
    return {
      success: true,
      data: plan,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

/**
 * Server action para fazer upgrade do plano
 */
export async function upgradePlanAction(
  request: PlanUpgradeRequest
): Promise<ActionResult<PlanInfo>> {
  try {
    const result = await planHttpService.upgradePlan(request);
    return {
      success: true,
      data: result.newPlan,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

/**
 * Server action para renovar plano
 */
export async function renewPlanAction(
  request: PlanRenewalRequest
): Promise<ActionResult<PlanInfo>> {
  try {
    const result = await planHttpService.renewPlan(request);
    return {
      success: true,
      data: result.plan,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

/**
 * Server action para cancelar plano
 */
export async function cancelPlanAction(): Promise<
  ActionResult<{ success: boolean; message: string }>
> {
  try {
    const result = await planHttpService.cancelPlan();
    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

/**
 * Server action para buscar histórico de planos
 */
export async function getPlanHistoryAction(): Promise<
  ActionResult<PlanInfo[]>
> {
  try {
    const history = await planHttpService.getPlanHistory();
    return {
      success: true,
      data: history,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}
