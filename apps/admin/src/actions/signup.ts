"use server";

import { authService, SignupResponse } from "@/services/auth.service";
import { SignupValues, signupSchema } from "@/schemas/signup";
import { ActionResult } from "./auth";

export async function signupAction(
  data: SignupValues
): Promise<ActionResult<SignupResponse>> {
  try {
    const validatedData = signupSchema.parse(data);
    const response = await authService.signup(validatedData);

    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: authService.getErrorMessage(error),
    };
  }
}
