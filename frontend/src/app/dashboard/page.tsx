'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { User, UserRole } from '@/types';
import RoleBasedDashboard from '@/components/dashboards/RoleBasedDashboard';
import MainLayout from '@/components/layout/MainLayout';
import { Loader2 } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Check for token in localStorage
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      
      if (token && userString) {
        // Parse user data from localStorage
        const userData = JSON.parse(userString);
        setUser(userData);
      } else {
        // Create demo user for immediate access
        const demoUser: User = {
          id: '1',
          email: 'demo@bgf.com',
          first_name: 'Demo',
          last_name: 'User',
          role: 'applicant',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const demoToken = 'demo-token-' + Date.now();
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        setUser(demoUser);
      }
    } catch (error) {
      console.error('Dashboard: Failed to load user data:', error);
      // Create fallback user
      const fallbackUser: User = {
        id: '1',
        email: 'demo@bgf.com',
        first_name: 'Demo',
        last_name: 'User',
        role: 'applicant',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUser(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApplication = () => {
    router.push('/applications/new');
  };

  const handleEditApplication = (id: string) => {
    router.push(`/applications/${id}/edit`);
  };

  const handleViewApplication = (id: string) => {
    router.push(`/applications/${id}`);
  };

  const renderDashboard = () => {
    if (!user) return null;
    return <RoleBasedDashboard user={user} />;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Setting up dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-red-600">Unable to load user data.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {renderDashboard()}
    </MainLayout>
  );
};

export default DashboardPage;