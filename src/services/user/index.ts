import { plan, signin_history, user, user_plan } from '@/db';
import { IpInfo } from '@/types';
import { db } from '@/utils';
import { and, desc, eq } from 'drizzle-orm';

export const userService = {
  /**
   * Get a user by ID (only if active)
   */
  getUserById: async (id: string) => {
    const [foundUser] = await db
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        auth_provider: user.auth_provider,
        is_active: user.is_active,
        email_verified_at: user.email_verified_at,
        last_signed_in_at: user.last_signed_in_at,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      })
      .from(user)
      .where(and(eq(user.id, id), eq(user.is_active, true)));

    return foundUser;
  },

  /**
   * Get all active users
   */
  getAllUsers: async () => {
    return await db.select().from(user).where(eq(user.is_active, true));
  },

  /**
   * Get a user by email (only if active)
   */
  getUserByEmail: async (email: string) => {
    const [foundUser] = await db
      .select()
      .from(user)
      .where(and(eq(user.email, email), eq(user.is_active, true)));
    return foundUser;
  },

  /**
   * Create a new user
   */
  createUser: async (userData: typeof user.$inferInsert) => {
    return await db.transaction(async (tx) => {
      const [newUser] = await tx.insert(user).values(userData).returning();
      const [freePlan] = await tx.select().from(plan).where(eq(plan.name, 'free'));

      await tx.insert(user_plan).values({
        user_id: newUser.id,
        plan_id: freePlan.id,
        status: 'active',
        started_at: new Date(),
      });

      return newUser;
    });
  },

  /**
   * Update an existing user by ID (only if active)
   */
  updateUser: async (id: string, userData: Partial<typeof user.$inferInsert>) => {
    const [updatedUser] = await db
      .update(user)
      .set(userData)
      .where(and(eq(user.id, id), eq(user.is_active, true)))
      .returning();
    return updatedUser;
  },

  /**
   * Soft delete a user by setting isActive to false
   */
  deleteUser: async (id: string) => {
    await db.update(user).set({ is_active: false }).where(eq(user.id, id));
  },

  createSigninHistory: async (userId: string, ipInfo: IpInfo) => {
    await db.insert(signin_history).values({
      user_id: userId,
      ip_address: ipInfo.ip,
      os: ipInfo.os.name,
      browser: ipInfo.browser.name,
      device: ipInfo.device.type,
      country: ipInfo.country,
      city: ipInfo.city,
      region: ipInfo.region,
    });
  },

  getSigninHistory: async (userId: string) => {
    return await db
      .select()
      .from(signin_history)
      .where(eq(signin_history.user_id, userId))
      .orderBy(desc(signin_history.created_at));
  },
};
