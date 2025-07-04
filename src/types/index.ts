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
