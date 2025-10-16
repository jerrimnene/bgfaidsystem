'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  GraduationCap, 
  Users, 
  Stethoscope, 
  ArrowRight,
  Globe,
  Target,
  Award,
  CheckCircle,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Menu,
  X
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header Navigation */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <img 
                src="/bgf-logo.png" 
                alt="Bridging Gaps Foundation" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bridging Gaps Foundation</h1>
                <p className="text-sm text-gray-600">Aid Management System</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About
              </Link>
              <Link href="#programs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Programs
              </Link>
              <Link href="#impact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Impact
              </Link>
              <Link href="/staff" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Staff Portal
              </Link>
              <Link href="/education-support" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Education Support
              </Link>
              <Link 
                href="/apply" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Apply for Aid
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Professional Hero Section with Background Images */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Professional Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-indigo-900/90"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("/images/school-feeding.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Professional Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium mb-6">
                <Heart className="h-4 w-4 mr-2 text-red-400" />
                Transforming Lives Since 2010
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Bridging Gaps,
                <span className="block bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  Building Futures
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                We empower communities through education, healthcare, and sustainable development, 
                creating lasting change across Zimbabwe and beyond.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/apply" 
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-red-500/25"
                >
                  <span>Start Your Application</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  href="#programs" 
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 font-bold rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <span>Learn More</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Quick Access</h3>
                <div className="space-y-4">
                  <Link href="/apply" className="flex items-center p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 group border border-white/20">
                    <div className="bg-blue-600 p-2 rounded-lg mr-4">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-blue-200">Apply for Aid</h4>
                      <p className="text-sm text-blue-200">Submit your application</p>
                    </div>
                  </Link>
                  
                  <Link href="/staff" className="flex items-center p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 group border border-white/20">
                    <div className="bg-gray-600 p-2 rounded-lg mr-4">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-blue-200">Staff Portal</h4>
                      <p className="text-sm text-blue-200">Staff login and dashboard</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support across education, healthcare, and community development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Education Program */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="relative h-48">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
                <div className="absolute inset-0" style={{
                  backgroundImage: 'url("/images/education-mission.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Education Support</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  High school scholarships and educational resources for promising students.
                </p>
                <div className="text-sm text-blue-600 font-semibold">
                  Scholarships • School Supplies • Mentorship
                </div>
              </div>
            </div>
            
            {/* Healthcare Program */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="relative h-48">
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent"></div>
                <div className="absolute inset-0" style={{
                  backgroundImage: 'url("/images/medical-clinic.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <Stethoscope className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Medical Assistance</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Free medical services through Arundel Hospital and partner facilities.
                </p>
                <div className="text-sm text-red-600 font-semibold">
                  Emergency Care • Surgery • Treatment • Medication
                </div>
              </div>
            </div>
            
            {/* Community Development */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="relative h-48">
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent"></div>
                <div className="absolute inset-0" style={{
                  backgroundImage: 'url("/images/communities-faith.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Community Projects</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Small grants for sustainable community development initiatives.
                </p>
                <div className="text-sm text-green-600 font-semibold">
                  Infrastructure • Agriculture • Training • Microfinance
                </div>
              </div>
            </div>
            
            {/* Agricultural Support */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="relative h-48">
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent"></div>
                <div className="absolute inset-0" style={{
                  backgroundImage: 'url("/images/agriculture-mechanisation.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg mr-3">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Agricultural Aid</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Mechanisation and modern farming techniques for food security.
                </p>
                <div className="text-sm text-orange-600 font-semibold">
                  Equipment • Seeds • Training • Irrigation
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section id="impact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Over a decade of transforming lives and building stronger communities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Students Educated</div>
                <div className="text-gray-600 text-sm">High school scholarships awarded</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-red-600 mb-2">1,200+</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Medical Treatments</div>
                <div className="text-gray-600 text-sm">Lives saved through medical aid</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-green-600 mb-2">150+</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Community Projects</div>
                <div className="text-gray-600 text-sm">Sustainable development initiatives</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Partner Churches</div>
                <div className="text-gray-600 text-sm">Faith-based community network</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our mission to bridge gaps and build brighter futures. Apply for aid or discover how you can contribute to our cause.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/apply" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg inline-flex items-center justify-center space-x-2"
            >
              <Heart className="h-5 w-5" />
              <span>Apply for Aid</span>
            </Link>
            <Link 
              href="https://www.bgfzim.org" 
              target="_blank"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <Globe className="h-5 w-5" />
              <span>Learn More</span>
            </Link>
          </div>
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
                  <h3 className="text-lg font-bold">BGF Aid System</h3>
                  <p className="text-sm text-gray-400">Bridging Gaps Foundation</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Transforming lives through education, healthcare, and sustainable community development.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/apply" className="hover:text-white transition-colors">Apply for Aid</Link></li>
                <li><Link href="/staff" className="hover:text-white transition-colors">Staff Portal</Link></li>
                <li><Link href="/education-support" className="hover:text-white transition-colors">Education Support</Link></li>
                <li><Link href="#programs" className="hover:text-white transition-colors">Programs</Link></li>
                <li><Link href="#impact" className="hover:text-white transition-colors">Impact</Link></li>
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
                  <span>info@bgfzim.org</span>
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
            <p>&copy; 2024 Bridging Gaps Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* ElevenLabs AI Chat Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <elevenlabs-convai agent-id="agent_1301k7nwqxb6et9v2f4cp1xzysq8"></elevenlabs-convai>
      </div>
      
      {/* AI Assistant Indicator */}
      <div className="fixed bottom-28 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse z-40">
        💬 Need Help? Ask Our AI Assistant!
      </div>
    </div>
  );
}
