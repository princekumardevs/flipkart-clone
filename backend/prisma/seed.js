const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

function buildImageSet(query) {
  const tags = query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ',')
    .replace(/^,|,$/g, '');

  const queryKey = tags || 'product';
  let hash = 0;
  for (let i = 0; i < queryKey.length; i += 1) {
    hash = (hash * 31 + queryKey.charCodeAt(i)) % 100000;
  }

  return [1, 2, 3].map(
    (offset) => `https://loremflickr.com/800/800/${queryKey}?lock=${hash + offset}`
  );
}

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
        imageUrl: buildImageSet('electronics gadgets')[0],
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        imageUrl: buildImageSet('fashion clothing')[0],
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        imageUrl: buildImageSet('home kitchen appliances')[0],
      },
    }),
    prisma.category.create({
      data: {
        name: 'Books',
        slug: 'books',
        imageUrl: buildImageSet('books reading')[0],
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports',
        slug: 'sports',
        imageUrl: buildImageSet('sports fitness')[0],
      },
    }),
  ]);

  const [electronics, fashion, homeKitchen, books, sports] = categories;

  // Products data
  const products = [
    // Electronics (6)
    {
      name: 'Samsung Galaxy M34 5G',
      description: 'Samsung Galaxy M34 5G with 6000mAh battery, 50MP triple camera, and 120Hz Super AMOLED display.',
      price: 14999,
      originalPrice: 19999,
      discountPercent: 25,
      stock: 50,
      rating: 4.3,
      ratingCount: 12453,
      categoryId: electronics.id,
      brand: 'Samsung',
      images: [
        'https://picsum.photos/seed/samsung1/400/400',
        'https://picsum.photos/seed/samsung2/400/400',
        'https://picsum.photos/seed/samsung3/400/400',
      ],
      specifications: { RAM: '6 GB', Storage: '128 GB', Battery: '6000 mAh', Display: '6.5 inch Super AMOLED', Processor: 'Exynos 1280' },
    },
    {
      name: 'boAt Rockerz 450 Bluetooth Headphone',
      description: 'boAt Rockerz 450 wireless Bluetooth headphone with 40mm drivers and up to 15 hours playback.',
      price: 1099,
      originalPrice: 2990,
      discountPercent: 63,
      stock: 200,
      rating: 4.1,
      ratingCount: 89234,
      categoryId: electronics.id,
      brand: 'boAt',
      images: [
        'https://picsum.photos/seed/boat1/400/400',
        'https://picsum.photos/seed/boat2/400/400',
        'https://picsum.photos/seed/boat3/400/400',
      ],
      specifications: { Driver: '40mm', Battery: '300 mAh', Playback: '15 hours', Connectivity: 'Bluetooth v5.0', Weight: '224g' },
    },
    {
      name: 'Sony WH-1000XM5 Headphones',
      description: 'Industry-leading noise canceling wireless headphones with Auto NC Optimizer and crystal-clear hands-free calling.',
      price: 26990,
      originalPrice: 34990,
      discountPercent: 22,
      stock: 30,
      rating: 4.6,
      ratingCount: 4521,
      categoryId: electronics.id,
      brand: 'Sony',
      images: [
        'https://picsum.photos/seed/sony1/400/400',
        'https://picsum.photos/seed/sony2/400/400',
        'https://picsum.photos/seed/sony3/400/400',
      ],
      specifications: { Driver: '30mm', 'Noise Canceling': 'Yes (ANC)', Battery: '30 hours', Weight: '250g', Codec: 'LDAC, AAC' },
    },
    {
      name: 'Apple iPhone 15 (128 GB)',
      description: 'iPhone 15 with A16 Bionic chip, Dynamic Island, 48MP camera system, and USB-C connectivity.',
      price: 69999,
      originalPrice: 79900,
      discountPercent: 12,
      stock: 25,
      rating: 4.5,
      ratingCount: 3215,
      categoryId: electronics.id,
      brand: 'Apple',
      images: [
        'https://picsum.photos/seed/iphone1/400/400',
        'https://picsum.photos/seed/iphone2/400/400',
        'https://picsum.photos/seed/iphone3/400/400',
      ],
      specifications: { Processor: 'A16 Bionic', Storage: '128 GB', Camera: '48MP + 12MP', Display: '6.1 inch Super Retina XDR', OS: 'iOS 17' },
    },
    {
      name: 'HP Pavilion Laptop 15',
      description: 'HP Pavilion with 12th Gen Intel Core i5, 16GB RAM, 512GB SSD, and 15.6-inch FHD display.',
      price: 52990,
      originalPrice: 66710,
      discountPercent: 20,
      stock: 15,
      rating: 4.2,
      ratingCount: 1876,
      categoryId: electronics.id,
      brand: 'HP',
      images: [
        'https://picsum.photos/seed/hp1/400/400',
        'https://picsum.photos/seed/hp2/400/400',
        'https://picsum.photos/seed/hp3/400/400',
      ],
      specifications: { Processor: 'Intel i5-1235U', RAM: '16 GB', Storage: '512 GB SSD', Display: '15.6 inch FHD', OS: 'Windows 11' },
    },
    {
      name: 'JBL Flip 6 Portable Speaker',
      description: 'JBL Flip 6 portable Bluetooth speaker with powerful sound, IP67 waterproof, and 12-hour battery life.',
      price: 8999,
      originalPrice: 14999,
      discountPercent: 40,
      stock: 75,
      rating: 4.4,
      ratingCount: 6543,
      categoryId: electronics.id,
      brand: 'JBL',
      images: [
        'https://picsum.photos/seed/jbl1/400/400',
        'https://picsum.photos/seed/jbl2/400/400',
        'https://picsum.photos/seed/jbl3/400/400',
      ],
      specifications: { Output: '30W', Battery: '12 hours', Waterproof: 'IP67', Connectivity: 'Bluetooth 5.1', Weight: '550g' },
    },

    // Fashion (6)
    {
      name: 'Nike Air Max 270 Sneakers',
      description: 'Nike Air Max 270 lifestyle sneakers featuring the largest heel Air unit yet for a super-soft ride.',
      price: 11495,
      originalPrice: 14995,
      discountPercent: 23,
      stock: 40,
      rating: 4.4,
      ratingCount: 7654,
      categoryId: fashion.id,
      brand: 'Nike',
      images: [
        'https://picsum.photos/seed/nike1/400/400',
        'https://picsum.photos/seed/nike2/400/400',
        'https://picsum.photos/seed/nike3/400/400',
      ],
      specifications: { Material: 'Mesh Upper', Sole: 'Rubber', Closure: 'Lace-up', Color: 'Black/White', Style: 'Lifestyle' },
    },
    {
      name: 'Levi\'s 511 Slim Fit Jeans',
      description: 'Classic Levi\'s 511 slim fit jeans with stretch denim for comfort and a modern silhouette.',
      price: 1799,
      originalPrice: 3999,
      discountPercent: 55,
      stock: 100,
      rating: 4.2,
      ratingCount: 15432,
      categoryId: fashion.id,
      brand: "Levi's",
      images: [
        'https://picsum.photos/seed/levis1/400/400',
        'https://picsum.photos/seed/levis2/400/400',
        'https://picsum.photos/seed/levis3/400/400',
      ],
      specifications: { Fit: 'Slim', Fabric: 'Stretch Denim', Rise: 'Mid Rise', Wash: 'Dark Indigo', Closure: 'Zip Fly' },
    },
    {
      name: 'Allen Solly Formal Shirt',
      description: 'Allen Solly slim-fit formal shirt in classic white with spread collar, perfect for office wear.',
      price: 899,
      originalPrice: 1699,
      discountPercent: 47,
      stock: 150,
      rating: 4.0,
      ratingCount: 8765,
      categoryId: fashion.id,
      brand: 'Allen Solly',
      images: [
        'https://picsum.photos/seed/allen1/400/400',
        'https://picsum.photos/seed/allen2/400/400',
        'https://picsum.photos/seed/allen3/400/400',
      ],
      specifications: { Fit: 'Slim Fit', Fabric: 'Cotton Blend', Collar: 'Spread', Sleeve: 'Full Sleeve', Pattern: 'Solid' },
    },
    {
      name: 'Wildcraft Backpack 35L',
      description: 'Wildcraft 35L laptop backpack with rain cover, multiple compartments, and padded shoulder straps.',
      price: 1299,
      originalPrice: 2495,
      discountPercent: 47,
      stock: 80,
      rating: 4.3,
      ratingCount: 11234,
      categoryId: fashion.id,
      brand: 'Wildcraft',
      images: [
        'https://picsum.photos/seed/wildcraft1/400/400',
        'https://picsum.photos/seed/wildcraft2/400/400',
        'https://picsum.photos/seed/wildcraft3/400/400',
      ],
      specifications: { Capacity: '35 L', Material: 'Polyester', 'Laptop Sleeve': 'Up to 15.6 inch', 'Rain Cover': 'Yes', Compartments: '3' },
    },
    {
      name: 'Fossil Analog Watch',
      description: 'Fossil men\'s analog watch with leather strap, 44mm case, and water-resistant up to 50 meters.',
      price: 5495,
      originalPrice: 9995,
      discountPercent: 45,
      stock: 35,
      rating: 4.5,
      ratingCount: 3456,
      categoryId: fashion.id,
      brand: 'Fossil',
      images: [
        'https://picsum.photos/seed/fossil1/400/400',
        'https://picsum.photos/seed/fossil2/400/400',
        'https://picsum.photos/seed/fossil3/400/400',
      ],
      specifications: { 'Case Size': '44mm', Strap: 'Leather', Movement: 'Quartz', 'Water Resistant': '50m', Glass: 'Mineral Crystal' },
    },
    {
      name: 'Puma Running T-Shirt',
      description: 'Puma dryCELL running t-shirt with moisture-wicking technology and lightweight mesh panels.',
      price: 599,
      originalPrice: 1499,
      discountPercent: 60,
      stock: 200,
      rating: 4.1,
      ratingCount: 5678,
      categoryId: fashion.id,
      brand: 'Puma',
      images: [
        'https://picsum.photos/seed/puma1/400/400',
        'https://picsum.photos/seed/puma2/400/400',
        'https://picsum.photos/seed/puma3/400/400',
      ],
      specifications: { Fabric: 'Polyester', Technology: 'dryCELL', Fit: 'Regular', Sleeve: 'Short Sleeve', Neck: 'Round Neck' },
    },

    // Home & Kitchen (6)
    {
      name: 'Prestige Induction Cooktop',
      description: 'Prestige PIC 20.0 induction cooktop with 1200W power, feather touch buttons, and auto-cut feature.',
      price: 1599,
      originalPrice: 2895,
      discountPercent: 44,
      stock: 60,
      rating: 4.0,
      ratingCount: 9876,
      categoryId: homeKitchen.id,
      brand: 'Prestige',
      images: [
        'https://picsum.photos/seed/prestige1/400/400',
        'https://picsum.photos/seed/prestige2/400/400',
        'https://picsum.photos/seed/prestige3/400/400',
      ],
      specifications: { Power: '1200W', 'Control Type': 'Feather Touch', 'Auto Cut': 'Yes', 'Timer': 'Yes', Color: 'Black' },
    },
    {
      name: 'Milton Thermosteel Flask 1L',
      description: 'Milton Thermosteel 24-hour hot and cold flask with leak-proof lid and durable stainless steel body.',
      price: 699,
      originalPrice: 1150,
      discountPercent: 39,
      stock: 150,
      rating: 4.2,
      ratingCount: 23456,
      categoryId: homeKitchen.id,
      brand: 'Milton',
      images: [
        'https://picsum.photos/seed/milton1/400/400',
        'https://picsum.photos/seed/milton2/400/400',
        'https://picsum.photos/seed/milton3/400/400',
      ],
      specifications: { Capacity: '1 Litre', Material: 'Stainless Steel', 'Hot/Cold': '24 hours', 'Leak Proof': 'Yes', Weight: '380g' },
    },
    {
      name: 'Pigeon Non-Stick Cookware Set',
      description: 'Pigeon 3-piece non-stick cookware set including fry pan, tawa, and kadai with glass lids.',
      price: 849,
      originalPrice: 1999,
      discountPercent: 57,
      stock: 90,
      rating: 4.1,
      ratingCount: 14567,
      categoryId: homeKitchen.id,
      brand: 'Pigeon',
      images: [
        'https://picsum.photos/seed/pigeon1/400/400',
        'https://picsum.photos/seed/pigeon2/400/400',
        'https://picsum.photos/seed/pigeon3/400/400',
      ],
      specifications: { Pieces: '3', Material: 'Aluminium', Coating: 'Non-stick', 'Dishwasher Safe': 'No', 'Induction Compatible': 'Yes' },
    },
    {
      name: 'Philips Air Purifier AC1215',
      description: 'Philips air purifier with VitaShield IPS technology, HEPA filter, and real-time air quality display.',
      price: 8999,
      originalPrice: 12995,
      discountPercent: 30,
      stock: 20,
      rating: 4.3,
      ratingCount: 2345,
      categoryId: homeKitchen.id,
      brand: 'Philips',
      images: [
        'https://picsum.photos/seed/philips1/400/400',
        'https://picsum.photos/seed/philips2/400/400',
        'https://picsum.photos/seed/philips3/400/400',
      ],
      specifications: { 'Coverage Area': '677 sq ft', Filter: 'HEPA', CADR: '270 m³/h', 'Noise Level': '33 dB', 'Power': '50W' },
    },
    {
      name: 'Bombay Dyeing Bedsheet Set',
      description: 'Bombay Dyeing double bedsheet set with 2 pillow covers, 100% cotton, 144 TC, floral print.',
      price: 599,
      originalPrice: 1299,
      discountPercent: 53,
      stock: 120,
      rating: 3.9,
      ratingCount: 18765,
      categoryId: homeKitchen.id,
      brand: 'Bombay Dyeing',
      images: [
        'https://picsum.photos/seed/bombay1/400/400',
        'https://picsum.photos/seed/bombay2/400/400',
        'https://picsum.photos/seed/bombay3/400/400',
      ],
      specifications: { Size: 'Double', Material: '100% Cotton', 'Thread Count': '144 TC', 'Pillow Covers': '2', Pattern: 'Floral' },
    },
    {
      name: 'Butterfly Mixer Grinder 750W',
      description: 'Butterfly Jet Elite mixer grinder with 750W motor, 3 stainless steel jars, and LED indicator.',
      price: 2199,
      originalPrice: 3795,
      discountPercent: 42,
      stock: 45,
      rating: 4.0,
      ratingCount: 7890,
      categoryId: homeKitchen.id,
      brand: 'Butterfly',
      images: [
        'https://picsum.photos/seed/butterfly1/400/400',
        'https://picsum.photos/seed/butterfly2/400/400',
        'https://picsum.photos/seed/butterfly3/400/400',
      ],
      specifications: { Power: '750W', Jars: '3', Material: 'Stainless Steel', Speed: '3 + Pulse', Warranty: '2 Years' },
    },

    // Books (6)
    {
      name: 'Atomic Habits by James Clear',
      description: 'An easy and proven way to build good habits and break bad ones. The #1 New York Times bestseller.',
      price: 399,
      originalPrice: 799,
      discountPercent: 50,
      stock: 300,
      rating: 4.7,
      ratingCount: 45678,
      categoryId: books.id,
      brand: 'Penguin',
      images: [
        'https://picsum.photos/seed/atomic1/400/400',
        'https://picsum.photos/seed/atomic2/400/400',
        'https://picsum.photos/seed/atomic3/400/400',
      ],
      specifications: { Author: 'James Clear', Pages: '320', Language: 'English', Publisher: 'Penguin', Format: 'Paperback' },
    },
    {
      name: 'The Psychology of Money',
      description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. 19 short stories on finance.',
      price: 299,
      originalPrice: 399,
      discountPercent: 25,
      stock: 250,
      rating: 4.6,
      ratingCount: 34567,
      categoryId: books.id,
      brand: 'Jaico Publishing',
      images: [
        'https://picsum.photos/seed/psych1/400/400',
        'https://picsum.photos/seed/psych2/400/400',
        'https://picsum.photos/seed/psych3/400/400',
      ],
      specifications: { Author: 'Morgan Housel', Pages: '252', Language: 'English', Publisher: 'Jaico', Format: 'Paperback' },
    },
    {
      name: 'Rich Dad Poor Dad',
      description: 'What the rich teach their kids about money that the poor and middle class do not! By Robert Kiyosaki.',
      price: 299,
      originalPrice: 499,
      discountPercent: 40,
      stock: 200,
      rating: 4.5,
      ratingCount: 56789,
      categoryId: books.id,
      brand: 'Plata Publishing',
      images: [
        'https://picsum.photos/seed/rich1/400/400',
        'https://picsum.photos/seed/rich2/400/400',
        'https://picsum.photos/seed/rich3/400/400',
      ],
      specifications: { Author: 'Robert T. Kiyosaki', Pages: '336', Language: 'English', Publisher: 'Plata Publishing', Format: 'Paperback' },
    },
    {
      name: 'Ikigai: The Japanese Secret',
      description: 'The Japanese secret to a long and happy life. Discover your purpose with this bestselling guide.',
      price: 349,
      originalPrice: 599,
      discountPercent: 41,
      stock: 180,
      rating: 4.4,
      ratingCount: 28765,
      categoryId: books.id,
      brand: 'Penguin',
      images: [
        'https://picsum.photos/seed/ikigai1/400/400',
        'https://picsum.photos/seed/ikigai2/400/400',
        'https://picsum.photos/seed/ikigai3/400/400',
      ],
      specifications: { Author: 'Héctor García', Pages: '208', Language: 'English', Publisher: 'Penguin', Format: 'Paperback' },
    },
    {
      name: 'Sapiens: A Brief History',
      description: 'A brief history of humankind by Yuval Noah Harari. Explores how Homo sapiens conquered the world.',
      price: 449,
      originalPrice: 799,
      discountPercent: 43,
      stock: 120,
      rating: 4.6,
      ratingCount: 23456,
      categoryId: books.id,
      brand: 'Vintage',
      images: [
        'https://picsum.photos/seed/sapiens1/400/400',
        'https://picsum.photos/seed/sapiens2/400/400',
        'https://picsum.photos/seed/sapiens3/400/400',
      ],
      specifications: { Author: 'Yuval Noah Harari', Pages: '498', Language: 'English', Publisher: 'Vintage', Format: 'Paperback' },
    },
    {
      name: 'The Alchemist by Paulo Coelho',
      description: 'A magical fable about following your dreams. One of the bestselling books in history.',
      price: 299,
      originalPrice: 350,
      discountPercent: 14,
      stock: 300,
      rating: 4.5,
      ratingCount: 67890,
      categoryId: books.id,
      brand: 'HarperCollins',
      images: [
        'https://picsum.photos/seed/alchemist1/400/400',
        'https://picsum.photos/seed/alchemist2/400/400',
        'https://picsum.photos/seed/alchemist3/400/400',
      ],
      specifications: { Author: 'Paulo Coelho', Pages: '197', Language: 'English', Publisher: 'HarperCollins', Format: 'Paperback' },
    },

    // Sports (6)
    {
      name: 'Yonex Nanoray Light 18i Racquet',
      description: 'Yonex Nanoray Light 18i badminton racquet with isometric head shape and built-in T-Joint.',
      price: 1299,
      originalPrice: 1990,
      discountPercent: 34,
      stock: 70,
      rating: 4.3,
      ratingCount: 8765,
      categoryId: sports.id,
      brand: 'Yonex',
      images: [
        'https://picsum.photos/seed/yonex1/400/400',
        'https://picsum.photos/seed/yonex2/400/400',
        'https://picsum.photos/seed/yonex3/400/400',
      ],
      specifications: { Weight: '77g', Material: 'Graphite', 'String Tension': '24 lbs', Flexibility: 'Medium', Grip: 'G4' },
    },
    {
      name: 'Nivia Storm Football Size 5',
      description: 'Nivia Storm football with 32 hand-stitched panels, PU material, and FIFA standard size 5.',
      price: 599,
      originalPrice: 999,
      discountPercent: 40,
      stock: 100,
      rating: 4.1,
      ratingCount: 12345,
      categoryId: sports.id,
      brand: 'Nivia',
      images: [
        'https://picsum.photos/seed/nivia1/400/400',
        'https://picsum.photos/seed/nivia2/400/400',
        'https://picsum.photos/seed/nivia3/400/400',
      ],
      specifications: { Size: '5', Material: 'PU', Panels: '32', Stitching: 'Hand Stitched', Use: 'Training & Match' },
    },
    {
      name: 'Boldfit Yoga Mat 6mm',
      description: 'Boldfit anti-skid yoga mat with 6mm thickness, carry strap, and NBR material for joint protection.',
      price: 499,
      originalPrice: 1299,
      discountPercent: 61,
      stock: 200,
      rating: 4.2,
      ratingCount: 19876,
      categoryId: sports.id,
      brand: 'Boldfit',
      images: [
        'https://picsum.photos/seed/boldfit1/400/400',
        'https://picsum.photos/seed/boldfit2/400/400',
        'https://picsum.photos/seed/boldfit3/400/400',
      ],
      specifications: { Thickness: '6mm', Material: 'NBR', 'Anti-Skid': 'Yes', 'Carry Strap': 'Included', Dimensions: '183 x 61 cm' },
    },
    {
      name: 'SG Cricket Bat Kashmir Willow',
      description: 'SG RSD Xtreme Kashmir Willow cricket bat with treble spring handle and full size for adults.',
      price: 1199,
      originalPrice: 2100,
      discountPercent: 42,
      stock: 55,
      rating: 4.0,
      ratingCount: 6543,
      categoryId: sports.id,
      brand: 'SG',
      images: [
        'https://picsum.photos/seed/sgbat1/400/400',
        'https://picsum.photos/seed/sgbat2/400/400',
        'https://picsum.photos/seed/sgbat3/400/400',
      ],
      specifications: { Willow: 'Kashmir', Handle: 'Treble Spring', Size: 'Full (SH)', Weight: '1100-1200g', 'Sweet Spot': 'Mid-Low' },
    },
    {
      name: 'Fitbit Inspire 3 Fitness Tracker',
      description: 'Fitbit Inspire 3 with heart rate tracking, 10 days battery, stress management, and sleep tracking.',
      price: 7999,
      originalPrice: 10999,
      discountPercent: 27,
      stock: 40,
      rating: 4.4,
      ratingCount: 4567,
      categoryId: sports.id,
      brand: 'Fitbit',
      images: [
        'https://picsum.photos/seed/fitbit1/400/400',
        'https://picsum.photos/seed/fitbit2/400/400',
        'https://picsum.photos/seed/fitbit3/400/400',
      ],
      specifications: { Battery: '10 days', 'Heart Rate': 'Yes', 'Water Resistant': '50m', Display: 'AMOLED', Sensors: 'SpO2, Accelerometer' },
    },
    {
      name: 'Lifelong Adjustable Dumbbell 5kg',
      description: 'Lifelong PVC adjustable dumbbell set with anti-slip grip, 5kg pair for home gym workouts.',
      price: 699,
      originalPrice: 1500,
      discountPercent: 53,
      stock: 130,
      rating: 4.0,
      ratingCount: 9876,
      categoryId: sports.id,
      brand: 'Lifelong',
      images: [
        'https://picsum.photos/seed/dumbbell1/400/400',
        'https://picsum.photos/seed/dumbbell2/400/400',
        'https://picsum.photos/seed/dumbbell3/400/400',
      ],
      specifications: { Weight: '5 kg (pair)', Material: 'PVC', Grip: 'Anti-slip', Use: 'Home Gym', 'Set Includes': '2 Dumbbells' },
    },

    // Additional category-relevant products (5)
    {
      name: 'OnePlus Nord Buds 2r',
      description: 'True wireless earbuds with 12.4mm drivers, Bluetooth 5.3, and low-latency gaming mode.',
      price: 2199,
      originalPrice: 3299,
      discountPercent: 33,
      stock: 95,
      rating: 4.2,
      ratingCount: 7632,
      categoryId: electronics.id,
      brand: 'OnePlus',
      images: [],
      specifications: { Driver: '12.4mm', Connectivity: 'Bluetooth 5.3', Battery: '38 hours', Resistance: 'IP55', Mic: 'Dual AI Mic' },
    },
    {
      name: 'Adidas Essentials Cotton Hoodie',
      description: 'Comfortable regular-fit hoodie made with soft cotton blend and ribbed cuffs.',
      price: 1999,
      originalPrice: 3499,
      discountPercent: 42,
      stock: 88,
      rating: 4.1,
      ratingCount: 4120,
      categoryId: fashion.id,
      brand: 'Adidas',
      images: [],
      specifications: { Fit: 'Regular', Fabric: 'Cotton Blend', Sleeve: 'Full Sleeve', Pattern: 'Solid', Hood: 'Adjustable Drawcord' },
    },
    {
      name: 'Instant Vortex 4L Air Fryer',
      description: '4L digital air fryer with one-touch controls, rapid air circulation, and 1400W heating.',
      price: 5299,
      originalPrice: 7999,
      discountPercent: 34,
      stock: 34,
      rating: 4.4,
      ratingCount: 2198,
      categoryId: homeKitchen.id,
      brand: 'Instant',
      images: [],
      specifications: { Capacity: '4 L', Power: '1400W', Controls: 'Digital Touch', Modes: '6 Presets', Warranty: '1 Year' },
    },
    {
      name: 'Deep Work by Cal Newport',
      description: 'Rules for focused success in a distracted world. A practical guide to mastering deep work.',
      price: 379,
      originalPrice: 699,
      discountPercent: 46,
      stock: 210,
      rating: 4.5,
      ratingCount: 14021,
      categoryId: books.id,
      brand: 'Piatkus',
      images: [],
      specifications: { Author: 'Cal Newport', Pages: '304', Language: 'English', Publisher: 'Piatkus', Format: 'Paperback' },
    },
    {
      name: 'Decathlon Resistance Band Set',
      description: 'Multi-level resistance bands for mobility, stretching, and full-body home workouts.',
      price: 899,
      originalPrice: 1499,
      discountPercent: 40,
      stock: 140,
      rating: 4.3,
      ratingCount: 5324,
      categoryId: sports.id,
      brand: 'Decathlon',
      images: [],
      specifications: { Levels: 'Light/Medium/Heavy', Material: 'Natural Latex', Use: 'Strength & Mobility', Count: '3 Bands', Accessories: 'Carry Bag' },
    },
  ];

  const categoryNameById = Object.fromEntries(categories.map((category) => [category.id, category.name]));

  for (const product of products) {
    const categoryName = categoryNameById[product.categoryId] || '';
    const imageQuery = `${product.brand || ''} ${product.name} ${categoryName} product`;

    await prisma.product.create({
      data: {
        ...product,
        images: buildImageSet(imageQuery),
      },
    });
  }

  console.log('✅ Seed data created successfully!');
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
