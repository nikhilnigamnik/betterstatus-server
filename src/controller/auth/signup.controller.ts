import { userService } from "@/services/user";
import { Context } from "hono";
import { STATUS_CODE } from "@/constants/status-code";
import { hashPassword } from "@/lib/password";
import { parseRequest } from "@/lib/request";
import { signupSchema } from "@/validations/auth.validation";

export const signupController = async (c: Context) => {
  try {
    const { body, errors } = await parseRequest(c, signupSchema);

    if (errors.length > 0) {
      return c.json(
        {
          message: "Validation failed",
          errors,
        },
        STATUS_CODE.BAD_REQUEST
      );
    }

    const { email, password, name, provider } = body;

    const authProvider = provider as "email" | "google" | "github";

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return c.json(
        {
          message: "User with this email already exists",
        },
        STATUS_CODE.CONFLICT
      );
    }

    let userData;

    if (authProvider === "email") {
      const hashedPassword = await hashPassword(password);
      userData = {
        email,
        password: hashedPassword,
        name,
        auth_provider: authProvider,
        role: "user" as const,
        is_active: true,
        email_verified_at: null,
      };
    } else {
      userData = {
        email,
        password: "",
        name,
        auth_provider: authProvider,
        role: "user" as const,
        is_active: true,
        email_verified_at: new Date(),
      };
    }

    await userService.createUser(userData);

    return c.json(
      {
        message:
          authProvider === "email"
            ? "Account created successfully. Please check your email for verification."
            : "Account created successfully",
      },
      STATUS_CODE.CREATED
    );
  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof Error) {
      if (
        error.message.includes("duplicate key") ||
        error.message.includes("unique constraint")
      ) {
        return c.json(
          {
            message: "User with this email already exists",
          },
          STATUS_CODE.CONFLICT
        );
      }
    }

    return c.json(
      {
        message: "Internal server error",
      },
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};
