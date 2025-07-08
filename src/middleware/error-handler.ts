import { Context } from "hono";
import { ApiResponse } from "../types";
import { isDevelopment } from "@/utils";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (err: Error, c: Context) => {
  const appError = err as AppError;
  const statusCode = appError.statusCode ?? 500;
  const message = appError.message || "Internal Server Error";

  const response: ApiResponse = {
    success: false,
    error: message,
  };

  if (isDevelopment) {
    response.data = {
      stack: appError.stack,
      statusCode,
    };
  }

  return c.json(response, statusCode as 404 | 500);
};

export const notFound = (c: Context) => {
  const response: ApiResponse = {
    success: false,
    error: `Route ${c.req.url} not found`,
  };

  return c.json(response, 404);
};
