'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Activity, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface Stats {
  totalRequests: number
  pendingRequests: number
  activeCases: number
  completedCases: number
  verifiedResponders: number
  requestsByType: Array<{ help_type: string; count: string }>
  requestsByUrgency: Array<{ urgency_level: string; count: string }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    // Refresh every minute
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/goodsam/dashboard/stats`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GoodSam Network Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time monitoring of help requests and responders</p>
        </div>

        {/* Key Metrics */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {/* Total Requests */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Requests</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRequests}</p>
                  </div>
                  <Activity className="w-10 h-10 text-blue-500 opacity-20" />
                </div>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingRequests}</p>
                  </div>
                  <Clock className="w-10 h-10 text-yellow-500 opacity-20" />
                </div>
              </div>

              {/* Active Cases */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Cases</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.activeCases}</p>
                  </div>
                  <AlertTriangle className="w-10 h-10 text-blue-500 opacity-20" />
                </div>
              </div>

              {/* Completed */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedCases}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
                </div>
              </div>

              {/* Verified Responders */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Responders</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{stats.verifiedResponders}</p>
                  </div>
                  <Users className="w-10 h-10 text-purple-500 opacity-20" />
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Requests by Type */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Requests by Type</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.requestsByType}
                      dataKey="count"
                      nameKey="help_type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {stats.requestsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Requests by Urgency */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Requests by Urgency</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.requestsByUrgency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="urgency_level" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Overall Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Completion Rate */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Completion Rate</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRequests > 0 
                    ? Math.round((stats.completedCases / stats.totalRequests) * 100)
                    : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.completedCases} of {stats.totalRequests} cases completed
                </p>
              </div>

              {/* Average Resolution Time */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Active Responders</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.verifiedResponders}</p>
                <p className="text-xs text-gray-500 mt-2">Verified helpers standing by</p>
              </div>

              {/* Urgency Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Critical Requests</h3>
                <p className="text-2xl font-bold text-red-600">
                  {stats.requestsByUrgency.find(r => r.urgency_level === 'critical')?.count || 0}
                </p>
                <p className="text-xs text-gray-500 mt-2">Requires immediate attention</p>
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">GoodSam Network Overview</h3>
          <p className="text-blue-800">
            The GoodSam Network is a digital implementation of the Good Samaritan parable, connecting people in need with verified helpers (pastors, counselors, nurses, volunteers) in real-time. This dashboard monitors all help requests, active cases, and responder availability to ensure compassionate, coordinated response across the community.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-blue-800">
            <li>✓ 24/7 help request system integrated into BGF Aid Platform</li>
            <li>✓ Real-time notifications to verified responders</li>
            <li>✓ Case tracking with follow-up management</li>
            <li>✓ Integration with BGF Aid programs for ongoing support</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
