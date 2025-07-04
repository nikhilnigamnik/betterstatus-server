export const STATUS_CODE = {
  OK: 200 as const,
  SUCCESS: 200 as const,
  CREATED: 201 as const,
  BAD_REQUEST: 400 as const,
  UNAUTHORIZED: 401 as const,
  CONFLICT: 409 as const,
  NOT_FOUND: 404 as const,
  INTERNAL_SERVER_ERROR: 500 as const,
  UNPROCESSABLE_ENTITY: 422 as const,
  TOO_MANY_REQUESTS: 429 as const,
} as const;
