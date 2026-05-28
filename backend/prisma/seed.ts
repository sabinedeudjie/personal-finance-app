import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

const globalCategories: { name: string; type: TransactionType; icon: string }[] = [
  // Revenus
  { name: 'Salaire',          type: TransactionType.income,  icon: 'work' },
  { name: 'Freelance',        type: TransactionType.income,  icon: 'computer' },
  { name: 'Investissements',  type: TransactionType.income,  icon: 'trending_up' },
  { name: 'Autres revenus',   type: TransactionType.income,  icon: 'attach_money' },
  // Dépenses
  { name: 'Loyer',            type: TransactionType.expense, icon: 'home' },
  { name: 'Courses',          type: TransactionType.expense, icon: 'shopping_cart' },
  { name: 'Transport',        type: TransactionType.expense, icon: 'directions_car' },
  { name: 'Restaurant',       type: TransactionType.expense, icon: 'restaurant' },
  { name: 'Santé',            type: TransactionType.expense, icon: 'local_hospital' },
  { name: 'Loisirs',          type: TransactionType.expense, icon: 'sports_esports' },
  { name: 'Abonnements',      type: TransactionType.expense, icon: 'subscriptions' },
  { name: 'Éducation',        type: TransactionType.expense, icon: 'school' },
  { name: 'Vêtements',        type: TransactionType.expense, icon: 'checkroom' },
  { name: 'Autres dépenses',  type: TransactionType.expense, icon: 'more_horiz' },
];

async function main() {
  console.log('Seeding global categories...');

  await prisma.category.deleteMany({ where: { user_id: null } });

  await prisma.category.createMany({
    data: globalCategories.map((c) => ({ ...c, user_id: null })),
  });

  console.log(`${globalCategories.length} categories created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
