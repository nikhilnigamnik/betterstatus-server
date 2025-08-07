import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export const handleResponse = (c: Context, data: any, statusCode: number) => {
  return c.json(data, statusCode as ContentfulStatusCode);
};

export const handleError = (c: Context, message: string, statusCode: number) => {
  return c.json({ message }, statusCode as ContentfulStatusCode);
};
