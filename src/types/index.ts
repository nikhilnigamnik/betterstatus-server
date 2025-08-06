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
  origin: string;
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

export const JOB_OPTIONS = {
  removeOnComplete: 10,
  removeOnFail: 50,
  attempts: 3,
};

export interface BrowserInfo {
  name: string;
  version: string;
}

export interface DeviceInfo {
  type: string;
}

export interface OSInfo {
  name: string;
  version: string;
}

export interface IpInfo {
  ip: string;
  country: string;
  city: string;
  region: string;
  regionCode: string;
  latitude: string;
  longitude: string;
  timezone: string;
  browser: BrowserInfo;
  device: DeviceInfo;
  os: OSInfo;
}
