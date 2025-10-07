"use server";

import { stageHttpService } from "@/http/stage";
import { getErrorMessage } from "@/lib/error-utils";
import { ActionResult } from "@/types/common";
import {
  StageResponse,
  StagePaginatedResponse,
  CreateStageRequest,
  UpdateStageRequest,
  ReorderStagesRequest,
  CreateStageResponse,
  UpdateStageResponse,
  ReorderStagesResponse,
} from "@/types/stages";

export async function getStagesAction(): Promise<
  ActionResult<StagePaginatedResponse>
> {
  try {
    const stages = await stageHttpService.getStages();

    return {
      success: true,
      data: stages,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function getStageByIdAction(
  id: string
): Promise<ActionResult<StageResponse>> {
  try {
    const stage = await stageHttpService.getStageById(id);

    return {
      success: true,
      data: stage,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function createStageAction(
  stageData: CreateStageRequest
): Promise<ActionResult<CreateStageResponse>> {
  try {
    const stage = await stageHttpService.createStage(stageData);

    return {
      success: true,
      data: stage,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function updateStageAction(
  id: string,
  stageData: UpdateStageRequest
): Promise<ActionResult<UpdateStageResponse>> {
  try {
    const stage = await stageHttpService.updateStage(id, stageData);

    return {
      success: true,
      data: stage,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function deleteStageAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    await stageHttpService.deleteStage(id);

    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function reorderStagesAction(
  reorderData: ReorderStagesRequest
): Promise<ActionResult<ReorderStagesResponse[]>> {
  try {
    const stages = await stageHttpService.reorderStages(reorderData);

    return {
      success: true,
      data: stages,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}