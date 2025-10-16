'use client';

import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award,
  Heart,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function EducationSupportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-4">
              <img 
                src="/bgf-logo.png" 
                alt="Bridging Gaps Foundation" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bridging Gaps Foundation</h1>
                <p className="text-sm text-gray-600">Education Support Program</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/staff" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Staff Portal
              </Link>
              <Link 
                href="/apply" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Apply Now
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium mb-6">
              <GraduationCap className="h-4 w-4 mr-2" />
              Transforming Lives Through Education
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Education Support
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Scholarship Program
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Empowering promising students with high school scholarships, educational resources, 
              and mentorship opportunities to unlock their full potential.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/apply" 
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-orange-500/25"
              >
                <span>Apply for Scholarship</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="#eligibility" 
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 font-bold rounded-lg transition-all duration-300"
              >
                <span>Check Eligibility</span>
                <CheckCircle className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support to help students succeed in their educational journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Full Scholarships */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Full Scholarships</h3>
              <p className="text-gray-600 mb-4">
                Complete coverage of high school tuition, fees, and related educational expenses.
              </p>
              <div className="text-blue-600 font-semibold text-sm">
                Tuition • Fees • Uniforms • Books
              </div>
            </div>
            
            {/* Learning Resources */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Learning Resources</h3>
              <p className="text-gray-600 mb-4">
                Access to textbooks, digital resources, and supplementary learning materials.
              </p>
              <div className="text-green-600 font-semibold text-sm">
                Textbooks • Digital Access • Study Materials
              </div>
            </div>
            
            {/* Mentorship */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mentorship Program</h3>
              <p className="text-gray-600 mb-4">
                Guidance from experienced mentors and career counseling support.
              </p>
              <div className="text-purple-600 font-semibold text-sm">
                Academic Support • Career Guidance • Life Skills
              </div>
            </div>
            
            {/* Achievement Support */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence Awards</h3>
              <p className="text-gray-600 mb-4">
                Recognition and additional support for outstanding academic performance.
              </p>
              <div className="text-orange-600 font-semibold text-sm">
                Merit Awards • Extra Support • Recognition
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Requirements */}
      <section id="eligibility" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Eligibility Requirements
            </h2>
            <p className="text-xl text-gray-600">
              Who can apply for our education support program
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-4">Academic Requirements</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-blue-800">Completed primary education (Grade 7)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-blue-800">Demonstrated academic potential</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-blue-800">Commitment to completing high school</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-blue-800">Good character references</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-4">Financial Requirements</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-blue-800">Financial need demonstration</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-blue-800">Family income verification</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-blue-800">Unable to afford school fees</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-blue-800">Priority for disadvantaged communities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Celebrating our scholarship recipients' achievements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Grace Moyo",
                achievement: "Top 1% National Results",
                quote: "BGF gave me the opportunity to pursue my dreams. Now I'm studying medicine at university.",
                year: "Class of 2023"
              },
              {
                name: "John Mukamuri", 
                achievement: "Engineering Scholarship Winner",
                quote: "The mentorship program helped me discover my passion for technology and innovation.",
                year: "Class of 2022"
              },
              {
                name: "Tanya Zimunya",
                achievement: "Community Leadership Award",
                quote: "BGF taught me that education is the key to transforming not just my life, but my entire community.",
                year: "Class of 2023"
              }
            ].map((story, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {story.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">{story.name}</h4>
                    <p className="text-sm text-blue-600 font-semibold">{story.achievement}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">"{story.quote}"</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{story.year}</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our education support program and unlock opportunities for academic excellence and personal growth.
          </p>
          <Link 
            href="/apply" 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 inline-flex items-center justify-center space-x-3"
          >
            <GraduationCap className="h-6 w-6" />
            <span>Apply for Scholarship</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/bgf-logo.png" 
                  alt="Bridging Gaps Foundation" 
                  className="h-10 w-auto"
                />
                <div>
                  <h3 className="text-lg font-bold">Education Support</h3>
                  <p className="text-sm text-gray-400">Bridging Gaps Foundation</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Empowering students through education and creating pathways to success.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/apply" className="hover:text-white transition-colors">Apply Now</Link></li>
                <li><Link href="#eligibility" className="hover:text-white transition-colors">Eligibility</Link></li>
                <li><Link href="/staff" className="hover:text-white transition-colors">Staff Portal</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Harare, Zimbabwe</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>education@bgfzim.org</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <a href="https://www.bgfzim.org" target="_blank" className="hover:text-white transition-colors">
                    www.bgfzim.org
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 Bridging Gaps Foundation Education Support Program. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}