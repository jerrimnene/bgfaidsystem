'use client'

import { useState } from 'react'

export default function SmallGrantsForm() {
  const [formData, setFormData] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    project_title: '',
    description: '',
    amount_requested: ''
  })
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const res = await fetch('http://localhost:3001/api/v1/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        setSuccessMessage(
          `✅ Application submitted successfully! Your tracker number is ${data.tracker_number}. Please save it for follow-up.`
        )
        setFormData({
          applicant_name: '',
          email: '',
          phone: '',
          project_title: '',
          description: '',
          amount_requested: ''
        })
      } else {
        setErrorMessage('⚠️ Submission failed. Please try again.')
      }
    } catch (error) {
      setErrorMessage('⚠️ Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        🌍 BGF Small Grants Application
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="applicant_name"
          placeholder="Full Name"
          value={formData.applicant_name}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="project_title"
          placeholder="Project Title"
          value={formData.project_title}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          rows={4}
          required
        ></textarea>
        <input
          type="number"
          name="amount_requested"
          placeholder="Amount Requested (USD)"
          value={formData.amount_requested}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      {successMessage && (
        <p className="mt-4 text-green-700 font-medium text-center">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="mt-4 text-red-600 font-medium text-center">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
