import { db } from "@/utils";
import { monitor_logs } from "@/db/schema";

export async function saveLogJob(logData: any) {
  await db.insert(monitor_logs).values({
    ...logData,
    checked_at: new Date(logData.checked_at),
  });
}
