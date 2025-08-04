import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';
import { isProduction } from './env';

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  silent: isProduction,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    isProduction
      ? format.json()
      : format.combine(
          format.colorize(),
          format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
          })
        )
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(logDir, 'app.log'),
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

export default logger;
