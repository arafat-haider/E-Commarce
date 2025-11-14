'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, Truck, ArrowRight, Download, Mail } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      images: Array<{ url: string }>;
      brand?: string;
    };
    quantity: number;
    price: number;
    variant: {
      size: string;
      color: string;
    };
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  estimatedDelivery: string;
}

export default function OrderSuccessPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && mounted) {
      router.push('/auth/login');
      return;
    }

    if (id && mounted) {
      fetchOrder();
    }
  }, [id, isAuthenticated, mounted, router]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch order details');
      router.push('/profile');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || loading || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">The order you are looking for does not exist.</p>
        <Link
          href="/profile"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          Go to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
            <p className="text-green-800 font-medium">
              Order Number: <span className="font-mono">{order.orderNumber}</span>
            </p>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Order Status</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600">Confirmed</span>
              <span className="text-xs text-gray-500 mt-1">Just now</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-400">Processing</span>
              <span className="text-xs text-gray-500 mt-1">1-2 days</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <Truck className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-400">Shipped</span>
              <span className="text-xs text-gray-500 mt-1">
                Est. {order?.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : '7-10 business days'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Order Items</h2>
            
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <img
                    src={item.product.images[0]?.url || '/placeholder-image.jpg'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    {item.product.brand && (
                      <p className="text-sm text-gray-500">{item.product.brand}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {item.variant.size} • {item.variant.color} • Qty: {item.quantity}
                    </p>
                  </div>
                  
                  <p className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${order.tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-medium text-gray-900">Total</span>
                  <span className="text-lg font-medium text-gray-900">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
              <div className="text-sm text-gray-600">
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
              <p className="text-sm text-gray-600 capitalize">{order.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
              <Download className="h-5 w-5 mr-2" />
              Download Receipt
            </button>
            
            <button className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
              <Mail className="h-5 w-5 mr-2" />
              Email Receipt
            </button>
            
            <Link
              href="/profile"
              className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              View Order History
            </Link>
            
            <Link
              href="/products"
              className="flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800"
            >
              Continue Shopping
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Questions about your order? Contact our customer service team.
          </p>
          <p className="text-sm text-blue-600">
            <a href="mailto:support@example.com" className="hover:underline">
              support@example.com
            </a>
            {' | '}
            <a href="tel:+1234567890" className="hover:underline">
              (123) 456-7890
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}