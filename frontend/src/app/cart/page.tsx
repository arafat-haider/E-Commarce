'use client';

import { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { 
    items, 
    isLoading, 
    updateItem, 
    removeItem, 
    clearCart 
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && mounted) {
      router.push('/auth/login?redirect=cart');
    }
  }, [isAuthenticated, mounted, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const handleUpdateQuantity = async (productId: string, variant: { size: string; color: string }, newQuantity: number) => {
    const item = items.find(i => 
      i.product._id === productId && 
      i.variant.size === variant.size && 
      i.variant.color === variant.color
    );
    if (item) {
      await updateItem(item.product, variant, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, variant: { size: string; color: string }) => {
    removeItem(productId, variant.size, variant.color);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-gray-600 mb-6">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart ({totalQuantity} items)</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {items.map((item) => (
                <div key={`${item.product._id}-${item.variant.size}-${item.variant.color}`} className="p-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={item.product.images[0]?.url || '/placeholder-image.jpg'}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        <Link href={`/products/${item.product._id}`} className="hover:text-blue-600">
                          {item.product.name}
                        </Link>
                      </h3>
                      {item.product.brand && (
                        <p className="text-sm text-gray-500">{item.product.brand}</p>
                      )}
                      <div className="mt-1 text-sm text-gray-500">
                        <span>Size: {item.variant.size}</span>
                        <span className="mx-2">•</span>
                        <span>Color: {item.variant.color}</span>
                      </div>
                      <p className="mt-1 font-medium text-gray-900">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.variant, Math.max(1, item.quantity - 1))}
                        disabled={isLoading || item.quantity <= 1}
                        className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.variant, item.quantity + 1)}
                        disabled={isLoading}
                        className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.product._id, item.variant)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalQuantity} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                {shipping > 0 && (
                  <div className="text-xs text-gray-500">
                    Free shipping on orders over $50
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-base font-medium text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              {/* Security Features */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    Secure checkout
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    SSL encrypted
                  </div>
                </div>
              </div>
            </div>

            {/* Recently Viewed or Recommended */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended for you</h3>
              <div className="text-sm text-gray-500 text-center py-4">
                Product recommendations coming soon!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}