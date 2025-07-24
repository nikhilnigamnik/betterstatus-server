import fetch from "node-fetch";
import { performance } from "perf_hooks";
import { logQueue } from "@/lib/redis";

export async function checkEndpointJob(endpoint: any) {
  const start = performance.now();
  let status = "success";
  let http_status_code = null;
  let response_body = null;
  let error_message = null;

  try {
    const res = await fetch(endpoint.path, { method: endpoint.method });
    http_status_code = res.status;
    response_body = await res.text();
    if (res.status !== endpoint.expected_status_code) {
      status = "unexpected_status";
    }
  } catch (err: any) {
    status = "error";
    error_message = err.message;
  }
  const end = performance.now();

  await logQueue.add("save-log", {
    endpoint_id: endpoint.id,
    status,
    response_time_ms: Math.round(end - start),
    http_status_code,
    response_body,
    error_message,
    checked_at: new Date().toISOString(),
  });

  return { status, http_status_code, runtime_ms: end - start, error_message };
}
