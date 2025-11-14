import { Product, Category } from '@/types';

// Demo products for development and testing
export const demoProducts: Product[] = [
  {
    _id: 'demo-1',
    name: 'Classic Cotton T-Shirt',
    description: 'Comfortable and stylish cotton t-shirt perfect for everyday wear. Made from 100% organic cotton.',
    price: 29.99,
    comparePrice: 39.99,
    category: 'demo-cat-1',
    brand: 'StyleCo',
    sku: 'CCT-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'Classic Cotton T-Shirt' }
    ],
    variants: [
      { size: 'S', color: 'White', stock: 50, sku: 'CCT-001-S-W' },
      { size: 'M', color: 'White', stock: 75, sku: 'CCT-001-M-W' },
      { size: 'L', color: 'White', stock: 60, sku: 'CCT-001-L-W' },
      { size: 'S', color: 'Black', stock: 40, sku: 'CCT-001-S-B' },
      { size: 'M', color: 'Black', stock: 85, sku: 'CCT-001-M-B' },
      { size: 'L', color: 'Black', stock: 70, sku: 'CCT-001-L-B' }
    ],
    totalStock: 380,
    tags: ['cotton', 'casual', 'basic', 'everyday'],
    averageRating: 4.5,
    numReviews: 125,
    features: ['100% Organic Cotton', 'Machine Washable', 'Comfortable Fit'],
    specifications: {
      material: '100% Cotton',
      care: 'Machine Wash Cold',
      origin: 'Made in Turkey'
    },
    reviews: [],
    isActive: true,
    isFeatured: true,
    createdBy: 'demo-user',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'demo-2',
    name: 'Denim Jacket',
    description: 'Classic denim jacket with modern styling. Perfect for layering and casual outfits.',
    price: 89.99,
    comparePrice: 119.99,
    category: 'demo-cat-1',
    brand: 'DenimCo',
    sku: 'DJ-002',
    images: [
      { url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', alt: 'Denim Jacket' }
    ],
    variants: [
      { size: 'S', color: 'Light Blue', stock: 25, sku: 'DJ-002-S-LB' },
      { size: 'M', color: 'Light Blue', stock: 30, sku: 'DJ-002-M-LB' },
      { size: 'L', color: 'Light Blue', stock: 20, sku: 'DJ-002-L-LB' },
      { size: 'XL', color: 'Light Blue', stock: 15, sku: 'DJ-002-XL-LB' }
    ],
    totalStock: 90,
    tags: ['denim', 'jacket', 'casual', 'layering'],
    averageRating: 4.3,
    numReviews: 89,
    features: ['100% Cotton Denim', 'Classic Fit', 'Button Closure', 'Chest Pockets'],
    specifications: {
      material: '100% Cotton Denim',
      care: 'Machine wash cold, hang dry',
      origin: 'Made in Mexico'
    },
    reviews: [],
    isActive: true,
    isFeatured: false,
    createdBy: 'demo-user',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    _id: 'demo-3',
    name: 'Floral Summer Dress',
    description: 'Elegant floral dress perfect for spring and summer occasions. Features a flattering A-line silhouette.',
    price: 79.99,
    comparePrice: 99.99,
    category: 'demo-cat-2',
    brand: 'FloralFashion',
    sku: 'WFD-003',
    images: [
      { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500', alt: 'Floral Summer Dress' }
    ],
    variants: [
      { size: 'XS', color: 'Pink Floral', stock: 15, sku: 'WFD-003-XS-PF' },
      { size: 'S', color: 'Pink Floral', stock: 25, sku: 'WFD-003-S-PF' },
      { size: 'M', color: 'Pink Floral', stock: 30, sku: 'WFD-003-M-PF' },
      { size: 'L', color: 'Pink Floral', stock: 20, sku: 'WFD-003-L-PF' }
    ],
    totalStock: 90,
    tags: ['dress', 'floral', 'spring', 'summer', 'elegant'],
    averageRating: 4.7,
    numReviews: 156,
    features: ['A-Line Silhouette', 'Midi Length', 'Floral Print', 'Comfortable Fabric'],
    specifications: {
      material: '95% Polyester, 5% Elastane',
      care: 'Hand wash cold, hang dry',
      origin: 'Made in India'
    },
    reviews: [],
    isActive: true,
    isFeatured: true,
    createdBy: 'demo-user',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    _id: 'demo-4',
    name: 'Kids Rainbow Sneakers',
    description: 'Colorful and comfortable sneakers for active kids. Features rainbow colors and cushioned sole.',
    price: 49.99,
    comparePrice: 59.99,
    category: 'demo-cat-3',
    brand: 'KidsStep',
    sku: 'KRS-004',
    images: [
      { url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500', alt: 'Kids Rainbow Sneakers' }
    ],
    variants: [
      { size: 'XS', color: 'Rainbow', stock: 20, sku: 'KRS-004-XS-R' },
      { size: 'S', color: 'Rainbow', stock: 25, sku: 'KRS-004-S-R' },
      { size: 'M', color: 'Rainbow', stock: 30, sku: 'KRS-004-M-R' }
    ],
    totalStock: 75,
    tags: ['kids', 'sneakers', 'colorful', 'comfortable', 'rainbow'],
    averageRating: 4.6,
    numReviews: 92,
    features: ['Rainbow Colors', 'Cushioned Sole', 'Breathable Material', 'Easy Velcro Closure'],
    specifications: {
      material: 'Synthetic Upper, Rubber Sole',
      care: 'Spot clean only',
      origin: 'Made in Vietnam'
    },
    reviews: [],
    isActive: true,
    isFeatured: false,
    createdBy: 'demo-user',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },
  {
    _id: 'demo-5',
    name: 'Leather Handbag',
    description: 'Premium leather handbag with spacious interior and elegant design. Perfect for work or special occasions.',
    price: 149.99,
    comparePrice: 199.99,
    category: 'demo-cat-4',
    brand: 'LuxeLeather',
    sku: 'LH-005',
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Leather Handbag' }
    ],
    variants: [
      { size: 'M', color: 'Black', stock: 15, sku: 'LH-005-M-B' },
      { size: 'M', color: 'Brown', stock: 12, sku: 'LH-005-M-BR' },
      { size: 'M', color: 'Tan', stock: 8, sku: 'LH-005-M-T' }
    ],
    totalStock: 35,
    tags: ['leather', 'handbag', 'luxury', 'work', 'elegant'],
    averageRating: 4.8,
    numReviews: 67,
    features: ['Genuine Leather', 'Multiple Compartments', 'Adjustable Strap', 'Gold Hardware'],
    specifications: {
      material: '100% Genuine Leather',
      care: 'Clean with leather conditioner',
      origin: 'Made in Italy'
    },
    reviews: [],
    isActive: true,
    isFeatured: true,
    createdBy: 'demo-user',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    _id: 'demo-6',
    name: 'Sports Running Shoes',
    description: 'High-performance running shoes with advanced cushioning and breathable mesh upper.',
    price: 129.99,
    comparePrice: 159.99,
    category: 'demo-cat-1',
    brand: 'SportTech',
    sku: 'SRS-006',
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', alt: 'Sports Running Shoes' }
    ],
    variants: [
      { size: 'S', color: 'Black/White', stock: 20, sku: 'SRS-006-S-BW' },
      { size: 'M', color: 'Black/White', stock: 25, sku: 'SRS-006-M-BW' },
      { size: 'L', color: 'Black/White', stock: 18, sku: 'SRS-006-L-BW' },
      { size: 'XL', color: 'Black/White', stock: 12, sku: 'SRS-006-XL-BW' }
    ],
    totalStock: 75,
    tags: ['sports', 'running', 'shoes', 'athletic', 'performance'],
    averageRating: 4.4,
    numReviews: 134,
    features: ['Advanced Cushioning', 'Breathable Mesh', 'Lightweight Design', 'Non-Slip Sole'],
    specifications: {
      material: 'Synthetic Mesh Upper, EVA Midsole',
      care: 'Hand wash, air dry',
      origin: 'Made in China'
    },
    reviews: [],
    isActive: true,
    isFeatured: false,
    createdBy: 'demo-user',
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z'
  },
  {
    _id: 'demo-7',
    name: 'Vintage Sunglasses',
    description: 'Classic vintage-style sunglasses with UV protection. Perfect accessory for sunny days.',
    price: 39.99,
    comparePrice: 49.99,
    category: 'demo-cat-4',
    brand: 'RetroStyle',
    sku: 'VS-007',
    images: [
      { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', alt: 'Vintage Sunglasses' }
    ],
    variants: [
      { size: 'M', color: 'Black Frame', stock: 30, sku: 'VS-007-M-BF' },
      { size: 'M', color: 'Tortoiseshell', stock: 25, sku: 'VS-007-M-T' },
      { size: 'M', color: 'Gold Frame', stock: 20, sku: 'VS-007-M-GF' }
    ],
    totalStock: 75,
    tags: ['sunglasses', 'vintage', 'accessories', 'uv-protection', 'retro'],
    averageRating: 4.2,
    numReviews: 78,
    features: ['UV400 Protection', 'Vintage Design', 'Lightweight Frame', 'Scratch Resistant'],
    specifications: {
      material: 'Acetate Frame, Polycarbonate Lenses',
      care: 'Clean with microfiber cloth',
      origin: 'Made in China'
    },
    reviews: [],
    isActive: true,
    isFeatured: false,
    createdBy: 'demo-user',
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z'
  },
  {
    _id: 'demo-8',
    name: 'Cozy Wool Sweater',
    description: 'Soft and warm wool sweater perfect for cold weather. Features a comfortable crew neck design.',
    price: 69.99,
    comparePrice: 89.99,
    category: 'demo-cat-2',
    brand: 'WarmWear',
    sku: 'CWS-008',
    images: [
      { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500', alt: 'Cozy Wool Sweater' }
    ],
    variants: [
      { size: 'S', color: 'Cream', stock: 18, sku: 'CWS-008-S-C' },
      { size: 'M', color: 'Cream', stock: 22, sku: 'CWS-008-M-C' },
      { size: 'L', color: 'Cream', stock: 15, sku: 'CWS-008-L-C' },
      { size: 'S', color: 'Navy', stock: 20, sku: 'CWS-008-S-N' },
      { size: 'M', color: 'Navy', stock: 25, sku: 'CWS-008-M-N' },
      { size: 'L', color: 'Navy', stock: 18, sku: 'CWS-008-L-N' }
    ],
    totalStock: 118,
    tags: ['wool', 'sweater', 'warm', 'cozy', 'winter'],
    averageRating: 4.6,
    numReviews: 103,
    features: ['100% Merino Wool', 'Crew Neck', 'Ribbed Cuffs', 'Soft Texture'],
    specifications: {
      material: '100% Merino Wool',
      care: 'Hand wash cold, lay flat to dry',
      origin: 'Made in Scotland'
    },
    reviews: [],
    isActive: true,
    isFeatured: true,
    createdBy: 'demo-user',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  }
];

// Demo categories
export const demoCategories: Category[] = [
  {
    _id: 'demo-cat-1',
    name: "Men's Clothing",
    description: 'Stylish clothing for men',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'demo-cat-2',
    name: "Women's Clothing",
    description: 'Fashion-forward clothing for women',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'demo-cat-3',
    name: "Kids' Clothing",
    description: 'Fun and comfortable clothing for children',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'demo-cat-4',
    name: 'Accessories',
    description: 'Complete your look with our accessories',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];