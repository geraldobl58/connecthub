"use server";

import { userHttpService } from "@/http/user";
import { getErrorMessage } from "@/lib/error-utils";
import { UserPaginatedResponse } from "@/types/users";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getUsersAction(): Promise<
  ActionResult<UserPaginatedResponse>
> {
  try {
    const users = await userHttpService.getUsers();

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
