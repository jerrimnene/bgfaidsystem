'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import EnhancedBGFApplicationForm from '@/components/applications/EnhancedBGFApplicationForm';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const EditApplicationPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState<any>(null);

  useEffect(() => {
    loadApplicationData();
  }, [applicationId]);

  const loadApplicationData = async () => {
    try {
      // In a real app, fetch application data from API
      // For demo, simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock application data
      const mockData = {
        applicationType: 'medical_aid',
        personalInfo: {
          firstName: 'John',
          lastName: 'Mukamuri',
          email: 'john.mukamuri@example.com',
          phone: '+263 77 123 4567',
          nationalId: '12-345678-Z-90',
          dateOfBirth: '1985-05-15',
          address: '123 Main Street, Harare',
        },
        applicationDetails: {
          title: 'Medical Treatment for Heart Condition',
          description: 'I am seeking financial assistance for heart surgery that is urgently needed.',
          amountRequested: 15000,
          urgencyLevel: 'high',
          category: 'medical',
        }
      };
      
      setApplicationData(mockData);
    } catch (error) {
      console.error('Failed to load application:', error);
      toast.error('Failed to load application data');
      router.push('/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = (formData: any, files: File[]) => {
    console.log('Application updated:', formData, files);
    
    toast.success('Application updated successfully!');
    
    // Navigate back to applications list
    setTimeout(() => {
      router.push('/applications');
    }, 2000);
  };

  const handleApplicationCancel = () => {
    router.push('/applications');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="py-6">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading application data...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6 px-6">
          <button
            onClick={handleApplicationCancel}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Applications
          </button>
        </div>
        
        <EnhancedBGFApplicationForm
          initialData={applicationData}
          isEditing={true}
          onSubmit={handleApplicationSubmit}
          onCancel={handleApplicationCancel}
        />
      </div>
    </MainLayout>
  );
};

export default EditApplicationPage;