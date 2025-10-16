'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  CheckCircle,
  Calendar,
  MapPin,
  Camera,
  FileText,
  BarChart3,
  Heart,
  Star,
  Award,
  DollarSign,
  Clock,
  MessageCircle
} from 'lucide-react';

interface ImpactMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  category: 'social' | 'economic' | 'educational' | 'health';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface SuccessStory {
  id: string;
  title: string;
  beneficiary: string;
  location: string;
  program: string;
  amount: number;
  dateCompleted: string;
  description: string;
  outcomes: string[];
  images: string[];
  testimonial: string;
  impactScore: number;
}

interface MEProject {
  id: string;
  applicationId: string;
  title: string;
  beneficiary: string;
  program: 'small_grants' | 'high_school_scholarship' | 'excellence_scholarship' | 'medical_assistance';
  amount: number;
  disbursementDate: string;
  status: 'active' | 'completed' | 'requires_followup';
  nextFollowUp: string;
  baselineMetrics: Record<string, any>;
  currentMetrics: Record<string, any>;
  milestones: Milestone[];
  reports: Report[];
}

interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  status: 'pending' | 'achieved' | 'delayed' | 'at_risk';
  description: string;
  evidenceRequired: boolean;
  evidenceSubmitted?: string[];
}

interface Report {
  id: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'impact_assessment';
  title: string;
  date: string;
  author: string;
  summary: string;
  attachments: string[];
}

interface METrackingProps {
  userRole: string;
}

const METracking: React.FC<METrackingProps> = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'stories' | 'reports'>('overview');
  const [selectedProject, setSelectedProject] = useState<MEProject | null>(null);

  // Mock data
  const impactMetrics: ImpactMetric[] = [
    {
      id: '1',
      name: 'Lives Directly Impacted',
      value: 156,
      target: 200,
      unit: 'people',
      category: 'social',
      trend: 'up',
      description: 'Individuals who directly benefited from BGF programs'
    },
    {
      id: '2',
      name: 'Educational Scholarships',
      value: 45,
      target: 60,
      unit: 'students',
      category: 'educational',
      trend: 'up',
      description: 'Students supported through scholarship programs'
    },
    {
      id: '3',
      name: 'Community Projects',
      value: 12,
      target: 15,
      unit: 'projects',
      category: 'social',
      trend: 'up',
      description: 'Community development projects completed'
    },
    {
      id: '4',
      name: 'Medical Interventions',
      value: 23,
      target: 30,
      unit: 'cases',
      category: 'health',
      trend: 'stable',
      description: 'Medical cases treated through Arundel Hospital'
    },
    {
      id: '5',
      name: 'Economic Impact',
      value: 89000,
      target: 100000,
      unit: 'USD',
      category: 'economic',
      trend: 'up',
      description: 'Total economic value created in communities'
    },
    {
      id: '6',
      name: 'Success Rate',
      value: 89,
      target: 85,
      unit: '%',
      category: 'social',
      trend: 'up',
      description: 'Percentage of programs meeting their objectives'
    }
  ];

  const successStories: SuccessStory[] = [
    {
      id: '1',
      title: 'Rural Water Pump Installation',
      beneficiary: 'Mukamuri Community',
      location: 'Chiredzi, Zimbabwe',
      program: 'Small Grants',
      amount: 15000,
      dateCompleted: '2024-01-20',
      description: 'Installation of solar-powered water pump serving 250 community members',
      outcomes: [
        'Reduced water collection time from 3 hours to 15 minutes',
        '250 people now have access to clean water',
        '40% reduction in water-borne illnesses',
        'Women can now engage in income-generating activities'
      ],
      images: ['water-pump-before.jpg', 'water-pump-after.jpg', 'community-celebration.jpg'],
      testimonial: "This water pump has transformed our lives. Our children now have time for school instead of walking long distances for water. Thank you BGF for believing in our community.",
      impactScore: 9.2
    },
    {
      id: '2',
      title: 'Tendai\'s University Journey',
      beneficiary: 'Tendai Moyo',
      location: 'Harare, Zimbabwe',
      program: 'Excellence Scholarship',
      amount: 25000,
      dateCompleted: '2024-01-15',
      description: 'Full university scholarship for Computer Science degree',
      outcomes: [
        'Graduated with First Class Honours',
        'Secured employment at tech startup',
        'Mentoring 5 other scholarship recipients',
        'Contributing to family income'
      ],
      images: ['graduation-ceremony.jpg', 'tendai-work.jpg'],
      testimonial: "BGF didn't just give me education, they gave me a future. I'm now able to support my family and give back to my community.",
      impactScore: 9.8
    }
  ];

  const meProjects: MEProject[] = [
    {
      id: '1',
      applicationId: 'APP-001',
      title: 'Community Water Project',
      beneficiary: 'John Mukamuri',
      program: 'small_grants',
      amount: 15000,
      disbursementDate: '2023-12-01',
      status: 'completed',
      nextFollowUp: '2024-06-01',
      baselineMetrics: {
        waterAccessHours: 3,
        beneficiaries: 250,
        waterborneIllnesses: 15
      },
      currentMetrics: {
        waterAccessHours: 0.25,
        beneficiaries: 250,
        waterborneIllnesses: 3
      },
      milestones: [
        {
          id: '1',
          title: 'Equipment Procurement',
          targetDate: '2023-12-15',
          status: 'achieved',
          description: 'Purchase and receive solar pump equipment',
          evidenceRequired: true,
          evidenceSubmitted: ['invoice.pdf', 'delivery-receipt.pdf']
        },
        {
          id: '2',
          title: 'Installation Complete',
          targetDate: '2024-01-15',
          status: 'achieved',
          description: 'Install and test water pump system',
          evidenceRequired: true,
          evidenceSubmitted: ['installation-photos.zip', 'test-results.pdf']
        },
        {
          id: '3',
          title: 'Community Training',
          targetDate: '2024-01-20',
          status: 'achieved',
          description: 'Train community on maintenance and operation',
          evidenceRequired: true,
          evidenceSubmitted: ['training-certificate.pdf', 'attendance-list.pdf']
        }
      ],
      reports: [
        {
          id: '1',
          type: 'monthly',
          title: 'December 2023 Progress Report',
          date: '2024-01-05',
          author: 'Peter Chikwanha',
          summary: 'Equipment procured and site preparation completed',
          attachments: ['dec-2023-report.pdf']
        }
      ]
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'social': return 'text-blue-600 bg-blue-100';
      case 'economic': return 'text-green-600 bg-green-100';
      case 'educational': return 'text-purple-600 bg-purple-100';
      case 'health': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <div className="h-4 w-4 bg-yellow-600 rounded-full" />;
    }
  };

  const getProgressPercentage = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Monitoring & Evaluation</h1>
        <p className="text-gray-600">Track impact, measure success, and tell our story of transformation</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Impact Overview', icon: BarChart3 },
            { id: 'projects', label: 'Active Projects', icon: Target },
            { id: 'stories', label: 'Success Stories', icon: Heart },
            { id: 'reports', label: 'Reports', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Impact Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactMetrics.map((metric) => (
              <div key={metric.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(metric.category)}`}>
                    {metric.category}
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{metric.name}</h3>
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.unit === 'USD' ? '$' : ''}{metric.value.toLocaleString()}
                    {metric.unit !== 'USD' && metric.unit !== '%' ? ` ${metric.unit}` : ''}
                    {metric.unit === '%' ? '%' : ''}
                  </span>
                  <span className="text-sm text-gray-600">
                    / {metric.target.toLocaleString()} {metric.unit !== 'USD' && metric.unit !== '%' ? metric.unit : ''}
                    {metric.unit === '%' ? '%' : ''}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(metric.value, metric.target)}%` }}
                  />
                </div>
                
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">BGF Impact at a Glance</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-600">Lives Transformed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">$245K</div>
                <div className="text-sm text-gray-600">Total Investment</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">15</div>
                <div className="text-sm text-gray-600">Communities Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">89%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {meProjects.map((project) => (
                <div
                  key={project.id}
                  className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-colors ${
                    selectedProject?.id === project.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-600">Beneficiary: {project.beneficiary}</p>
                      <p className="text-sm text-gray-600">Amount: ${project.amount.toLocaleString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Disbursed: {new Date(project.disbursementDate).toLocaleDateString()}</span>
                    <span>Next Follow-up: {new Date(project.nextFollowUp).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-xs text-gray-600 mb-1">
                      Milestones: {project.milestones.filter(m => m.status === 'achieved').length} / {project.milestones.length} completed
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-green-600 h-1 rounded-full"
                        style={{ 
                          width: `${(project.milestones.filter(m => m.status === 'achieved').length / project.milestones.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Project Details */}
          <div>
            {selectedProject ? (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">Project Details</h3>
                
                {/* Milestones */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Milestones</h4>
                  <div className="space-y-3">
                    {selectedProject.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-start space-x-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 ${
                          milestone.status === 'achieved' ? 'bg-green-100' :
                          milestone.status === 'delayed' ? 'bg-red-100' :
                          milestone.status === 'at_risk' ? 'bg-yellow-100' :
                          'bg-gray-100'
                        }`}>
                          {milestone.status === 'achieved' && <CheckCircle className="h-3 w-3 text-green-600" />}
                          {milestone.status === 'delayed' && <Clock className="h-3 w-3 text-red-600" />}
                          {milestone.status === 'at_risk' && <Clock className="h-3 w-3 text-yellow-600" />}
                          {milestone.status === 'pending' && <Clock className="h-3 w-3 text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                          <p className="text-xs text-gray-600">Target: {new Date(milestone.targetDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics Comparison */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Impact Metrics</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedProject.currentMetrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-red-600">{selectedProject.baselineMetrics[key]}</span>
                          <span className="text-xs text-gray-400">→</span>
                          <span className="text-sm font-medium text-green-600">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Reports */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recent Reports</h4>
                  <div className="space-y-2">
                    {selectedProject.reports.map((report) => (
                      <div key={report.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{report.title}</p>
                        <p className="text-xs text-gray-600">{report.author} • {new Date(report.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a project to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Stories Tab */}
      {activeTab === 'stories' && (
        <div className="space-y-6">
          {successStories.map((story) => (
            <div key={story.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{story.beneficiary}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{story.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${story.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">{story.impactScore}</span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{story.description}</p>

              {/* Outcomes */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Key Outcomes:</h4>
                <ul className="space-y-1">
                  {story.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonial */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex items-start space-x-3">
                  <MessageCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-blue-900 italic">"{story.testimonial}"</p>
                    <p className="text-sm text-blue-700 mt-2">— {story.beneficiary}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Completed: {new Date(story.dateCompleted).toLocaleDateString()}</span>
                <div className="flex items-center space-x-2">
                  <Camera className="h-4 w-4" />
                  <span>{story.images.length} photos available</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Monthly Report', period: 'January 2024', status: 'Published', type: 'monthly' },
              { title: 'Quarterly Review', period: 'Q4 2023', status: 'Published', type: 'quarterly' },
              { title: 'Annual Impact Report', period: '2023', status: 'Draft', type: 'annual' },
              { title: 'Impact Assessment', period: 'Water Projects', status: 'In Progress', type: 'impact_assessment' }
            ].map((report, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                <h4 className="font-medium text-gray-900 mb-2">{report.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{report.period}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === 'Published' ? 'bg-green-100 text-green-800' :
                    report.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {report.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default METracking;