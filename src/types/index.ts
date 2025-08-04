import { endpointService } from '@/services/endpoint';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export interface ServerConfig {
  port: number;
  environment: string;
  corsOrigin: string;
  databaseUrl: string;
  jwtSecret: string;
  encKey: string;
}

export interface JobData {
  endpointId: string;
}

export interface MonitoringResult {
  response_time_ms: number;
  http_status_code: number | null;
  error_message: string | null;
  success: boolean;
  status_text: string | null;
  checked_at: Date;
}

export type EndpointFromService = Awaited<ReturnType<typeof endpointService.getActiveEndpoints>>[0];

export const monitoredEndpoints = new Set<string>();

export const JOB_OPTIONS = {
  removeOnComplete: 10,
  removeOnFail: 50,
  attempts: 3,
};
