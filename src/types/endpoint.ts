export type Endpoint = {
  id: string;
  path: string;
  method: string;
  headers: Record<string, string>;
  request_body: string;
  timeout_seconds: number;
  check_interval_seconds: number;
  expected_status_code: number;
  expected_response_content: string;
  is_active: boolean;
  last_checked_at: Date;
  next_check_at: Date;
  name?: string;
};
