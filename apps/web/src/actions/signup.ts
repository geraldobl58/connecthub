"use server";

import { authHttpService, SignupResponse } from "@/http/auth";
import { getErrorMessage } from "@/lib/error-utils";
import { SignupValues, signupSchema } from "@/schemas/signup";
import { ActionResult } from "./auth";

export async function signupAction(
  data: SignupValues
): Promise<ActionResult<SignupResponse>> {
  try {
    const validatedData = signupSchema.parse(data);
    const response = await authHttpService.signup(validatedData);

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
