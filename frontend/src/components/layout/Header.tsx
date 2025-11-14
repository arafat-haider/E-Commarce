'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { ShoppingCart, User, Menu, X, Search, Heart } from 'lucide-react';
import { useHydrated } from '../../hooks/useHydrated';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const hydrated = useHydrated();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            StyleStore
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              All Products
            </Link>
            <Link href="/products?category=demo-cat-1" className="text-gray-700 hover:text-blue-600 transition-colors">
              Men
            </Link>
            <Link href="/products?category=demo-cat-2" className="text-gray-700 hover:text-blue-600 transition-colors">
              Women
            </Link>
            <Link href="/products?category=demo-cat-3" className="text-gray-700 hover:text-blue-600 transition-colors">
              Kids
            </Link>
            <Link href="/products?category=demo-cat-4" className="text-gray-700 hover:text-blue-600 transition-colors">
              Accessories
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Heart className="h-6 w-6" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User Menu - Only render after hydration to prevent hydration issues */}
            <div className="relative">
              {hydrated ? (
                isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Hi, {user?.firstName}</span>
                    <div className="relative group">
                      <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
                        <User className="h-6 w-6" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Profile
                        </Link>
                        <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Orders
                        </Link>
                        {user?.role === 'admin' && (
                          <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth/login" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
                      Sign In
                    </Link>
                    <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                      Sign Up
                    </Link>
                  </div>
                )
              ) : (
                // Loading state to prevent hydration mismatch
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
                  <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/products"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                href="/products?category=demo-cat-1"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Mens Collection
              </Link>
              <Link
                href="/products?category=demo-cat-2"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Womens Collection
              </Link>
              <Link
                href="/products?category=demo-cat-3"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kids Collection
              </Link>
              <Link
                href="/products?category=demo-cat-4"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accessories
              </Link>

              {/* Mobile Search */}
              <div className="pt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Mobile Auth Links - Only render after hydration */}
              {hydrated && (
                <div className="pt-4 border-t border-gray-200">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        className="block text-gray-700 hover:text-blue-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block text-gray-700 hover:text-blue-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="block text-gray-700 hover:text-blue-600 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block text-left text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        className="block text-gray-700 hover:text-blue-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}