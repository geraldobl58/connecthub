"use server";

import { propertyHttpService } from "@/http/property";
import {
  CreatePropertyData,
  UpdatePropertyData,
  PropertyFilters,
} from "@/types/property";
import { getErrorMessage } from "@/lib/error-utils";
import { ActionResult } from "@/types/common";
import { Property } from "@/types/property";

export async function getPropertiesAction(
  filters: PropertyFilters = {}
): Promise<
  ActionResult<{
    data: Property[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>
> {
  try {
    const response = await propertyHttpService.getAll(filters);
    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function getPropertyByIdAction(
  id: string
): Promise<ActionResult<Property>> {
  try {
    const property = await propertyHttpService.getById(id);
    return {
      success: true,
      data: property,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function createPropertyAction(
  data: CreatePropertyData
): Promise<ActionResult<Property>> {
  try {
    const property = await propertyHttpService.create(data);
    return {
      success: true,
      data: property,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function updatePropertyAction(
  id: string,
  data: UpdatePropertyData
): Promise<ActionResult<Property>> {
  try {
    const property = await propertyHttpService.update(id, data);
    return {
      success: true,
      data: property,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function deletePropertyAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    await propertyHttpService.delete(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}
