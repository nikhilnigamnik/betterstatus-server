import { Context } from "hono";
import { db } from "@/utils";
import { waitlist } from "@/db";
import { eq } from "drizzle-orm";
import { STATUS_CODE } from "@/constants/status-code";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

export const waitlistController = async (c: Context) => {
  const ip = getClientIP(c);
  const { success } = await checkRateLimit(ip);
  if (!success) {
    return c.json(
      {
        message: "Too many requests, please try again later.",
        status: STATUS_CODE.TOO_MANY_REQUESTS,
      },
      STATUS_CODE.TOO_MANY_REQUESTS
    );
  }

  const { email } = await c.req.json();

  const existing = await db
    .select()
    .from(waitlist)
    .where(eq(waitlist.email, email));

  if (existing.length > 0) {
    return c.json(
      {
        message: "Email already in waitlist",
        status: STATUS_CODE.BAD_REQUEST,
      },
      STATUS_CODE.BAD_REQUEST
    );
  }

  await db.insert(waitlist).values({ email });
  return c.json(
    { message: "Waitlist", status: STATUS_CODE.CREATED },
    STATUS_CODE.CREATED
  );
};
