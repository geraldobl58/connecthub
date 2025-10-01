"use server";

import { userHttpService } from "@/http/user";
import { getErrorMessage } from "@/lib/error-utils";
import { ActionResult } from "@/types/common";
import {
  UserPaginatedResponse,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserListParams,
  CreateUserResponse,
  UpdateUserResponse,
} from "@/types/users";

export async function getUsersAction(
  params?: UserListParams
): Promise<ActionResult<UserPaginatedResponse>> {
  try {
    const users = await userHttpService.getUsers(params);

    return {
      success: true,
      data: users,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function getUserByIdAction(
  id: string
): Promise<ActionResult<UserResponse>> {
  try {
    const user = await userHttpService.getUserById(id);

    return {
      success: true,
      data: user,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function createUserAction(
  userData: CreateUserRequest
): Promise<ActionResult<CreateUserResponse>> {
  try {
    const user = await userHttpService.createUser(userData);

    return {
      success: true,
      data: user,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function updateUserAction(
  id: string,
  userData: UpdateUserRequest
): Promise<ActionResult<UpdateUserResponse>> {
  try {
    const user = await userHttpService.updateUser(id, userData);

    return {
      success: true,
      data: user,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function deleteUserAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    await userHttpService.deleteUser(id);

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

export async function toggleUserStatusAction(
  id: string,
  isActive: boolean
): Promise<ActionResult<UpdateUserResponse>> {
  try {
    const user = await userHttpService.toggleUserStatus(id, isActive);

    return {
      success: true,
      data: user,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}
