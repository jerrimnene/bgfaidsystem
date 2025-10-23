'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Bell, CheckCircle, Clock, AlertCircle, User, Phone, MapPin, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  title: string
  message: string
  help_request_id: string
  is_read: boolean
  created_at: string
  notification_type: string
}

export default function ResponderDashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeCase, setActiveCase] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [caseUpdates, setCaseUpdates] = useState<any[]>([])
  const [updateMessage, setUpdateMessage] = useState('')
  const [updateType, setUpdateType] = useState('initial_contact')

  useEffect(() => {
    fetchNotifications()
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/goodsam/notifications`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      if (response.data.success) {
        setNotifications(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const fetchCaseUpdates = async (helpRequestId: string, caseId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/goodsam/cases/${caseId}/updates`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      if (response.data.success) {
        setCaseUpdates(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching case updates:', error)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/goodsam/notifications/${notification.id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )

      // Set active case
      setActiveCase({
        id: notification.help_request_id,
        title: notification.message,
        notification
      })

      // Fetch help request details
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/goodsam/help-requests/${notification.help_request_id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )

      if (response.data.success) {
        setActiveCase((prev: any) => ({
          ...prev,
          ...response.data.data
        }))
        await fetchCaseUpdates(notification.help_request_id, response.data.data.case_id)
      }

      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      )
    } catch (error) {
      console.error('Error handling notification:', error)
    }
  }

  const handleAcknowledgeCase = async () => {
    if (!activeCase?.case_id) return

    setLoading(true)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/goodsam/cases/${activeCase.case_id}/acknowledge`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )

      if (response.data.success) {
        toast.success('Case acknowledged! You are now assigned.')
        setActiveCase((prev: any) => ({
          ...prev,
          case_status: 'acknowledged'
        }))
        await fetchCaseUpdates(activeCase.id, activeCase.case_id)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to acknowledge case')
    } finally {
      setLoading(false)
    }
  }

  const handleAddUpdate = async () => {
    if (!updateMessage.trim() || !activeCase?.case_id) return

    setLoading(true)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/goodsam/cases/${activeCase.case_id}/updates`,
        {
          update_type: updateType,
          message: updateMessage
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )

      if (response.data.success) {
        toast.success('Update added successfully')
        setUpdateMessage('')
        await fetchCaseUpdates(activeCase.id, activeCase.case_id)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add update')
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GoodSam Responder Dashboard</h1>
          <p className="text-gray-600 mt-2">Help those in need in your community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-blue-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Help Requests {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                        {unreadCount}
                      </span>
                    )}
                  </h2>
                </div>
              </div>

              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>No new help requests at this time.</p>
                    <p className="text-sm mt-2">You'll be notified when someone needs help.</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                        !notification.is_read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`w-2 h-2 rounded-full mr-3 mt-1 flex-shrink-0 ${
                          !notification.is_read ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Case Details Panel */}
          <div className="lg:col-span-2">
            {activeCase ? (
              <div className="bg-white rounded-lg shadow">
                {/* Case Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{activeCase.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      activeCase.case_status === 'acknowledged'
                        ? 'bg-green-100 text-green-800'
                        : activeCase.case_status === 'assigned'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activeCase.case_status}
                    </span>
                  </div>
                </div>

                {/* Case Details */}
                <div className="px-6 py-4 space-y-4">
                  {/* Request Info */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Help Type</h3>
                    <p className="text-gray-600">{activeCase.help_type}</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Urgency Level</h3>
                    <p className={`font-medium ${
                      activeCase.urgency_level === 'critical' ? 'text-red-600' :
                      activeCase.urgency_level === 'high' ? 'text-orange-600' :
                      'text-gray-600'
                    }`}>
                      {activeCase.urgency_level}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Description</h3>
                    <p className="text-gray-600">{activeCase.description}</p>
                  </div>

                  {activeCase.location_description && (
                    <div className="space-y-3 flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Location</h3>
                        <p className="text-gray-600">{activeCase.location_description}</p>
                      </div>
                    </div>
                  )}

                  {activeCase.contact_phone && (
                    <div className="space-y-3 flex items-start">
                      <Phone className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Contact</h3>
                        <p className="text-gray-600">{activeCase.contact_phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {activeCase.case_status === 'unassigned' && (
                    <button
                      onClick={handleAcknowledgeCase}
                      disabled={loading}
                      className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Acknowledging...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          I Will Help
                        </>
                      )}
                    </button>
                  )}

                  {/* Case Updates */}
                  {activeCase.case_status !== 'unassigned' && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Updates & Actions</h3>

                      {/* Add Update Form */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <select
                          value={updateType}
                          onChange={(e) => setUpdateType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm"
                        >
                          <option value="initial_contact">Initial Contact</option>
                          <option value="phone_call">Phone Call</option>
                          <option value="visit">In-Person Visit</option>
                          <option value="prayer_session">Prayer Session</option>
                          <option value="counseling">Counseling</option>
                          <option value="aid_provided">Aid Provided</option>
                          <option value="referral">Referral</option>
                          <option value="completion">Completion</option>
                        </select>

                        <textarea
                          value={updateMessage}
                          onChange={(e) => setUpdateMessage(e.target.value)}
                          placeholder="Add a note about your interaction..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />

                        <button
                          onClick={handleAddUpdate}
                          disabled={loading || !updateMessage.trim()}
                          className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Add Update'}
                        </button>
                      </div>

                      {/* Updates History */}
                      <div className="space-y-3">
                        {caseUpdates.map(update => (
                          <div key={update.id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-start">
                              <Clock className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {update.update_type}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">{update.message}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(update.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No case selected</h3>
                <p className="text-gray-600 mt-2">Click on a notification to view and respond to a help request</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
