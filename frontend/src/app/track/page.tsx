'use client'

import { useState } from 'react'

export default function TrackApplicationPage() {
  const [tracker, setTracker] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!tracker.trim()) return
    setLoading(true)
    setResult(null)
    setError('')

    try {
      const res = await fetch(`http://localhost:3001/api/v1/applications/${tracker.trim()}`)
      const data = await res.json()

      if (data.success && data.data) {
        setResult(data.data)
      } else {
        setError('Application Not Found. Please check your tracker number and try again.')
      }
    } catch (err) {
      setError('⚠️ Could not connect to the server. Please ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">🔍 Track Your Application</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={tracker}
          onChange={(e) => setTracker(e.target.value)}
          placeholder="Enter your tracker number (e.g., BGF-F3C4014F)"
          className="flex-grow border rounded-lg p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? 'Checking...' : 'Track'}
        </button>
      </form>

      {error && <p className="text-red-600 text-center font-medium">{error}</p>}

      {result && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-inner">
          <h2 className="text-lg font-semibold mb-2 text-green-700">✅ Application Found</h2>
          <p><strong>Tracker Number:</strong> {result.tracker_number}</p>
          <p><strong>Applicant Name:</strong> {result.applicant_name}</p>
          <p><strong>Email:</strong> {result.email}</p>
          <p><strong>Phone:</strong> {result.phone}</p>
          <p><strong>Project Title:</strong> {result.project_title}</p>
          <p><strong>Description:</strong> {result.description}</p>
          <p><strong>Amount Requested:</strong> ${result.amount_requested}</p>
          <p><strong>Submission Date:</strong> {new Date(result.submission_date).toLocaleString()}</p>
        </div>
      )}
    </div>
  )
}
