import { plan, user_plan } from '@/db';
import { db } from '@/utils';
import { eq, and, desc, asc } from 'drizzle-orm';

export const planService = {
  /**
   * Get a plan by ID (only if active)
   */
  getPlanById: async (id: string) => {
    const [foundPlan] = await db
      .select()
      .from(plan)
      .where(and(eq(plan.id, id), eq(plan.is_active, true)));
    return foundPlan;
  },

  /**
   * Get all active plans
   */
  getAllPlans: async () => {
    return await db.select().from(plan).where(eq(plan.is_active, true)).orderBy(asc(plan.price));
  },

  /**
   * Get a plan by name (only if active)
   */
  getPlanByName: async (name: string) => {
    const [foundPlan] = await db
      .select()
      .from(plan)
      .where(and(eq(plan.name, name as 'free' | 'pro'), eq(plan.is_active, true)));
    return foundPlan;
  },

  /**
   * Create a new plan
   */
  createPlan: async (planData: typeof plan.$inferInsert) => {
    const [newPlan] = await db.insert(plan).values(planData).returning();
    return newPlan;
  },

  /**
   * Create a new plan
   */
  getFreePlanId: async () => {
    const [freePlan] = await db.select().from(plan).where(eq(plan.name, 'free'));
    return freePlan?.id ?? null;
  },

  /**
   * Update an existing plan by ID (only if active)
   */
  updatePlan: async (id: string, planData: Partial<typeof plan.$inferInsert>) => {
    const [updatedPlan] = await db
      .update(plan)
      .set(planData)
      .where(and(eq(plan.id, id), eq(plan.is_active, true)))
      .returning();
    return updatedPlan;
  },

  /**
   * Soft delete a plan by setting isActive to false
   */
  deletePlan: async (id: string) => {
    await db.update(plan).set({ is_active: false }).where(eq(plan.id, id));
  },

  /**
   * Get user plan by user ID
   */
  getUserPlan: async (userId: string) => {
    const [userPlan] = await db
      .select({
        id: user_plan.id,
        user_id: user_plan.user_id,
        plan_id: user_plan.plan_id,
        status: user_plan.status,
        started_at: user_plan.started_at,
        expires_at: user_plan.expires_at,
        cancelled_at: user_plan.cancelled_at,
        stripe_subscription_id: user_plan.stripe_subscription_id,
        stripe_customer_id: user_plan.stripe_customer_id,
        created_at: user_plan.created_at,
        updated_at: user_plan.updated_at,
        plan: {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          billing_cycle: plan.billing_cycle,
          max_monitors: plan.max_monitors,
          max_status_pages: plan.max_status_pages,
          max_members: plan.max_members,
        },
      })
      .from(user_plan)
      .innerJoin(plan, eq(user_plan.plan_id, plan.id))
      .where(eq(user_plan.user_id, userId))
      .orderBy(desc(user_plan.created_at));
    return userPlan;
  },

  /**
   * Get all user plans
   */
  getAllUserPlans: async () => {
    return await db
      .select({
        id: user_plan.id,
        user_id: user_plan.user_id,
        plan_id: user_plan.plan_id,
        status: user_plan.status,
        started_at: user_plan.started_at,
        expires_at: user_plan.expires_at,
        cancelled_at: user_plan.cancelled_at,
        stripe_subscription_id: user_plan.stripe_subscription_id,
        stripe_customer_id: user_plan.stripe_customer_id,
        created_at: user_plan.created_at,
        updated_at: user_plan.updated_at,
        plan: {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          billing_cycle: plan.billing_cycle,
          max_monitors: plan.max_monitors,
          max_status_pages: plan.max_status_pages,
          max_members: plan.max_members,
        },
      })
      .from(user_plan)
      .innerJoin(plan, eq(user_plan.plan_id, plan.id))
      .orderBy(desc(user_plan.created_at));
  },

  /**
   * Create a new user plan
   */
  createUserPlan: async (userPlanData: typeof user_plan.$inferInsert) => {
    const [newUserPlan] = await db.insert(user_plan).values(userPlanData).returning();
    return newUserPlan;
  },

  /**
   * Update an existing user plan by ID
   */
  updateUserPlan: async (id: string, userPlanData: Partial<typeof user_plan.$inferInsert>) => {
    const [updatedUserPlan] = await db
      .update(user_plan)
      .set(userPlanData)
      .where(eq(user_plan.id, id))
      .returning();
    return updatedUserPlan;
  },

  /**
   * Update user plan by user ID
   */
  updateUserPlanByUserId: async (
    userId: string,
    userPlanData: Partial<typeof user_plan.$inferInsert>
  ) => {
    const [updatedUserPlan] = await db
      .update(user_plan)
      .set(userPlanData)
      .where(eq(user_plan.user_id, userId))
      .returning();
    return updatedUserPlan;
  },

  /**
   * Delete a user plan by ID
   */
  deleteUserPlan: async (id: string) => {
    await db.delete(user_plan).where(eq(user_plan.id, id));
  },

  /**
   * Get user plan by Stripe subscription ID
   */
  getUserPlanByStripeSubscriptionId: async (stripeSubscriptionId: string) => {
    const [userPlan] = await db
      .select()
      .from(user_plan)
      .where(eq(user_plan.stripe_subscription_id, stripeSubscriptionId));
    return userPlan;
  },

  /**
   * Get user plan by Stripe customer ID
   */
  getUserPlanByStripeCustomerId: async (stripeCustomerId: string) => {
    const [userPlan] = await db
      .select()
      .from(user_plan)
      .where(eq(user_plan.stripe_customer_id, stripeCustomerId));
    return userPlan;
  },

  /**
   * Get active user plans
   */
  getActiveUserPlans: async () => {
    return await db
      .select()
      .from(user_plan)
      .where(eq(user_plan.status, 'active'))
      .orderBy(desc(user_plan.created_at));
  },
};
