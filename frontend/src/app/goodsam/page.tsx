'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Heart, AlertCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function GoodSamHelpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    help_type: '',
    urgency_level: 'medium',
    title: '',
    description: '',
    location_description: '',
    contact_phone: '',
    preferred_contact_method: 'phone',
    is_anonymous: false
  })

  const helpTypes = [
    { value: 'prayer', label: '🙏 Prayer Support', icon: '🙏' },
    { value: 'counseling', label: '💬 Counseling/Emotional Support', icon: '💬' },
    { value: 'emergency_aid', label: '🆘 Emergency Assistance', icon: '🆘' },
    { value: 'medical_support', label: '⚕️ Medical Support', icon: '⚕️' },
    { value: 'food_aid', label: '🍲 Food Assistance', icon: '🍲' },
    { value: 'shelter_support', label: '🏠 Shelter Support', icon: '🏠' },
    { value: 'financial_help', label: '💰 Financial Help', icon: '💰' },
    { value: 'spiritual_guidance', label: '✨ Spiritual Guidance', icon: '✨' },
    { value: 'emotional_support', label: '❤️ Emotional Support', icon: '❤️' },
    { value: 'other', label: '📞 Other', icon: '📞' }
  ]

  const urgencyLevels = [
    { value: 'low', label: 'Low - Not urgent' },
    { value: 'medium', label: 'Medium - Within a few days' },
    { value: 'high', label: 'High - Soon as possible' },
    { value: 'critical', label: 'Critical - Right now' }
  ]

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.help_type || !formData.title || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/goodsam/help-request`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.data.success) {
        toast.success('Help request sent! The GoodSam Network has been alerted.')
        router.push(`/goodsam/status/${response.data.data.helpRequest.id}`)
      }
    } catch (error: any) {
      console.error('Error submitting help request:', error)
      toast.error(error.response?.data?.error || 'Failed to submit help request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Heart className="w-12 h-12 text-red-500" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Need Help Now?</h1>
          <p className="text-xl text-gray-600">
            The GoodSam Network connects you with real helpers in your community
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>GoodSam is 24/7 available.</strong> Whether you need spiritual support, counseling, emergency aid, or just someone to listen, we're here to help. Real pastors, counselors, nurses, and volunteers are standing by.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          {/* Help Type Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              What kind of help do you need? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {helpTypes.map(type => (
                <label
                  key={type.value}
                  className={`relative flex cursor-pointer rounded-lg border-2 p-3 transition ${
                    formData.help_type === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="help_type"
                    value={type.value}
                    checked={formData.help_type === type.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{type.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{type.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              How urgent is this? <span className="text-red-500">*</span>
            </label>
            <select
              name="urgency_level"
              value={formData.urgency_level}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {urgencyLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Brief title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Need prayer for family illness"
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tell us more (What you're going through) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Share your situation. The more details, the better we can help..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Where are you? (Optional)
            </label>
            <input
              type="text"
              name="location_description"
              value={formData.location_description}
              onChange={handleChange}
              placeholder="City, area, or landmark (helps us find nearby helpers)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Contact Method */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              How do you prefer to be contacted?
            </label>
            <select
              name="preferred_contact_method"
              value={formData.preferred_contact_method}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="phone">📞 Phone</option>
              <option value="email">📧 Email</option>
              <option value="whatsapp">💬 WhatsApp</option>
              <option value="in_person">👤 In-person</option>
            </select>
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Your contact number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              placeholder="+263 (your number)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_anonymous"
              checked={formData.is_anonymous}
              onChange={handleChange}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              Send this request anonymously (we won't share your name)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending Request...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 mr-2" fill="currentColor" />
                Send Help Request
              </>
            )}
          </button>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 text-center">
            Your information is safe. Only verified helpers will see your request. You can close this at any time.
          </p>
        </form>
      </div>
    </div>
  )
}
