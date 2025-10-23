'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  User, 
  Shield, 
  FileText, 
  BarChart3, 
  Settings,
  Heart,
  Menu,
  X,
  Globe,
  ChevronDown
} from 'lucide-react';
import LanguageSelector from '@/components/common/LanguageSelector';

interface MainNavProps {
  currentPath?: string;
}

const MainNav: React.FC<MainNavProps> = ({ currentPath = '/' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<'applicant' | 'admin'>('applicant');

  const navigation = [
    { name: 'Home', href: '/', icon: Home, public: true },
    { name: 'Login Demo', href: '/auth/login', icon: User, public: true },
    { name: 'Simple Login', href: '/simple-login', icon: User, public: true },
    { name: 'Test Login', href: '/test-login', icon: Settings, public: true },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, protected: true },
    { name: 'Simple Dashboard', href: '/simple-dashboard', icon: BarChart3, public: true },
    { name: 'Reports & Analytics', href: '/reports', icon: FileText, protected: true },
    { name: 'Admin Panel', href: '/admin', icon: Shield, admin: true },
  ];

  const loginAsRole = (role: 'applicant' | 'admin') => {
    const mockUser = {
      id: role === 'admin' ? '1' : '2',
      email: role === 'admin' ? 'admin@bgf.com' : 'user@example.com',
      first_name: role === 'admin' ? 'Admin' : 'Demo',
      last_name: 'User',
      role: role,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const token = 'demo-token-' + Date.now();
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserRole('applicant');
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">BGF Aid System</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPath === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Right side controls */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Selector */}
              <LanguageSelector compact />
              
              {/* Quick Login */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => loginAsRole('applicant')}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                >
                  Login User
                </button>
                <button
                  onClick={() => loginAsRole('admin')}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                >
                  Login Admin
                </button>
                <button
                  onClick={logout}
                  className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-blue-600 p-2"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentPath === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile Quick Login */}
              <div className="px-3 py-2 space-y-2">
                <div className="text-sm font-medium text-gray-700">Quick Access:</div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      loginAsRole('applicant');
                      setIsOpen(false);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 flex-1"
                  >
                    User
                  </button>
                  <button
                    onClick={() => {
                      loginAsRole('admin');
                      setIsOpen(false);
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 flex-1"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Feature Links Bar */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-3 space-x-6">
            <Link href="/" className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
              <Home className="h-4 w-4" />
              <span>System Overview</span>
            </Link>
            <Link href="/goodsam" className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 whitespace-nowrap font-semibold">
              <Heart className="h-4 w-4" fill="currentColor" />
              <span>GoodSam Network</span>
            </Link>
            <Link href="/auth/login" className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
              <User className="h-4 w-4" />
              <span>Authentication</span>
            </Link>
            <Link href="/dashboard" className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboards</span>
            </Link>
            <Link href="/reports" className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
              <FileText className="h-4 w-4" />
              <span>M&E Reports</span>
            </Link>
            <button 
              onClick={() => loginAsRole('admin')}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap"
            >
              <Shield className="h-4 w-4" />
              <span>Admin Panel</span>
            </button>
            <div className="flex items-center space-x-1 text-sm text-gray-600 whitespace-nowrap">
              <Globe className="h-4 w-4" />
              <span>Multi-Language</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainNav;