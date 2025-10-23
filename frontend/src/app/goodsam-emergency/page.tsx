'use client'

import Link from 'next/link'
import { Heart, AlertCircle, Home, Headphones } from 'lucide-react'

export default function GoodSamEmergency() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Navigation Bar */}
      <nav className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-red-500 hover:text-red-400 transition">
            <Home className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="text-gray-300 font-semibold">💬 Use Bibiana widget (bottom right) to chat or call</div>
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-white">
        <Heart className="w-16 h-16 mx-auto mb-6 text-red-500" fill="currentColor" />
        <h1 className="text-5xl font-bold mb-4">GoodSam Network</h1>
        <p className="text-xl text-gray-300 mb-8">
          24/7 emergency response powered by faith and compassion
        </p>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
          When crisis strikes, one click connects you with real helpers — pastors, nurses, volunteers, and BGF staff — who embody the spirit of the Good Samaritan.
        </p>
        
        {/* Unified 11Labs Widget Instruction */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 mb-12 max-w-2xl mx-auto">
          <p className="text-gray-300 mb-4 font-semibold">✿ Get Help Right Now:</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-200">
              <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
              <span>Look at the bottom-right corner of your screen</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200">
              <Headphones className="w-6 h-6 text-green-500" />
              <span>Click the Bibiana widget to chat or call</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <span>Tell Bibiana what you need - she'll connect you immediately</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">Available 24/7 • Free • Confidential • Multiple languages</p>
        </div>

        {/* Network Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <div className="text-3xl mb-3">🙏</div>
            <h3 className="font-bold text-lg mb-2">Faith Network</h3>
            <p className="text-gray-300 text-sm">Pastors, elders, and prayer warriors from Harare City Centre SDA</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <div className="text-3xl mb-3">⚕️</div>
            <h3 className="font-bold text-lg mb-2">Medical Network</h3>
            <p className="text-gray-300 text-sm">Nurses and doctors from Arundel Hospital ready for emergencies</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <div className="text-3xl mb-3">❤️</div>
            <h3 className="font-bold text-lg mb-2">Humanitarian Network</h3>
            <p className="text-gray-300 text-sm">BGF social officers and community volunteers for immediate aid</p>
          </div>
        </div>
      </div>
    </div>
  )
}
