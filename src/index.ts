import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./middleware/error-handler";
import { generalRateLimit, apiRateLimit } from "./middleware/rate-limit";
import routes from "./routes";

dotenv.config();

const app = new Hono();

app.use("*", logger());
app.use("*", secureHeaders());
app.use("*", cors());

app.use("*", generalRateLimit);

app.get("/", (c) => {
  return c.json({ message: "Better Job API" });
});

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", apiRateLimit);
app.route("/api", routes);

app.notFound(notFound);
app.onError(errorHandler);

export default app;
