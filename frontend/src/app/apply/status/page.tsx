'use client'

import { useState } from 'react'
import axios from 'axios'

export default function ApplicationStatusPage() {
  const [tracker, setTracker] = useState('')
  const [application, setApplication] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setApplication(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await axios.get(`${apiUrl}/api/v1/applications/tracker/${tracker.trim()}`)
      if (res.data.success) {
        setApplication(res.data.data)
      } else {
        setError(res.data.message || 'Application not found.')
      }
    } catch (err: any) {
      console.error(err)
      setError('⚠️ Application not found. Please check your tracker number.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Check Application Status</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter your tracker number (e.g. BGF-E334ED81)"
          className="border p-2 rounded w-80"
          value={tracker}
          onChange={(e) => setTracker(e.target.value)}
        />
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {loading ? 'Searching...' : 'Check'}
        </button>
      </form>

      {error && <p className="text-red-600 font-medium">{error}</p>}

      {application && (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-xl w-full">
          <h2 className="text-lg font-bold text-green-700 mb-2">✅ Application Found</h2>
          <p><strong>Name:</strong> {application.applicant_name}</p>
          <p><strong>Project:</strong> {application.project_title}</p>
          <p><strong>Amount:</strong> ${application.amount_requested}</p>
          <p><strong>Status:</strong> Pending Review</p>
          <p><strong>Submitted:</strong> {new Date(application.submission_date).toLocaleString()}</p>
        </div>
      )}
    </div>
  )
}
