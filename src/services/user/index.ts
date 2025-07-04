import { users } from "@/db";
import { db } from "@/utils";
import { and, eq } from "drizzle-orm";

export const userService = {
  /**
   * Retrieves a user by their ID
   * @param id - The unique identifier of the user
   * @returns The user object if found and active, undefined otherwise
   */
  getUserById: async (id: string) => {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.is_active, true)));
    return user;
  },

  /**
   * Retrieves all active users from the database
   * @returns Array of all active user objects
   */
  getAllUsers: async () => {
    const user = await db.select().from(users).where(eq(users.is_active, true));
    return user;
  },

  /**
   * Retrieves a user by their email address
   * @param email - The email address of the user
   * @returns The user object if found and active, undefined otherwise
   */
  getUserByEmail: async (email: string) => {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.is_active, true)));
    return user;
  },

  /**
   * Creates a new user in the database
   * @param user - The user data to insert
   * @returns The newly created user object
   */
  createUser: async (userData: typeof users.$inferInsert) => {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  },

  /**
   * Updates an existing user's information
   * @param id - The unique identifier of the user to update
   * @param user - The updated user data
   * @returns The updated user object if found and active, undefined otherwise
   */
  updateUser: async (id: string, userData: typeof users.$inferSelect) => {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(and(eq(users.id, id), eq(users.is_active, true)))
      .returning();
    return user;
  },

  /**
   * Soft deletes a user by setting their is_active flag to false
   * @param id - The unique identifier of the user to delete
   */
  deleteUser: async (id: string) => {
    await db.update(users).set({ is_active: false }).where(eq(users.id, id));
  },
};
