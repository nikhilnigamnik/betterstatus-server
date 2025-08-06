import dotenv from 'dotenv';
import { ServerConfig } from '../types';

dotenv.config();

export const env: ServerConfig = {
  port: parseInt(process.env.PORT ?? '8080', 10),
  environment: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  encKey: process.env.ENC_KEY ?? '',
  origin: process.env.ORIGIN ?? '*',
};

export const isDevelopment = env.environment === 'development';
export const isProduction = env.environment === 'production';
