'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    user: { firstName: string; lastName: string; email: string };
    total: number;
    status: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    _id: string;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && mounted) {
      router.push('/auth/login?redirect=admin');
      return;
    }

    if (mounted && user && user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      router.push('/');
      return;
    }

    if (mounted && isAuthenticated && user?.role === 'admin') {
      fetchDashboardStats();
    }
  }, [isAuthenticated, mounted, user, router]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return null;
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'orders', name: 'Orders', icon: ShoppingCart },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.firstName}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm h-screen">
          <nav className="mt-6 px-4">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Products</p>
                          <p className="text-3xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                        </div>
                        <Package className="h-12 w-12 text-blue-600" />
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Orders</p>
                          <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                        </div>
                        <ShoppingCart className="h-12 w-12 text-green-600" />
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Users</p>
                          <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                        </div>
                        <Users className="h-12 w-12 text-purple-600" />
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                          <p className="text-3xl font-bold text-gray-900">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                        </div>
                        <BarChart3 className="h-12 w-12 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow-sm">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                      </div>
                      <div className="p-6">
                        {stats?.recentOrders?.length ? (
                          <div className="space-y-4">
                            {stats.recentOrders.map((order) => (
                              <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                                  <p className="text-sm text-gray-500">
                                    {order.user.firstName} {order.user.lastName}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                    order.status === 'completed' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">No recent orders</p>
                        )}
                      </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-lg shadow-sm">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
                      </div>
                      <div className="p-6">
                        {stats?.topProducts?.length ? (
                          <div className="space-y-4">
                            {stats.topProducts.map((product) => (
                              <div key={product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-900">{product.name}</p>
                                  <p className="text-sm text-gray-500">{product.totalSold} sold</p>
                                </div>
                                <p className="font-medium text-gray-900">${product.revenue.toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">No product data</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Other Tabs */}
          {activeTab !== 'dashboard' && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="max-w-sm mx-auto">
                {activeTab === 'products' && (
                  <div>
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Product Management</h3>
                    <p className="text-gray-500 mb-6">Manage your product catalog, inventory, and pricing.</p>
                    <button className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="h-5 w-5 mr-2" />
                      Add New Product
                    </button>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Order Management</h3>
                    <p className="text-gray-500 mb-6">View and manage customer orders, process refunds, and handle returns.</p>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div>
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
                    <p className="text-gray-500 mb-6">Manage customer accounts, view user activity, and handle support requests.</p>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div>
                    <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics & Reports</h3>
                    <p className="text-gray-500 mb-6">View detailed reports on sales, revenue, and customer behavior.</p>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
                    <p className="text-gray-500 mb-6">Configure store settings, payment methods, and shipping options.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}