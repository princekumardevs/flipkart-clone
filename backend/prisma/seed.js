const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Books',
        slug: 'books',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports',
        slug: 'sports',
        imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b',
      },
    }),
  ]);

  const [electronics, fashion, homeKitchen, books, sports] = categories;

  // Products
  const products = [
    // Electronics
    {
      name: 'Apple iPhone 15 (128 GB)',
      description: 'A16 Bionic chip, 48MP camera, Dynamic Island.',
      price: 69999,
      originalPrice: 79900,
      discountPercent: 12,
      stock: 25,
      rating: 4.5,
      ratingCount: 3215,
      categoryId: electronics.id,
      brand: 'Apple',
      images: [
        "https://m.media-amazon.com/images/I/71d7rfSl0wL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61cwywLZR-L._SX679_.jpg"
      ],
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Noise cancelling premium headphones.',
      price: 26990,
      originalPrice: 34990,
      discountPercent: 22,
      stock: 30,
      rating: 4.6,
      ratingCount: 4521,
      categoryId: electronics.id,
      brand: 'Sony',
      images: [
        "https://m.media-amazon.com/images/I/61vIICnN6SL._SX679_.jpg"
      ],
    },
    {
      name: 'HP Pavilion Laptop 15',
      description: 'i5 12th Gen, 16GB RAM, 512GB SSD.',
      price: 52990,
      originalPrice: 66710,
      discountPercent: 20,
      stock: 15,
      rating: 4.2,
      ratingCount: 1876,
      categoryId: electronics.id,
      brand: 'HP',
      images: [
        "https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg"
      ],
    },

    // Fashion
    {
      name: 'Nike Air Max 270',
      description: 'Comfort lifestyle sneakers.',
      price: 11495,
      originalPrice: 14995,
      discountPercent: 23,
      stock: 40,
      rating: 4.4,
      ratingCount: 7654,
      categoryId: fashion.id,
      brand: 'Nike',
      images: [
        "https://m.media-amazon.com/images/I/71dX9fR1FSL._UY695_.jpg"
      ],
    },
    {
      name: "Levi's 511 Jeans",
      description: 'Slim fit stretch denim.',
      price: 1799,
      originalPrice: 3999,
      discountPercent: 55,
      stock: 100,
      rating: 4.2,
      ratingCount: 15432,
      categoryId: fashion.id,
      brand: "Levi's",
      images: [
        "https://m.media-amazon.com/images/I/81dZ6rKp9-L._UX679_.jpg"
      ],
    },

    // Home & Kitchen
    {
      name: 'Prestige Induction Cooktop',
      description: '1200W induction with auto cut.',
      price: 1599,
      originalPrice: 2895,
      discountPercent: 44,
      stock: 60,
      rating: 4.0,
      ratingCount: 9876,
      categoryId: homeKitchen.id,
      brand: 'Prestige',
      images: [
        "https://m.media-amazon.com/images/I/71r5cXlXlFL._SX679_.jpg"
      ],
    },
    {
      name: 'Milton Thermosteel Flask',
      description: 'Hot & cold 24hr bottle.',
      price: 699,
      originalPrice: 1150,
      discountPercent: 39,
      stock: 150,
      rating: 4.2,
      ratingCount: 23456,
      categoryId: homeKitchen.id,
      brand: 'Milton',
      images: [
        "https://m.media-amazon.com/images/I/61kKX3b6WXL._SX679_.jpg"
      ],
    },

    // Books
    {
      name: 'Atomic Habits',
      description: 'Build good habits.',
      price: 399,
      originalPrice: 799,
      discountPercent: 50,
      stock: 300,
      rating: 4.7,
      ratingCount: 45678,
      categoryId: books.id,
      brand: 'Penguin',
      images: [
        "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg"
      ],
    },
    {
      name: 'Rich Dad Poor Dad',
      description: 'Financial mindset book.',
      price: 299,
      originalPrice: 499,
      discountPercent: 40,
      stock: 200,
      rating: 4.5,
      ratingCount: 56789,
      categoryId: books.id,
      brand: 'Plata',
      images: [
        "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg"
      ],
    },

    // Sports
    {
      name: 'Yonex Badminton Racquet',
      description: 'Lightweight performance racquet.',
      price: 1299,
      originalPrice: 1990,
      discountPercent: 34,
      stock: 70,
      rating: 4.3,
      ratingCount: 8765,
      categoryId: sports.id,
      brand: 'Yonex',
      images: [
        "https://m.media-amazon.com/images/I/61h7F7VY5zL._SX679_.jpg"
      ],
    },
    {
      name: 'Boldfit Yoga Mat',
      description: 'Anti-skid 6mm mat.',
      price: 499,
      originalPrice: 1299,
      discountPercent: 61,
      stock: 200,
      rating: 4.2,
      ratingCount: 19876,
      categoryId: sports.id,
      brand: 'Boldfit',
      images: [
        "https://m.media-amazon.com/images/I/71Q5y0dJ6BL._SX679_.jpg"
      ],
    },

    // Electronics (more)
    {
      name: 'Samsung Galaxy Tab S9 FE',
      description: '10.9-inch tablet with S Pen and long battery life.',
      price: 36999,
      originalPrice: 45999,
      discountPercent: 19,
      stock: 22,
      rating: 4.4,
      ratingCount: 2143,
      categoryId: electronics.id,
      brand: 'Samsung',
      images: [
        'https://m.media-amazon.com/images/I/71zFP-6xLUL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/71zA6Tt7QxL._SX679_.jpg',
      ],
    },
    {
      name: 'JBL Flip 6 Bluetooth Speaker',
      description: 'Portable IP67 speaker with punchy bass and 12-hour playtime.',
      price: 8999,
      originalPrice: 14999,
      discountPercent: 40,
      stock: 48,
      rating: 4.5,
      ratingCount: 6872,
      categoryId: electronics.id,
      brand: 'JBL',
      images: [
        'https://m.media-amazon.com/images/I/71iWl8rW5oL._SX679_.jpg',
      ],
    },

    // Fashion (more)
    {
      name: 'Puma Running T-Shirt',
      description: 'Lightweight dry-fit tee for running and gym workouts.',
      price: 749,
      originalPrice: 1499,
      discountPercent: 50,
      stock: 160,
      rating: 4.1,
      ratingCount: 5240,
      categoryId: fashion.id,
      brand: 'Puma',
      images: [
        'https://m.media-amazon.com/images/I/71X5f79N0dL._UX679_.jpg',
      ],
    },
    {
      name: 'Fossil Grant Chronograph Watch',
      description: 'Classic leather strap watch with chronograph dial.',
      price: 6995,
      originalPrice: 11995,
      discountPercent: 41,
      stock: 28,
      rating: 4.5,
      ratingCount: 2987,
      categoryId: fashion.id,
      brand: 'Fossil',
      images: [
        'https://m.media-amazon.com/images/I/81J3f5D8ZJL._UX679_.jpg',
      ],
    },

    // Home & Kitchen (more)
    {
      name: 'Butterfly Mixer Grinder 750W',
      description: '3-jar mixer grinder with strong motor and anti-slip feet.',
      price: 2499,
      originalPrice: 3899,
      discountPercent: 36,
      stock: 55,
      rating: 4.1,
      ratingCount: 7611,
      categoryId: homeKitchen.id,
      brand: 'Butterfly',
      images: [
        'https://m.media-amazon.com/images/I/71hY0L+0VqL._SX679_.jpg',
      ],
    },
    {
      name: 'Pigeon Non-Stick Cookware Set',
      description: '3-piece non-stick set for daily cooking convenience.',
      price: 999,
      originalPrice: 1999,
      discountPercent: 50,
      stock: 110,
      rating: 4.0,
      ratingCount: 13920,
      categoryId: homeKitchen.id,
      brand: 'Pigeon',
      images: [
        'https://m.media-amazon.com/images/I/71FG6hM4fWL._SX679_.jpg',
      ],
    },

    // Books (more)
    {
      name: 'The Psychology of Money',
      description: 'Timeless lessons on wealth, greed, and happiness.',
      price: 319,
      originalPrice: 499,
      discountPercent: 36,
      stock: 260,
      rating: 4.6,
      ratingCount: 33871,
      categoryId: books.id,
      brand: 'Jaico',
      images: [
        'https://m.media-amazon.com/images/I/71TRUbzcvaL.jpg',
      ],
    },
    {
      name: 'Ikigai',
      description: 'Japanese secret to a long and meaningful life.',
      price: 329,
      originalPrice: 599,
      discountPercent: 45,
      stock: 230,
      rating: 4.4,
      ratingCount: 27410,
      categoryId: books.id,
      brand: 'Penguin',
      images: [
        'https://m.media-amazon.com/images/I/81l3rZK4lnL.jpg',
      ],
    },

    // Sports (more)
    {
      name: 'Nivia Storm Football Size 5',
      description: 'Durable stitched football for practice and matches.',
      price: 699,
      originalPrice: 999,
      discountPercent: 30,
      stock: 130,
      rating: 4.2,
      ratingCount: 10456,
      categoryId: sports.id,
      brand: 'Nivia',
      images: [
        'https://m.media-amazon.com/images/I/71Dc6N7QfCL._SX679_.jpg',
      ],
    },
    {
      name: 'SG Kashmir Willow Cricket Bat',
      description: 'Full-size cricket bat with balanced pick-up and grip.',
      price: 1499,
      originalPrice: 2299,
      discountPercent: 35,
      stock: 64,
      rating: 4.1,
      ratingCount: 5822,
      categoryId: sports.id,
      brand: 'SG',
      images: [
        'https://m.media-amazon.com/images/I/71eJjU3m7+L._SX679_.jpg',
      ],
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });