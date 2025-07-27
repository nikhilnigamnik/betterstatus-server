import { EndpointFromService, MonitoringResult } from "@/types";
import { parseHeaders } from "./request";

export async function performHealthCheck(
  endpoint: EndpointFromService
): Promise<MonitoringResult> {
  const start = performance.now();
  const checked_at = new Date();
  let response_time_ms = 0;
  let http_status_code: number | null = null;
  let error_message: string | null = null;
  let success = false;
  let status_text: string | null = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const headers = parseHeaders(endpoint.headers);
    const response = await fetch(endpoint.path, {
      method: endpoint.method,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    response_time_ms = Math.round(performance.now() - start);
    http_status_code = response.status;
    success = response.ok;
    status_text = response.statusText;
  } catch (err) {
    response_time_ms = Math.round(performance.now() - start);
    error_message = err instanceof Error ? err.message : String(err);
    console.error(`Health check failed for ${endpoint.name}:`, {
      error: error_message,
      response_time_ms,
      endpoint_id: endpoint.id,
    });
  }

  return {
    response_time_ms,
    http_status_code,
    error_message,
    success,
    status_text,
    checked_at,
  };
}
