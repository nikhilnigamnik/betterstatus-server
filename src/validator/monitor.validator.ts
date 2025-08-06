import { z } from 'zod';

export const createMonitorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  base_url: z.string().url('Invalid URL'),
  description: z.string().optional(),
  http_method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']).default('GET'),
  image_url: z.string().url('Invalid image URL').optional(),
  headers: z.record(z.string(), z.string()).optional(),
  request_body: z.record(z.string(), z.string()).optional(),
  expected_status_code: z
    .number()
    .min(100, 'Status code must be between 100 and 599')
    .max(599, 'Status code must be between 100 and 599')
    .optional(),
  check_interval: z.number().min(1, 'Check interval must be at least 1 second').optional(),
  email_notifications: z.boolean().optional(),
  slack_notifications: z.boolean().optional(),
  teams_notifications: z.boolean().optional(),
  discord_notifications: z.boolean().optional(),
  slack_webhook_url: z.string().url('Invalid Slack webhook URL').optional(),
  teams_webhook_url: z.string().url('Invalid Teams webhook URL').optional(),
  discord_webhook_url: z.string().url('Invalid Discord webhook URL').optional(),
});
