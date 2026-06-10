import {
  PrismaClient,
  TransactionType,
} from '../src/generated/client/client.js';
import { createDbAdapter } from '../src/lib/db-adapter.js';

const prisma = new PrismaClient({ adapter: createDbAdapter() });

const globalCategories: {
  name: string;
  type: TransactionType;
  icon: string;
}[] = [
  // Revenus
  { name: 'Salaire', type: TransactionType.income, icon: '💰' },
  { name: 'Freelance', type: TransactionType.income, icon: '💻' },
  { name: 'Investissements', type: TransactionType.income, icon: '📈' },
  // Dépenses
  { name: 'Loyer', type: TransactionType.expense, icon: '🏠' },
  { name: 'Courses', type: TransactionType.expense, icon: '🛒' },
  { name: 'Transport', type: TransactionType.expense, icon: '🚗' },
  { name: 'Alimentation', type: TransactionType.expense, icon: '🍽️' },
  { name: 'Santé', type: TransactionType.expense, icon: '⚕️' },
  { name: 'Loisirs', type: TransactionType.expense, icon: '🎮' },
  { name: 'Abonnements', type: TransactionType.expense, icon: '📱' },
  { name: 'Éducation', type: TransactionType.expense, icon: '🎓' },
  { name: 'Vêtements', type: TransactionType.expense, icon: '👗' },
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
