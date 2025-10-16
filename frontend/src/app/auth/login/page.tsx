'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/common/LanguageSelector';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setLoading(true);

    try {
      // Validate input
      if (!formData.email || !formData.password) {
        toast.error('Please enter both email and password');
        setLoading(false);
        return;
      }

      // Demo user accounts with proper role mapping
      const demoAccounts = {
        // Applicant accounts
        'applicant@bgf.com': {
          id: '1',
          first_name: 'John',
          last_name: 'Mukamuri',
          role: 'applicant',
          email: 'applicant@bgf.com'
        },
        'user@example.com': {
          id: '2',
          first_name: 'Grace',
          last_name: 'Moyo',
          role: 'applicant',
          email: 'user@example.com'
        },
        
        // Staff accounts
        'project.officer@bgf.com': {
          id: '3',
          first_name: 'Bibiana',
          last_name: 'Matambo',
          role: 'project_officer',
          email: 'project.officer@bgf.com'
        },
        'program.manager@bgf.com': {
          id: '4',
          first_name: 'Patisiwe',
          last_name: 'Zaba',
          role: 'program_manager',
          email: 'program.manager@bgf.com'
        },
        'finance.director@bgf.com': {
          id: '5',
          first_name: 'Nsandula',
          last_name: 'Sinchuke',
          role: 'finance_director',
          email: 'finance.director@bgf.com'
        },
        'hospital.director@bgf.com': {
          id: '6',
          first_name: 'Dr.',
          last_name: 'Chimuka',
          role: 'hospital_director',
          email: 'hospital.director@bgf.com'
        },
        'executive.director@bgf.com': {
          id: '7',
          first_name: 'Prof. B.',
          last_name: 'Nyahuma',
          role: 'executive_director',
          email: 'executive.director@bgf.com'
        },
        'ceo@bgf.com': {
          id: '8',
          first_name: 'Mr M.',
          last_name: 'Chitambo',
          role: 'ceo',
          email: 'ceo@bgf.com'
        },
        'founder.male@bgf.com': {
          id: '9',
          first_name: 'Mr.',
          last_name: 'Tagwirei',
          role: 'founder',
          email: 'founder.male@bgf.com'
        },
        'founder.female@bgf.com': {
          id: '10',
          first_name: 'Mrs.',
          last_name: 'Tagwirei',
          role: 'founder',
          email: 'founder.female@bgf.com'
        },
        'finance.release@bgf.com': {
          id: '11',
          first_name: 'Finance',
          last_name: 'Release Officer',
          role: 'finance_release',
          email: 'finance.release@bgf.com'
        },
        'hospital.acceptance@bgf.com': {
          id: '12',
          first_name: 'Hospital',
          last_name: 'Acceptance Officer',
          role: 'hospital_acceptance',
          email: 'hospital.acceptance@bgf.com'
        },
        
        // Admin account
        'admin@bgf.com': {
          id: '13',
          first_name: 'System',
          last_name: 'Administrator',
          role: 'admin',
          email: 'admin@bgf.com'
        }
      };

      console.log('Looking up user account...');
      const userAccount = demoAccounts[formData.email.toLowerCase() as keyof typeof demoAccounts];
      
      if (!userAccount) {
        toast.error('Invalid email or password');
        setLoading(false);
        return;
      }

      console.log('Creating user session...');
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUser = {
        ...userAccount,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Saving to localStorage...', { mockToken, mockUser });
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Verify storage
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      console.log('Verification - Token saved:', !!savedToken);
      console.log('Verification - User saved:', !!savedUser);
      
      toast.success('Login successful!');
      
      // Add small delay to ensure localStorage is written
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        router.push('/dashboard');
      }, 100);
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/bgf-logo.png" 
              alt="Bridging Gaps Foundation" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold text-gray-900">BGF Aid System</h1>
          </div>
          <h2 className="text-xl text-gray-700">{t('auth.login')}</h2>
          <p className="text-gray-500 text-sm mt-2">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 max-h-64 overflow-y-auto">
          <h4 className="font-semibold text-blue-800 mb-2">Demo Login Accounts:</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <div className="font-medium">📋 Staff Accounts:</div>
            <div><strong>Project Officer:</strong> project.officer@bgf.com (Bibiana Matambo)</div>
            <div><strong>Programs Manager:</strong> program.manager@bgf.com (Patisiwe Zaba)</div>
            <div><strong>Finance Director:</strong> finance.director@bgf.com (Nsandula Sinchuke)</div>
            <div><strong>Hospital Director:</strong> hospital.director@bgf.com (Dr. Chimuka)</div>
            <div><strong>Executive Director:</strong> executive.director@bgf.com (Prof. B. Nyahuma)</div>
            <div><strong>CEO:</strong> ceo@bgf.com (Mr M. Chitambo)</div>
            <div><strong>Founder (Male):</strong> founder.male@bgf.com (Mr. Tagwirei)</div>
            <div><strong>Founder (Female):</strong> founder.female@bgf.com (Mrs. Tagwirei)</div>
            <div><strong>Finance Release:</strong> finance.release@bgf.com</div>
            <div><strong>Hospital Acceptance:</strong> hospital.acceptance@bgf.com</div>
            
            <div className="font-medium mt-2">👥 Other Accounts:</div>
            <div><strong>Admin:</strong> admin@bgf.com</div>
            <div><strong>Applicant:</strong> applicant@bgf.com</div>
            
            <div className="font-medium mt-2 text-green-700">🔑 Password for all: <strong>password123</strong></div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="form-label">
              {t('auth.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input pr-10"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                {t('auth.forgotPassword')}
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>{t('auth.login')}</span>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t('auth.noAccount')}{' '}
              <a href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                {t('auth.register')}
              </a>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400">
          <p>© 2024 BGF Aid System. All rights reserved.</p>
        </div>
      </div>
      
    </div>
  );
}
