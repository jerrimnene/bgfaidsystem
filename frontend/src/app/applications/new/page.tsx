'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import EnhancedBGFApplicationForm from '@/components/applications/EnhancedBGFApplicationForm';
import { toast } from 'react-hot-toast';
import { mockDB } from '@/utils/mockDatabase';

const NewApplicationPage: React.FC = () => {
  const router = useRouter();

  const handleApplicationSubmit = (formData: any, files: File[]) => {
    console.log('New application submitted:', formData, files);
    
    try {
      // Submit application to centralized database
      const applicationId = mockDB.submitApplication(formData, files);
      
      toast.success(`Application ${applicationId} submitted successfully! It will now go through our review process.`);
      
      // Navigate to applications page to see the submitted application
      setTimeout(() => {
        router.push('/applications');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const handleApplicationCancel = () => {
    router.push('/dashboard');
  };

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6 px-6">
          <button
            onClick={handleApplicationCancel}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
        
        <EnhancedBGFApplicationForm
          onSubmit={handleApplicationSubmit}
          onCancel={handleApplicationCancel}
        />
      </div>
    </MainLayout>
  );
};

export default NewApplicationPage;