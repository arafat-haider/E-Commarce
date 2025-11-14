'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, Heart, ShoppingCart, Minus, Plus, Share, Truck, Shield, RotateCcw } from 'lucide-react';
import api from '@/lib/axios';
import { Product, ApiResponse } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const { addItem, isLoading: cartLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
      setProduct(response.data.data || null);
    } catch {
      console.warn('API not available, using demo product');
      // Fallback to demo products
      const { demoProducts } = await import('@/data/demoProducts');
      const demoProduct = demoProducts.find(p => p._id === id);
      if (demoProduct) {
        setProduct(demoProduct);
      } else {
        toast.error('Product not found');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      // Set default selections
      if (!selectedSize) {
        setSelectedSize(product.variants[0].size);
      }
      if (!selectedColor) {
        setSelectedColor(product.variants[0].color);
      }
    }
  }, [product, selectedSize, selectedColor]);

  const getAvailableColors = () => {
    if (!product) return [];
    return [...new Set(product.variants.map(v => v.color))];
  };

  const getAvailableSizes = () => {
    if (!product) return [];
    return [...new Set(product.variants.map(v => v.size))];
  };

  const getCurrentVariant = () => {
    if (!product || !selectedSize || !selectedColor) return null;
    return product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
  };

  const getMaxQuantity = () => {
    const variant = getCurrentVariant();
    return variant ? Math.min(variant.stock, 10) : 0;
  };

  const handleAddToCart = async () => {
    if (!product || !selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addItem(product, { size: selectedSize, color: selectedColor }, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 aspect-square rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600">The product you are looking for does not exist.</p>
      </div>
    );
  }

  const currentVariant = getCurrentVariant();
  const availableColors = getAvailableColors();
  const availableSizes = getAvailableSizes();
  const maxQuantity = getMaxQuantity();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]?.url || '/placeholder-image.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.brand && (
              <p className="text-lg text-gray-600">{product.brand}</p>
            )}
            
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < product.averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {product.averageRating.toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                  {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size: {selectedSize}
              </label>
              <div className="flex gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      selectedSize === size
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color: {selectedColor}
              </label>
              <div className="flex gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      selectedColor === color
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div>
            {currentVariant ? (
              <p className={`text-sm ${currentVariant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentVariant.stock > 0 ? (
                  currentVariant.stock > 10 ? 'In Stock' : `Only ${currentVariant.stock} left`
                ) : (
                  'Out of Stock'
                )}
              </p>
            ) : (
              <p className="text-sm text-gray-500">Select size and color to check availability</p>
            )}
          </div>

          {/* Quantity Selector */}
          {maxQuantity > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-md min-w-16 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={quantity >= maxQuantity}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!currentVariant || currentVariant.stock === 0 || cartLoading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartLoading ? 'Adding...' : 'Add to Cart'}
            </button>
            
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-3 border rounded-lg ${
                isWishlisted 
                  ? 'bg-red-50 border-red-300 text-red-600' 
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart className="h-5 w-5" />
            </button>

            <button className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              <Share className="h-5 w-5" />
            </button>
          </div>

          {/* Features */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Truck className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600">Easy Returns</span>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-600">{product.description}</p>
              {product.features && product.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Features</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-600">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-900 capitalize w-1/3">{key}:</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="text-center py-8">
                <p className="text-gray-500">Reviews feature coming soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}