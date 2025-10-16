'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { User } from '@/types';
import { mockDB } from '@/utils/mockDatabase';
import { Settings, Save, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface SystemSettings {
  organization: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  application: {
    maxGrantAmount: number;
    maxScholarshipAmount: number;
    requireDocumentVerification: boolean;
    allowMultipleApplications: boolean;
    applicationDeadline: string;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    telegramEnabled: boolean;
    notificationEmail: string;
    telegramBotToken: string;
  };
  security: {
    requireTwoFactor: boolean;
    strongPasswordRequired: boolean;
    sessionTimeoutMinutes: number;
    maxLoginAttempts: number;
  };
  workflow: {
    autoAssignReviewers: boolean;
    approvalThresholds: {
      smallGrants: number;
      scholarships: number;
      medicalAssistance: number;
    };
    escalationTimeHours: number;
  };
}

const AdminSettingsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SystemSettings>({
    organization: {
      name: 'Bridging Gap Foundation',
      email: 'info@bridginggap.org',
      phone: '+263 123 456 789',
      address: 'Harare, Zimbabwe'
    },
    application: {
      maxGrantAmount: 50000,
      maxScholarshipAmount: 100000,
      requireDocumentVerification: true,
      allowMultipleApplications: false,
      applicationDeadline: ''
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      telegramEnabled: true,
      notificationEmail: 'notifications@bridginggap.org',
      telegramBotToken: ''
    },
    security: {
      requireTwoFactor: true,
      strongPasswordRequired: true,
      sessionTimeoutMinutes: 60,
      maxLoginAttempts: 5
    },
    workflow: {
      autoAssignReviewers: true,
      approvalThresholds: {
        smallGrants: 10000,
        scholarships: 25000,
        medicalAssistance: 15000
      },
      escalationTimeHours: 48
    }
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      loadSettings();
    }
  }, []);

  const loadSettings = () => {
    const savedSettings = mockDB.getAllSettings();
    if (Object.keys(savedSettings).length > 0) {
      setSettings({ ...settings, ...savedSettings });
    }
  };

  const handleSettingChange = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleNestedSettingChange = (section: keyof SystemSettings, nestedKey: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedKey]: {
          ...(prev[section] as any)[nestedKey],
          [key]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setSaveStatus('saving');
    
    try {
      // Save each section to the mock database
      Object.entries(settings).forEach(([section, sectionData]) => {
        Object.entries(sectionData).forEach(([key, value]) => {
          mockDB.setSetting(`${section}.${key}`, value);
        });
      });
      
      setSaveStatus('saved');
      setHasChanges(false);
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      loadSettings();
      setHasChanges(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Settings className="h-8 w-8 text-gray-600" />
                  <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                </div>
                <p className="text-gray-600">
                  Configure system-wide settings and preferences
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {hasChanges && (
                  <span className="text-sm text-orange-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Unsaved changes
                  </span>
                )}
                <button
                  onClick={resetSettings}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={saveSettings}
                  disabled={!hasChanges || saveStatus === 'saving'}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    hasChanges
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {saveStatus === 'saving' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : saveStatus === 'saved' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>
                    {saveStatus === 'saving' ? 'Saving...' : 
                     saveStatus === 'saved' ? 'Saved!' : 'Save Settings'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Organization Settings */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={settings.organization.name}
                    onChange={(e) => handleSettingChange('organization', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={settings.organization.email}
                    onChange={(e) => handleSettingChange('organization', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={settings.organization.phone}
                    onChange={(e) => handleSettingChange('organization', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={settings.organization.address}
                    onChange={(e) => handleSettingChange('organization', 'address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Application Settings */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Grant Amount (USD)</label>
                  <input
                    type="number"
                    value={settings.application.maxGrantAmount}
                    onChange={(e) => handleSettingChange('application', 'maxGrantAmount', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Scholarship Amount (USD)</label>
                  <input
                    type="number"
                    value={settings.application.maxScholarshipAmount}
                    onChange={(e) => handleSettingChange('application', 'maxScholarshipAmount', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={settings.application.applicationDeadline}
                    onChange={(e) => handleSettingChange('application', 'applicationDeadline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.application.requireDocumentVerification}
                      onChange={(e) => handleSettingChange('application', 'requireDocumentVerification', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Require document verification</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.application.allowMultipleApplications}
                      onChange={(e) => handleSettingChange('application', 'allowMultipleApplications', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Allow multiple applications per user</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailEnabled}
                      onChange={(e) => handleSettingChange('notifications', 'emailEnabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsEnabled}
                      onChange={(e) => handleSettingChange('notifications', 'smsEnabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">SMS notifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications.telegramEnabled}
                      onChange={(e) => handleSettingChange('notifications', 'telegramEnabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Telegram notifications</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notification Email</label>
                  <input
                    type="email"
                    value={settings.notifications.notificationEmail}
                    onChange={(e) => handleSettingChange('notifications', 'notificationEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {settings.notifications.telegramEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telegram Bot Token</label>
                    <input
                      type="password"
                      value={settings.notifications.telegramBotToken}
                      onChange={(e) => handleSettingChange('notifications', 'telegramBotToken', e.target.value)}
                      placeholder="Enter bot token"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.security.requireTwoFactor}
                      onChange={(e) => handleSettingChange('security', 'requireTwoFactor', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Require two-factor authentication</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.security.strongPasswordRequired}
                      onChange={(e) => handleSettingChange('security', 'strongPasswordRequired', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Strong password requirements</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeoutMinutes}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeoutMinutes', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max login attempts</label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Workflow Settings */}
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      checked={settings.workflow.autoAssignReviewers}
                      onChange={(e) => handleSettingChange('workflow', 'autoAssignReviewers', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Auto-assign reviewers</span>
                  </label>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Escalation time (hours)</label>
                    <input
                      type="number"
                      value={settings.workflow.escalationTimeHours}
                      onChange={(e) => handleSettingChange('workflow', 'escalationTimeHours', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Approval Thresholds (USD)</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Small Grants</label>
                      <input
                        type="number"
                        value={settings.workflow.approvalThresholds.smallGrants}
                        onChange={(e) => handleNestedSettingChange('workflow', 'approvalThresholds', 'smallGrants', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Scholarships</label>
                      <input
                        type="number"
                        value={settings.workflow.approvalThresholds.scholarships}
                        onChange={(e) => handleNestedSettingChange('workflow', 'approvalThresholds', 'scholarships', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Medical Assistance</label>
                      <input
                        type="number"
                        value={settings.workflow.approvalThresholds.medicalAssistance}
                        onChange={(e) => handleNestedSettingChange('workflow', 'approvalThresholds', 'medicalAssistance', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminSettingsPage;