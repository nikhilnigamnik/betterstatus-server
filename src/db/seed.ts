import { db } from '../utils/db';
import { plan } from './schema';

async function seedPlans() {
  console.log('🌱 Seeding plans...');

  try {
    await db.delete(plan);

    const plans = [
      {
        name: 'free' as const,
        price: '0',
        billing_cycle: 'monthly' as const,
        max_monitors: 2,
        max_status_pages: 1,
        max_members: 2,
      },
      {
        name: 'pro' as const,
        price: '1200',
        billing_cycle: 'monthly' as const,
        max_monitors: 10,
        max_status_pages: 5,
        max_members: 5,
      },
    ];

    const insertedPlans = await db.insert(plan).values(plans).returning();

    console.log(`✅ Successfully seeded ${insertedPlans.length} plans:`);
    insertedPlans.forEach((p: any) => {
      console.log(`   - ${p.name}: $${(p.price / 100).toFixed(2)}/${p.billing_cycle}`);
    });
  } catch (error) {
    console.error('❌ Error seeding plans:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting database seeding...');

  try {
    await seedPlans();
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { seedPlans };
