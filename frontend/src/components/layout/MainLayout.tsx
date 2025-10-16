'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Heart, 
  Home, 
  FileText, 
  Users, 
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { User } from '@/types';
import NotificationSystem from '@/components/notifications/NotificationSystem';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeUser();
  }, []);
  
  // Handle route changes
  useEffect(() => {
    const handleStart = () => setIsNavigating(true);
    const handleComplete = () => setIsNavigating(false);
    
    // Simulate route change events
    handleComplete();
    
    return () => {
      handleComplete();
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
    ];

    // Role-specific navigation
    switch (user.role) {
      case 'applicant':
        return [
          ...baseItems,
          { name: 'My Applications', href: '/applications', icon: FileText },
          { name: 'New Application', href: '/applications/new', icon: FileText },
        ];

      case 'project_officer':
        return [
          ...baseItems,
          { name: 'Review Applications', href: '/review', icon: FileText },
          { name: 'My Assignments', href: '/assignments', icon: Users },
        ];

      case 'program_manager':
        return [
          ...baseItems,
          { name: 'Assign Applications', href: '/assign', icon: Users },
          { name: 'Review Applications', href: '/review', icon: FileText },
          { name: 'Team Management', href: '/team', icon: Users },
        ];

      case 'finance_director':
        return [
          ...baseItems,
          { name: 'Approve Applications', href: '/approve', icon: FileText },
          { name: 'Financial Reports', href: '/reports', icon: BarChart3 },
        ];

      case 'hospital_director':
        return [
          ...baseItems,
          { name: 'Medical Review', href: '/approve', icon: FileText },
          { name: 'Medical Reports', href: '/reports', icon: BarChart3 },
        ];

      case 'executive_director':
      case 'ceo':
        return [
          ...baseItems,
          { name: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
          { name: 'System Management', href: '/admin', icon: Settings },
        ];

      case 'founder':
        return [
          ...baseItems,
          { name: 'Final Approval', href: '/founders', icon: FileText },
          { name: 'Impact Reports', href: '/reports', icon: BarChart3 },
          { name: 'System Overview', href: '/admin', icon: Settings },
        ];

      case 'finance_release':
        return [
          ...baseItems,
          { name: 'Fund Release', href: '/finance-release', icon: FileText },
          { name: 'Disbursement Reports', href: '/reports/disbursement', icon: BarChart3 },
        ];

      case 'hospital_acceptance':
        return [
          ...baseItems,
          { name: 'Hospital Acceptance', href: '/hospital-acceptance', icon: FileText },
          { name: 'Medical Reports', href: '/reports/medical', icon: BarChart3 },
        ];

      case 'admin':
        return [
          ...baseItems,
          { name: 'User Management', href: '/admin/users', icon: Users },
          { name: 'System Settings', href: '/admin/settings', icon: Settings },
          { name: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();
  
  // Show loading spinner during initial load
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner 
          size="xl" 
          variant="heart" 
          text="Loading Bridging Gaps Foundation..."
        />
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .nav-item {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-50 relative">
        {/* Navigation Loading Indicator */}
        {isNavigating && (
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-blue-200">
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600" style={{
              width: '30%',
              animation: 'slide 1.5s ease-in-out infinite'
            }} />
          </div>
        )}
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              <Link href="/" className="flex items-center space-x-3 ml-4 lg:ml-0 hover:opacity-75 transition-opacity">
                <img 
                  src="/bgf-logo.png" 
                  alt="Bridging Gaps Foundation" 
                  className="h-10 w-auto"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Bridging Gaps Foundation</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Aid Management System</p>
                </div>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user && <NotificationSystem userRole={user.role} userId={user.id} />}
              
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:shadow-none lg:border-r`}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <nav className="flex-1 px-4 py-4 space-y-2">
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      nav-item group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium 
                      transition-all duration-200 ease-in-out
                      hover:scale-[1.02] hover:shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-sm border border-blue-200'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100'
                      }
                    `}
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                      <span className="transition-all duration-200">{item.name}</span>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    )}
                    {!isActive && (
                      <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                © 2024 Bridging Gap Foundation
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 relative">
          {children}
        </main>
      </div>
    </div>
    </>
  );
};

export default MainLayout;
