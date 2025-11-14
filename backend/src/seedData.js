const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@ecommerce.com',
      password: adminPassword,
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@ecommerce.com',
      password: userPassword,
      role: 'user',
      isEmailVerified: true,
      isActive: true,
      phone: '+1234567890',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zipCode: '10001'
      }
    });

    console.log('Users created successfully');

    // Create categories
    const categories = [
      {
        name: 'Men',
        description: 'Men\'s clothing and accessories',
        isActive: true
      },
      {
        name: 'Women',
        description: 'Women\'s clothing and accessories',
        isActive: true
      },
      {
        name: 'Kids',
        description: 'Children\'s clothing',
        isActive: true
      },
      {
        name: 'Accessories',
        description: 'Fashion accessories',
        isActive: true
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('Categories created successfully');

    // Create products
    const products = [
      {
        name: 'Classic Cotton T-Shirt',
        description: 'Comfortable and stylish cotton t-shirt perfect for everyday wear. Made from 100% premium cotton.',
        price: 29.99,
        comparePrice: 39.99,
        category: createdCategories[0]._id, // Men
        brand: 'StyleCo',
        sku: 'TSH-001',
        images: [
          { url: '/images/tshirt1.jpg', alt: 'Classic Cotton T-Shirt' }
        ],
        variants: [
          { size: 'S', color: 'Black', stock: 50, sku: 'TSH-001-S-BLK' },
          { size: 'M', color: 'Black', stock: 75, sku: 'TSH-001-M-BLK' },
          { size: 'L', color: 'Black', stock: 60, sku: 'TSH-001-L-BLK' },
          { size: 'XL', color: 'Black', stock: 40, sku: 'TSH-001-XL-BLK' },
          { size: 'S', color: 'White', stock: 45, sku: 'TSH-001-S-WHT' },
          { size: 'M', color: 'White', stock: 70, sku: 'TSH-001-M-WHT' },
          { size: 'L', color: 'White', stock: 55, sku: 'TSH-001-L-WHT' },
          { size: 'XL', color: 'White', stock: 35, sku: 'TSH-001-XL-WHT' }
        ],
        tags: ['casual', 'cotton', 'basic', 'comfortable'],
        features: ['100% Cotton', 'Machine Washable', 'Breathable Fabric'],
        specifications: {
          material: '100% Cotton',
          care: 'Machine wash cold, tumble dry low',
          origin: 'Made in USA'
        },
        isActive: true,
        isFeatured: true,
        createdBy: admin._id
      },
      {
        name: 'Denim Jeans',
        description: 'Premium quality denim jeans with a perfect fit. Classic blue wash with modern styling.',
        price: 79.99,
        comparePrice: 99.99,
        category: createdCategories[0]._id, // Men
        brand: 'DenimCo',
        sku: 'JNS-001',
        images: [
          { url: '/images/jeans1.jpg', alt: 'Denim Jeans' }
        ],
        variants: [
          { size: 'S', color: 'Blue', stock: 30, sku: 'JNS-001-S-BLU' },
          { size: 'M', color: 'Blue', stock: 45, sku: 'JNS-001-M-BLU' },
          { size: 'L', color: 'Blue', stock: 40, sku: 'JNS-001-L-BLU' },
          { size: 'XL', color: 'Blue', stock: 25, sku: 'JNS-001-XL-BLU' },
          { size: 'S', color: 'Dark Blue', stock: 35, sku: 'JNS-001-S-DBL' },
          { size: 'M', color: 'Dark Blue', stock: 50, sku: 'JNS-001-M-DBL' },
          { size: 'L', color: 'Dark Blue', stock: 45, sku: 'JNS-001-L-DBL' },
          { size: 'XL', color: 'Dark Blue', stock: 30, sku: 'JNS-001-XL-DBL' }
        ],
        tags: ['denim', 'jeans', 'casual', 'classic'],
        features: ['Premium Denim', '5-Pocket Design', 'Regular Fit'],
        specifications: {
          material: '98% Cotton, 2% Elastane',
          care: 'Machine wash cold, hang dry',
          origin: 'Made in Italy'
        },
        isActive: true,
        isFeatured: true,
        createdBy: admin._id
      },
      {
        name: 'Summer Dress',
        description: 'Beautiful floral summer dress perfect for warm weather. Lightweight and comfortable.',
        price: 59.99,
        comparePrice: 79.99,
        category: createdCategories[1]._id, // Women
        brand: 'FlowerPower',
        sku: 'DRS-001',
        images: [
          { url: '/images/dress1.jpg', alt: 'Summer Dress' }
        ],
        variants: [
          { size: 'S', color: 'Floral', stock: 25, sku: 'DRS-001-S-FLR' },
          { size: 'M', color: 'Floral', stock: 35, sku: 'DRS-001-M-FLR' },
          { size: 'L', color: 'Floral', stock: 30, sku: 'DRS-001-L-FLR' },
          { size: 'XL', color: 'Floral', stock: 20, sku: 'DRS-001-XL-FLR' }
        ],
        tags: ['dress', 'summer', 'floral', 'feminine'],
        features: ['Floral Print', 'Midi Length', 'Sleeveless'],
        specifications: {
          material: '100% Viscose',
          care: 'Hand wash cold, air dry',
          origin: 'Made in India'
        },
        isActive: true,
        isFeatured: true,
        createdBy: admin._id
      },
      {
        name: 'Kids Rainbow T-Shirt',
        description: 'Colorful and fun t-shirt for kids with a beautiful rainbow design. Soft and comfortable.',
        price: 19.99,
        comparePrice: 24.99,
        category: createdCategories[2]._id, // Kids
        brand: 'KidStyle',
        sku: 'KTS-001',
        images: [
          { url: '/images/kids-tshirt1.jpg', alt: 'Kids Rainbow T-Shirt' }
        ],
        variants: [
          { size: 'S', color: 'Rainbow', stock: 40, sku: 'KTS-001-S-RBW' },
          { size: 'M', color: 'Rainbow', stock: 45, sku: 'KTS-001-M-RBW' },
          { size: 'L', color: 'Rainbow', stock: 35, sku: 'KTS-001-L-RBW' },
          { size: 'XL', color: 'Rainbow', stock: 25, sku: 'KTS-001-XL-RBW' }
        ],
        tags: ['kids', 'colorful', 'rainbow', 'fun'],
        features: ['Rainbow Print', 'Soft Cotton', 'Machine Washable'],
        specifications: {
          material: '100% Cotton',
          care: 'Machine wash warm, tumble dry low',
          origin: 'Made in Bangladesh'
        },
        isActive: true,
        isFeatured: false,
        createdBy: admin._id
      },
      {
        name: 'Leather Watch',
        description: 'Elegant leather watch with classic design. Perfect accessory for any occasion.',
        price: 149.99,
        comparePrice: 199.99,
        category: createdCategories[3]._id, // Accessories
        brand: 'TimeKeeper',
        sku: 'WTC-001',
        images: [
          { url: '/images/watch1.jpg', alt: 'Leather Watch' }
        ],
        variants: [
          { size: 'S', color: 'Brown', stock: 15, sku: 'WTC-001-S-BRN' },
          { size: 'M', color: 'Brown', stock: 20, sku: 'WTC-001-M-BRN' },
          { size: 'L', color: 'Brown', stock: 18, sku: 'WTC-001-L-BRN' },
          { size: 'S', color: 'Black', stock: 12, sku: 'WTC-001-S-BLK' },
          { size: 'M', color: 'Black', stock: 25, sku: 'WTC-001-M-BLK' },
          { size: 'L', color: 'Black', stock: 22, sku: 'WTC-001-L-BLK' }
        ],
        tags: ['watch', 'leather', 'accessories', 'elegant'],
        features: ['Quartz Movement', 'Water Resistant', 'Genuine Leather'],
        specifications: {
          material: 'Genuine Leather Strap, Stainless Steel Case',
          care: 'Avoid water contact, clean with dry cloth',
          origin: 'Made in Switzerland'
        },
        isActive: true,
        isFeatured: false,
        createdBy: admin._id
      }
    ];

    await Product.insertMany(products);
    console.log('Products created successfully');

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('Admin: admin@ecommerce.com / admin123');
    console.log('User: user@ecommerce.com / user123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedData();