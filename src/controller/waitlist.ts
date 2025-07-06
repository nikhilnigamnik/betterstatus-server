import { Context } from "hono";
import { db } from "@/utils";
import { waitlist } from "@/db";
import { count, eq } from "drizzle-orm";
import { STATUS_CODE } from "@/constants/status-code";

export const waitlistController = async (c: Context) => {
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
    { message: "You're on the waitlist", status: STATUS_CODE.CREATED },
    STATUS_CODE.CREATED
  );
};

export const getWaitlistController = async (c: Context) => {
  const response = await db.select({ count: count() }).from(waitlist);
  return c.json({ response }, STATUS_CODE.OK);
};
