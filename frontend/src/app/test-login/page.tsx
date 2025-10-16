'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function TestLoginPage() {
  const router = useRouter();

  const loginAsAdmin = () => {
    const mockToken = 'test-admin-token-' + Date.now();
    const mockUser = {
      id: '1',
      email: 'admin@bgf.com',
      first_name: 'Test',
      last_name: 'Admin',
      role: 'admin',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    toast.success('Logged in as Admin');
    router.push('/dashboard');
  };

  const loginAsUser = () => {
    const mockToken = 'test-user-token-' + Date.now();
    const mockUser = {
      id: '2',
      email: 'user@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'applicant',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    toast.success('Logged in as User');
    router.push('/dashboard');
  };

  const clearStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Storage cleared');
  };

  const checkStorage = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('Token:', token);
    console.log('User:', user);
    
    toast.success(`Token: ${!!token}, User: ${!!user}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Test Login</h1>
        
        <div className="space-y-4">
          <button
            onClick={loginAsAdmin}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Login as Admin
          </button>
          
          <button
            onClick={loginAsUser}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Login as User
          </button>
          
          <button
            onClick={clearStorage}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Clear Storage
          </button>
          
          <button
            onClick={checkStorage}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Check Storage
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Go to Login Page
          </a>
        </div>
      </div>
    </div>
  );
}