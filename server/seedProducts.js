require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const productsToSeed = [
  {
    name: 'Simple Rose',
    category: 'Flowers',
    price: 69,
    stock: 20,
    image: '/assets/roses.png',
    description: 'Single stems of elegant handmade pipe cleaner roses.'
  },
  {
    name: 'Rose Bouquet',
    category: 'Flowers',
    price: 349,
    stock: 10,
    image: '/assets/roses.png',
    description: 'A lush bouquet of pipe cleaner roses wrapped with love.'
  },
  {
    name: 'Simple Sunflower',
    category: 'Flowers',
    price: 69,
    stock: 20,
    image: '/assets/sunflower.png',
    description: 'Bright and cheerful handmade pipe cleaner sunflowers.'
  },
  {
    name: 'Sunflower Bouquet',
    category: 'Flowers',
    price: 249,
    stock: 10,
    image: '/assets/sunflower.png',
    description: 'A sunny collection of sunflowers to light up any room.'
  },
  {
    name: 'Simple Tulip',
    category: 'Flowers',
    price: 69,
    stock: 20,
    image: '/assets/tulips.png',
    description: 'Delicate handmade pipe cleaner tulips in vibrant colors.'
  },
  {
    name: 'Tulip Bouquet',
    category: 'Flowers',
    price: 299,
    stock: 10,
    image: '/assets/tulips.png',
    description: 'A whimsical bouquet of assorted handmade pipe cleaner tulips.'
  },
  {
    name: 'Simple Lily',
    category: 'Flowers',
    price: 79,
    stock: 20,
    image: '/assets/lily.png',
    description: 'Exquisite handmade pipe cleaner lilies with refined details.'
  },
  {
    name: 'Lily Bouquet',
    category: 'Flowers',
    price: 399,
    stock: 10,
    image: '/assets/lily.png',
    description: 'A premium bouquet of pipe cleaner lilies for sophisticated gifting.'
  },
  {
    name: 'Handmade Woolen Doll',
    category: 'Dolls',
    price: 499,
    stock: 15,
    image: '/assets/woolen_doll.png',
    description: 'A beautifully handcrafted crocheted woolen doll made with soft premium yarn. Perfect for gifts, toys, and decor.'
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB. Seeding products...');

    // Clear existing products to ensure fresh seeding with the new theme
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    for (const p of productsToSeed) {
      const product = new Product(p);
      await product.save();
      console.log(`Seeded product: ${product.name}`);
    }

    console.log('Products seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
