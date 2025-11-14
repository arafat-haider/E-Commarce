const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Add the parent directory to the module search path
require('module').globalPaths.push(path.join(__dirname, '..'));

const Product = require('../src/models/Product');
const Category = require('../src/models/Category');
const User = require('../src/models/User');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const categories = [
  { name: 'Men', description: 'Men\'s clothing and accessories' },
  { name: 'Women', description: 'Women\'s clothing and accessories' },
  { name: 'Kids', description: 'Children\'s clothing and accessories' },
  { name: 'Accessories', description: 'Fashion accessories and more' }
];

const sampleProducts = [
  // Men's Products
  {
    name: 'Classic Cotton T-Shirt',
    description: 'Comfortable and stylish cotton t-shirt perfect for everyday wear. Made from 100% organic cotton.',
    price: 29.99,
    comparePrice: 39.99,
    category: 'Men',
    brand: 'StyleCo',
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'Classic Cotton T-Shirt' }
    ],
    variants: [
      { size: 'S', color: 'White', stock: 50, sku: 'CT-WH-S' },
      { size: 'M', color: 'White', stock: 75, sku: 'CT-WH-M' },
      { size: 'L', color: 'White', stock: 60, sku: 'CT-WH-L' },
      { size: 'S', color: 'Black', stock: 40, sku: 'CT-BK-S' },
      { size: 'M', color: 'Black', stock: 85, sku: 'CT-BK-M' },
      { size: 'L', color: 'Black', stock: 70, sku: 'CT-BK-L' },
      { size: 'S', color: 'Navy', stock: 30, sku: 'CT-NV-S' },
      { size: 'M', color: 'Navy', stock: 45, sku: 'CT-NV-M' },
      { size: 'L', color: 'Navy', stock: 35, sku: 'CT-NV-L' }
    ],
    features: ['100% Organic Cotton', 'Machine Washable', 'Comfortable Fit'],
    specifications: {
      'Material': '100% Cotton',
      'Fit': 'Regular',
      'Care': 'Machine Wash Cold'
    }
  },
  {
    name: 'Denim Jacket',
    description: 'Classic denim jacket with modern styling. Perfect for layering and casual outfits.',
    price: 89.99,
    comparePrice: 129.99,
    category: 'Men',
    brand: 'DeniCo',
    images: [
      { url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500', alt: 'Denim Jacket' }
    ],
    variants: [
      { size: 'S', color: 'Light Blue', stock: 25, sku: 'DJ-LB-S' },
      { size: 'M', color: 'Light Blue', stock: 35, sku: 'DJ-LB-M' },
      { size: 'L', color: 'Light Blue', stock: 30, sku: 'DJ-LB-L' },
      { size: 'XL', color: 'Light Blue', stock: 20, sku: 'DJ-LB-XL' },
      { size: 'S', color: 'Dark Blue', stock: 30, sku: 'DJ-DB-S' },
      { size: 'M', color: 'Dark Blue', stock: 40, sku: 'DJ-DB-M' },
      { size: 'L', color: 'Dark Blue', stock: 35, sku: 'DJ-DB-L' },
      { size: 'XL', color: 'Dark Blue', stock: 25, sku: 'DJ-DB-XL' }
    ],
    features: ['Classic Fit', 'Button Closure', 'Multiple Pockets'],
    specifications: {
      'Material': '98% Cotton, 2% Elastane',
      'Fit': 'Regular',
      'Style': 'Classic'
    }
  },
  {
    name: 'Formal Dress Shirt',
    description: 'Professional dress shirt for business and formal occasions. Wrinkle-resistant fabric.',
    price: 59.99,
    category: 'Men',
    brand: 'BusinessPro',
    images: [
      { url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500', alt: 'Formal Dress Shirt' }
    ],
    variants: [
      { size: 'S', color: 'White', stock: 40, sku: 'DS-WH-S' },
      { size: 'M', color: 'White', stock: 60, sku: 'DS-WH-M' },
      { size: 'L', color: 'White', stock: 55, sku: 'DS-WH-L' },
      { size: 'XL', color: 'White', stock: 35, sku: 'DS-WH-XL' },
      { size: 'S', color: 'Light Blue', stock: 30, sku: 'DS-LB-S' },
      { size: 'M', color: 'Light Blue', stock: 45, sku: 'DS-LB-M' },
      { size: 'L', color: 'Light Blue', stock: 40, sku: 'DS-LB-L' },
      { size: 'XL', color: 'Light Blue', stock: 25, sku: 'DS-LB-XL' }
    ],
    features: ['Wrinkle Resistant', 'Easy Care', 'Professional Fit'],
    specifications: {
      'Material': '60% Cotton, 40% Polyester',
      'Collar': 'Spread Collar',
      'Cuff': 'Button Cuff'
    }
  },

  // Women's Products
  {
    name: 'Floral Summer Dress',
    description: 'Beautiful floral print dress perfect for summer occasions. Lightweight and comfortable.',
    price: 79.99,
    comparePrice: 99.99,
    category: 'Women',
    brand: 'FloraFashion',
    images: [
      { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', alt: 'Floral Summer Dress' }
    ],
    variants: [
      { size: 'XS', color: 'Pink Floral', stock: 20, sku: 'FD-PF-XS' },
      { size: 'S', color: 'Pink Floral', stock: 35, sku: 'FD-PF-S' },
      { size: 'M', color: 'Pink Floral', stock: 40, sku: 'FD-PF-M' },
      { size: 'L', color: 'Pink Floral', stock: 30, sku: 'FD-PF-L' },
      { size: 'XS', color: 'Blue Floral', stock: 25, sku: 'FD-BF-XS' },
      { size: 'S', color: 'Blue Floral', stock: 40, sku: 'FD-BF-S' },
      { size: 'M', color: 'Blue Floral', stock: 45, sku: 'FD-BF-M' },
      { size: 'L', color: 'Blue Floral', stock: 35, sku: 'FD-BF-L' }
    ],
    features: ['Floral Print', 'Lightweight Fabric', 'Summer Perfect'],
    specifications: {
      'Material': '100% Rayon',
      'Length': 'Midi',
      'Neckline': 'V-Neck'
    }
  },
  {
    name: 'Casual Blouse',
    description: 'Versatile blouse that can be dressed up or down. Perfect for work or casual outings.',
    price: 49.99,
    category: 'Women',
    brand: 'CasualChic',
    images: [
      { url: 'https://images.unsplash.com/photo-1564257577-2367d82c79e2?w=500', alt: 'Casual Blouse' }
    ],
    variants: [
      { size: 'XS', color: 'White', stock: 30, sku: 'CB-WH-XS' },
      { size: 'S', color: 'White', stock: 45, sku: 'CB-WH-S' },
      { size: 'M', color: 'White', stock: 50, sku: 'CB-WH-M' },
      { size: 'L', color: 'White', stock: 40, sku: 'CB-WH-L' },
      { size: 'XS', color: 'Black', stock: 25, sku: 'CB-BK-XS' },
      { size: 'S', color: 'Black', stock: 40, sku: 'CB-BK-S' },
      { size: 'M', color: 'Black', stock: 45, sku: 'CB-BK-M' },
      { size: 'L', color: 'Black', stock: 35, sku: 'CB-BK-L' }
    ],
    features: ['Versatile Style', 'Comfortable Fit', 'Easy Care'],
    specifications: {
      'Material': '95% Polyester, 5% Elastane',
      'Sleeve': 'Long Sleeve',
      'Fit': 'Relaxed'
    }
  },
  {
    name: 'High-Waist Jeans',
    description: 'Trendy high-waist jeans with a flattering fit. Made from premium denim.',
    price: 69.99,
    comparePrice: 89.99,
    category: 'Women',
    brand: 'DeniCo',
    images: [
      { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', alt: 'High-Waist Jeans' }
    ],
    variants: [
      { size: '26', color: 'Dark Wash', stock: 20, sku: 'HJ-DW-26' },
      { size: '27', color: 'Dark Wash', stock: 35, sku: 'HJ-DW-27' },
      { size: '28', color: 'Dark Wash', stock: 40, sku: 'HJ-DW-28' },
      { size: '29', color: 'Dark Wash', stock: 35, sku: 'HJ-DW-29' },
      { size: '30', color: 'Dark Wash', stock: 30, sku: 'HJ-DW-30' },
      { size: '26', color: 'Light Wash', stock: 25, sku: 'HJ-LW-26' },
      { size: '27', color: 'Light Wash', stock: 30, sku: 'HJ-LW-27' },
      { size: '28', color: 'Light Wash', stock: 35, sku: 'HJ-LW-28' },
      { size: '29', color: 'Light Wash', stock: 30, sku: 'HJ-LW-29' },
      { size: '30', color: 'Light Wash', stock: 25, sku: 'HJ-LW-30' }
    ],
    features: ['High-Waist Design', 'Premium Denim', 'Flattering Fit'],
    specifications: {
      'Material': '98% Cotton, 2% Elastane',
      'Rise': 'High Rise',
      'Fit': 'Skinny'
    }
  },

  // Kids Products
  {
    name: 'Kids Rainbow T-Shirt',
    description: 'Colorful rainbow print t-shirt that kids love. Soft and comfortable cotton blend.',
    price: 19.99,
    category: 'Kids',
    brand: 'KidsJoy',
    images: [
      { url: 'https://images.unsplash.com/photo-1503919295314-56d4b7cb7ac7?w=500', alt: 'Kids Rainbow T-Shirt' }
    ],
    variants: [
      { size: '2T', color: 'Rainbow', stock: 25, sku: 'KR-RB-2T' },
      { size: '3T', color: 'Rainbow', stock: 30, sku: 'KR-RB-3T' },
      { size: '4T', color: 'Rainbow', stock: 35, sku: 'KR-RB-4T' },
      { size: '5T', color: 'Rainbow', stock: 30, sku: 'KR-RB-5T' },
      { size: '6', color: 'Rainbow', stock: 25, sku: 'KR-RB-6' },
      { size: '8', color: 'Rainbow', stock: 20, sku: 'KR-RB-8' }
    ],
    features: ['Fun Rainbow Design', 'Soft Cotton', 'Machine Washable'],
    specifications: {
      'Material': '100% Cotton',
      'Print': 'Rainbow',
      'Care': 'Machine Wash'
    }
  },
  {
    name: 'Kids Denim Overalls',
    description: 'Adorable denim overalls perfect for playtime. Adjustable straps for growing kids.',
    price: 39.99,
    comparePrice: 49.99,
    category: 'Kids',
    brand: 'PlayTime',
    images: [
      { url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500', alt: 'Kids Denim Overalls' }
    ],
    variants: [
      { size: '2T', color: 'Light Blue', stock: 20, sku: 'KO-LB-2T' },
      { size: '3T', color: 'Light Blue', stock: 25, sku: 'KO-LB-3T' },
      { size: '4T', color: 'Light Blue', stock: 30, sku: 'KO-LB-4T' },
      { size: '5T', color: 'Light Blue', stock: 25, sku: 'KO-LB-5T' },
      { size: '6', color: 'Light Blue', stock: 20, sku: 'KO-LB-6' }
    ],
    features: ['Adjustable Straps', 'Multiple Pockets', 'Durable Construction'],
    specifications: {
      'Material': '100% Cotton Denim',
      'Style': 'Classic Overalls',
      'Closure': 'Button'
    }
  },

  // Accessories
  {
    name: 'Leather Crossbody Bag',
    description: 'Elegant leather crossbody bag perfect for daily use. Multiple compartments for organization.',
    price: 129.99,
    comparePrice: 179.99,
    category: 'Accessories',
    brand: 'LeatherCraft',
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Leather Crossbody Bag' }
    ],
    variants: [
      { size: 'One Size', color: 'Brown', stock: 15, sku: 'LB-BR-OS' },
      { size: 'One Size', color: 'Black', stock: 20, sku: 'LB-BK-OS' },
      { size: 'One Size', color: 'Tan', stock: 12, sku: 'LB-TN-OS' }
    ],
    features: ['Genuine Leather', 'Multiple Compartments', 'Adjustable Strap'],
    specifications: {
      'Material': 'Genuine Leather',
      'Dimensions': '10" x 8" x 3"',
      'Strap': 'Adjustable'
    }
  },
  {
    name: 'Classic Watch',
    description: 'Timeless classic watch with leather strap. Perfect accessory for any outfit.',
    price: 199.99,
    comparePrice: 299.99,
    category: 'Accessories',
    brand: 'TimeClass',
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', alt: 'Classic Watch' }
    ],
    variants: [
      { size: 'One Size', color: 'Brown Leather', stock: 10, sku: 'CW-BL-OS' },
      { size: 'One Size', color: 'Black Leather', stock: 15, sku: 'CW-BLK-OS' }
    ],
    features: ['Water Resistant', 'Leather Strap', 'Classic Design'],
    specifications: {
      'Movement': 'Quartz',
      'Water Resistance': '30m',
      'Case': 'Stainless Steel'
    }
  },
  {
    name: 'Knit Winter Scarf',
    description: 'Cozy knit scarf perfect for cold weather. Soft and warm material.',
    price: 34.99,
    category: 'Accessories',
    brand: 'WarmCo',
    images: [
      { url: 'https://images.unsplash.com/photo-1520903074185-8eca362b3dce?w=500', alt: 'Knit Winter Scarf' }
    ],
    variants: [
      { size: 'One Size', color: 'Gray', stock: 30, sku: 'KS-GR-OS' },
      { size: 'One Size', color: 'Navy', stock: 25, sku: 'KS-NV-OS' },
      { size: 'One Size', color: 'Cream', stock: 20, sku: 'KS-CR-OS' },
      { size: 'One Size', color: 'Black', stock: 35, sku: 'KS-BK-OS' }
    ],
    features: ['Soft Knit Material', 'Warm and Cozy', 'Versatile Style'],
    specifications: {
      'Material': '100% Acrylic',
      'Length': '70 inches',
      'Care': 'Hand Wash'
    }
  }
];

const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});

    // Create categories
    console.log('Creating categories...');
    const createdCategories = await Category.create(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create users with hashed passwords
    console.log('Creating users...');
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );
    const createdUsers = await User.create(usersWithHashedPasswords);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create products with category references
    console.log('Creating products...');
    const productsWithCategoryIds = await Promise.all(
      sampleProducts.map(async (product) => {
        const category = createdCategories.find(cat => cat.name === product.category);
        return {
          ...product,
          category: category._id
        };
      })
    );
    
    const createdProducts = await Product.create(productsWithCategoryIds);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n👤 Demo Accounts:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: user@example.com / user123');
    console.log('\n📦 Sample Products:');
    createdProducts.forEach(product => {
      console.log(`- ${product.name} (${product.category}) - $${product.price}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

module.exports = seedDatabase;

// Run if called directly
if (require.main === module) {
  seedDatabase();
}