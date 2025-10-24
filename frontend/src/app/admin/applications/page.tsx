'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminApplications() {
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/v1/applications')
        setApps(res.data.data)
      } catch (err) {
        console.error('Error loading applications:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchApps()
  }, [])

  if (loading) return <div className="p-10 text-gray-600">Loading...</div>

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">📥 Received Applications</h1>
      {apps.length === 0 ? (
        <p className="text-gray-600">No applications yet.</p>
      ) : (
        <table className="min-w-full border border-gray-300 text-sm bg-white">
          <thead className="bg-blue-50 text-blue-800">
            <tr>
              <th className="border p-2">Tracker #</th>
              <th className="border p-2">Applicant</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Project Title</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a, i) => (
              <tr key={i} className="hover:bg-blue-50">
                <td className="border p-2 font-mono text-xs">{a.tracker_number}</td>
                <td className="border p-2">{a.applicant_name}</td>
                <td className="border p-2">{a.email}</td>
                <td className="border p-2">{a.project_title}</td>
                <td className="border p-2">${a.amount_requested}</td>
                <td className="border p-2">{new Date(a.submission_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
