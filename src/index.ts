import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import dotenv from "dotenv";
import { notFound } from "./middleware/error-handler";
import routes from "./routes";
import os from "os";
import { performance } from "perf_hooks";
dotenv.config();

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m ${secs}s`;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
};

const formatCpuTime = (microseconds: number): string => {
  const seconds = microseconds / 1000000;
  if (seconds < 1) return `${(seconds * 1000).toFixed(2)}ms`;
  return `${seconds.toFixed(2)}s`;
};

const app = new Hono();

app.use("*", logger());
app.use("*", secureHeaders());
app.use("*", cors());

app.get("/", (c) => {
  return c.json({ message: "Better Job API" });
});

app.get("/health", (c) => {
  const startTime = performance.now();

  const cpuUsage = process.cpuUsage();
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();

  const systemInfo = {
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    totalMemory: formatBytes(os.totalmem()),
    freeMemory: formatBytes(os.freemem()),
    memoryUsage: `${(
      ((os.totalmem() - os.freemem()) / os.totalmem()) *
      100
    ).toFixed(1)}%`,
    cpuCount: os.cpus().length,
    loadAverage: os.loadavg().map((load) => load.toFixed(2)),
    uptime: formatUptime(os.uptime()),
  };

  const processInfo = {
    pid: process.pid,
    uptime: formatUptime(uptime),
    memory: {
      rss: formatBytes(memUsage.rss),
      heapTotal: formatBytes(memUsage.heapTotal),
      heapUsed: formatBytes(memUsage.heapUsed),
      heapUsage: `${((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(
        1
      )}%`,
      external: formatBytes(memUsage.external),
      arrayBuffers: formatBytes(memUsage.arrayBuffers),
    },
    cpu: {
      user: formatCpuTime(cpuUsage.user),
      system: formatCpuTime(cpuUsage.system),
      total: formatCpuTime(cpuUsage.user + cpuUsage.system),
    },
  };

  const responseTime = performance.now() - startTime;

  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    responseTime: `${responseTime.toFixed(2)}ms`,
    system: systemInfo,
    process: processInfo,
  });
});

app.route("/api", routes);

app.notFound(notFound);

export default app;
