"use server";

import { authHttpService } from "@/http/auth";
import { SignupResponse } from "@/types/auth";
import { getErrorMessage } from "@/lib/error-utils";
import { SignupValues, signupSchema } from "@/schemas/signup";
import { ActionResult } from "@/types/common";

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
