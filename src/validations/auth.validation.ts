import { z } from "zod";

export const VALID_PROVIDERS = ["email", "google", "github"] as const;

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format")
      .transform((email) => email.toLowerCase().trim()),
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .transform((name) => name.trim()),
    provider: z.enum(VALID_PROVIDERS, {
      errorMap: () => ({
        message: `Provider must be one of: ${VALID_PROVIDERS.join(", ")}`,
      }),
    }),
    password: z
      .string()
      .optional()
      .refine((password) => {
        if (password === undefined) return true;
        return password.length >= 8;
      }, "Password must be at least 8 characters long")
      .refine((password) => {
        if (password === undefined) return true;
        return /(?=.*[a-z])/.test(password);
      }, "Password must contain at least one lowercase letter")
      .refine((password) => {
        if (password === undefined) return true;
        return /(?=.*[A-Z])/.test(password);
      }, "Password must contain at least one uppercase letter")
      .refine((password) => {
        if (password === undefined) return true;
        return /(?=.*\d)/.test(password);
      }, "Password must contain at least one number"),
  })
  .refine(
    (data) => {
      if (data.provider === "email" && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required for email signup",
      path: ["password"],
    }
  );
