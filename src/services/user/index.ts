import { db } from "@/utils";
import { and, eq } from "drizzle-orm";
import { user } from "@/db";

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
        last_login_at: user.last_login_at,
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
    const [newUser] = await db.insert(user).values(userData).returning();
    return newUser;
  },

  /**
   * Update an existing user by ID (only if active)
   */
  updateUser: async (
    id: string,
    userData: Partial<typeof user.$inferInsert>
  ) => {
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
};
