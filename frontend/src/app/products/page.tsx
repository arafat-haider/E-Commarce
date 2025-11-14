'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Grid, List, Filter, Search, ChevronDown, Star, Heart } from 'lucide-react';
import api from '@/lib/axios';
import { Product, Category, ApiResponse } from '@/types';
import Image from 'next/image';
import ProductSkeleton from '@/components/ProductSkeleton';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
  });

  const searchParams = useSearchParams();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minRating) params.append('minRating', filters.minRating);
      params.append('sortBy', sortBy);
      params.append('order', sortOrder);

      const response = await api.get<ApiResponse<Product[]>>(`/products?${params.toString()}`);
      setProducts(response.data.data || []);
    } catch {
      console.warn('API not available, using demo data');
      // Lazy load demo products only when needed
      const { demoProducts } = await import('@/data/demoProducts');
      let filtered = [...demoProducts];
      
      // Apply filters to demo data
      if (filters.search) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.brand?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      if (filters.category) {
        filtered = filtered.filter(p => p.category === filters.category);
      }
      
      if (filters.minPrice) {
        filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
      }
      
      if (filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
      }
      
      if (filters.minRating) {
        filtered = filtered.filter(p => p.averageRating >= parseFloat(filters.minRating));
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'rating':
            comparison = a.averageRating - b.averageRating;
            break;
          case 'name':
          default:
            comparison = a.name.localeCompare(b.name);
            break;
        }
        return sortOrder === 'desc' ? -comparison : comparison;
      });
      
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<Category[]>>('/categories');
      setCategories(response.data.data || []);
    } catch {
      console.warn('API not available, using demo categories');
      const { demoCategories } = await import('@/data/demoProducts');
      setCategories(demoCategories);
    }
  }, []);

  // Initial load effect - only runs once
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // URL params effect - sets initial filters from URL
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilters(prev => ({ ...prev, category }));
    }
  }, [searchParams]);

  // Products fetch effect - runs when filters/sort change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchProducts();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
    });
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
        viewMode === 'list' ? 'flex' : ''
      }`}>
        <div className={`relative ${viewMode === 'list' ? 'w-48' : 'aspect-square'}`}>
          <Image
            src={product.images[0]?.url || '/placeholder-image.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-400'
            } hover:scale-110 transition-transform`}
          >
            <Heart className="h-4 w-4" />
          </button>
          {product.comparePrice && product.comparePrice > product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
            </div>
          )}
        </div>
        
        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              <Link href={`/products/${product._id}`} className="hover:text-blue-600">
                {product.name}
              </Link>
            </h3>
            {product.brand && (
              <p className="text-sm text-gray-500">{product.brand}</p>
            )}
          </div>

          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < product.averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-1">
              ({product.numReviews})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {product.totalStock > 0 ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>

          {viewMode === 'list' && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
        
        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-blue-500"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="averageRating-desc">Highest Rated</option>
                <option value="createdAt-desc">Newest</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 bg-white border border-gray-300 rounded-lg p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="$0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="$1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={applyFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className={`${
          viewMode === 'grid'
            ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }`}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}

      {/* Pagination could be added here */}
    </div>
  );
}