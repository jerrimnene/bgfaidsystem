'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  MessageSquare,
  Clock,
  DollarSign,
  FileText,
  Users,
  Settings,
  Mail,
  Phone,
  Send
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'action_required';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'application' | 'workflow' | 'system' | 'disbursement' | 'me_tracking';
  sender?: string;
  applicationId?: string;
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  telegram: boolean;
  inApp: boolean;
  categories: {
    applications: boolean;
    workflow: boolean;
    disbursements: boolean;
    reports: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

interface NotificationSystemProps {
  userRole: string;
  userId: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ userRole, userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    sms: false,
    telegram: true,
    inApp: true,
    categories: {
      applications: true,
      workflow: true,
      disbursements: true,
      reports: false
    },
    frequency: 'immediate'
  });

  // Mock notifications based on user role
  const mockNotifications: Notification[] = [
    // Common notifications
    {
      id: '1',
      type: 'action_required',
      title: 'New Application Requires Review',
      message: 'Community Water Project by John Mukamuri needs your attention',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      actionUrl: '/workflow',
      priority: 'high',
      category: 'workflow',
      sender: 'System',
      applicationId: 'APP-001'
    },
    {
      id: '2',
      type: 'info',
      title: 'Application Status Update',
      message: 'High School Scholarship has been forwarded to Finance Director',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: 'medium',
      category: 'workflow',
      sender: 'Peter Chikwanha',
      applicationId: 'APP-002'
    },
    {
      id: '3',
      type: 'success',
      title: 'Funds Disbursed Successfully',
      message: '$15,000 transferred to John Mukamuri for Community Water Project',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'medium',
      category: 'disbursement',
      sender: 'Finance Department'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Document Missing',
      message: 'Medical certificate required for medical assistance application',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: 'medium',
      category: 'application',
      sender: 'Project Officer'
    },
    {
      id: '5',
      type: 'info',
      title: 'M&E Follow-up Due',
      message: 'Quarterly follow-up required for completed water project',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'low',
      category: 'me_tracking',
      sender: 'M&E Team'
    }
  ];

  useEffect(() => {
    // Filter notifications based on user role
    const filteredNotifications = mockNotifications.filter(notification => {
      switch (userRole) {
        case 'applicant':
          return notification.category === 'application' || 
                 notification.category === 'disbursement' ||
                 (notification.applicationId && notification.sender !== userId);
        
        case 'project_officer':
          return notification.category === 'workflow' || 
                 notification.category === 'application' ||
                 notification.category === 'me_tracking';
        
        case 'program_manager':
          return notification.category === 'workflow' || 
                 notification.category === 'system';
        
        case 'finance_director':
        case 'hospital_director':
          return notification.category === 'workflow' || 
                 notification.category === 'disbursement';
        
        case 'executive_director':
        case 'ceo':
        case 'founder':
          return true; // All notifications
        
        default:
          return notification.category === 'system';
      }
    });

    // Add pending applications notifications
    const pendingApplicationsNotifications = generatePendingNotifications();
    const combinedNotifications = [...pendingApplicationsNotifications, ...filteredNotifications];
    
    setNotifications(combinedNotifications);
  }, [userRole, userId]);

  // Generate notifications for pending applications based on user role
  const generatePendingNotifications = (): Notification[] => {
    // This would normally come from the mockDatabase or API
    const pendingCount = {
      project_officer: 3,
      program_manager: 2,
      finance_director: 1,
      hospital_director: 2,
      executive_director: 1,
      ceo: 1,
      founder: 1
    };

    const count = pendingCount[userRole as keyof typeof pendingCount] || 0;
    
    if (count > 0) {
      return [{
        id: `pending-${userRole}`,
        type: 'action_required',
        title: `${count} Application${count > 1 ? 's' : ''} Awaiting Your Review`,
        message: `You have ${count} pending application${count > 1 ? 's' : ''} that require${count === 1 ? 's' : ''} your approval or action.`,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/dashboard',
        priority: 'high',
        category: 'workflow',
        sender: 'System'
      }];
    }
    
    return [];
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'action_required':
        return <Bell className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const testNotification = () => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: 'info',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'low',
      category: 'system',
      sender: 'System Test'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">{unreadCount} unread</span>
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-l-4 cursor-pointer transition-colors ${
                    !notification.read ? getPriorityColor(notification.priority) : 'border-l-gray-200'
                  } hover:bg-gray-50`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      
                      <p className={`text-sm mt-1 ${
                        !notification.read ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleDateString()} at{' '}
                          {new Date(notification.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {notification.sender && (
                          <span className="text-xs text-blue-600">
                            from {notification.sender}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t bg-gray-50 flex justify-between">
            <button
              onClick={testNotification}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Test Notification
            </button>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              View All
            </button>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Delivery Methods */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Delivery Methods</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.email}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        email: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Email notifications</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.sms}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        sms: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">SMS notifications</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.telegram}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        telegram: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex items-center">
                      <Send className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Telegram notifications</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.categories.applications}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        categories: {
                          ...prev.categories,
                          applications: e.target.checked
                        }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex items-center">
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Application updates</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.categories.workflow}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        categories: {
                          ...prev.categories,
                          workflow: e.target.checked
                        }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Workflow changes</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.categories.disbursements}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        categories: {
                          ...prev.categories,
                          disbursements: e.target.checked
                        }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Fund disbursements</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Frequency */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Frequency</h4>
                <select
                  value={preferences.frequency}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    frequency: e.target.value as any
                  }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="immediate">Immediate</option>
                  <option value="hourly">Hourly digest</option>
                  <option value="daily">Daily digest</option>
                  <option value="weekly">Weekly digest</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save preferences here
                  setShowPreferences(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;