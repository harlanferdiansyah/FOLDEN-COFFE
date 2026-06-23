import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const initialProducts = [
  {
    name: 'Espresso Classic',
    description: 'Shot espresso pekat dengan crema sempurna.',
    price: 25000,
    imageUrl: '/coffee-espresso.jpg',
    category: 'Espresso',
    inStock: true,
  },
  {
    name: 'Cappuccino',
    description: 'Espresso, steamed milk, dan foam lembut di atasnya.',
    price: 35000,
    imageUrl: '/coffee-cappuccino.jpg',
    category: 'Milk Based',
    inStock: true,
  },
  {
    name: 'Latte',
    description: 'Espresso dengan steamed milk yang lembut dan creamy.',
    price: 30000,
    imageUrl: '/coffee-latte.jpg',
    category: 'Milk Based',
    inStock: true,
  },
  {
    name: 'Cold Brew',
    description: 'Kopi seduh dingin selama 12 jam, menyegarkan dan rendah asam.',
    price: 32000,
    imageUrl: '/coffee-coldbrew.jpg',
    category: 'Cold Coffee',
    inStock: true,
  },
  {
    name: 'Matcha Latte',
    description: 'Perpaduan bubuk matcha premium Jepang dengan susu hangat.',
    price: 38000,
    imageUrl: '/coffee-matcha.jpg',
    category: 'Non Coffee',
    inStock: true,
  },
];

async function main() {
  console.log('🌱 Seeding database...');
  
  // Clean existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.product.deleteMany({});
  
  // Seed specific admin user requested by user
  const hashedPassword = await bcrypt.hash('laann', 10);
  const user = await prisma.user.create({
    data: {
      email: 'harlan@gmail.com',
      password: hashedPassword,
      name: 'Harlan',
    },
  });
  console.log(`Created user: ${user.email}`);

  // Seed products
  for (const product of initialProducts) {
    const created = await prisma.product.create({
      data: product,
    });
    console.log(`Created product: ${created.name}`);
  }
  
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
