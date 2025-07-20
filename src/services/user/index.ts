import { db } from "@/utils";
import { and, eq } from "drizzle-orm";
import { user } from "@/db";

export const userService = {
  /**
   * Get a user by ID (only if active)
   */
  getUserById: async (id: string) => {
    const [foundUser] = await db
      .select()
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
