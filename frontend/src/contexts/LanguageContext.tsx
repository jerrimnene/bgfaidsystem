'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'sn' | 'nd';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: { code: Language; name: string; flag: string }[];
}

const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'sn' as Language, name: 'Shona', flag: '🇿🇼' },
  { code: 'nd' as Language, name: 'Ndebele', flag: '🇿🇼' }
];

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.applications': 'Applications',
    'nav.reports': 'Reports',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.close': 'Close',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.required': 'Required',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.loginSuccess': 'Login successful',
    'auth.loginError': 'Invalid email or password',
    'auth.registerSuccess': 'Registration successful',
    'auth.logoutSuccess': 'Logged out successfully',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to your BGF Aid dashboard',
    'dashboard.myApplications': 'My Applications',
    'dashboard.underReview': 'Under Review',
    'dashboard.approved': 'Approved',
    'dashboard.totalReceived': 'Total Received',
    'dashboard.pendingReview': 'Pending Review',
    'dashboard.totalApplications': 'Total Applications',
    'dashboard.newApplication': 'New Application',
    'dashboard.recentApplications': 'Recent Applications',
    
    // Applications
    'app.title': 'Application Title',
    'app.type': 'Type',
    'app.status': 'Status',
    'app.amount': 'Amount',
    'app.date': 'Date',
    'app.applicant': 'Applicant',
    'app.description': 'Description',
    'app.reason': 'Reason for Request',
    'app.grant': 'Grant',
    'app.scholarship': 'Scholarship',
    'app.medicalAssistance': 'Medical Assistance',
    'app.amountRequested': 'Amount Requested',
    'app.currency': 'Currency',
    'app.urgencyLevel': 'Urgency Level',
    'app.documents': 'Documents',
    'app.uploadFiles': 'Upload Files',
    'app.personalInfo': 'Personal Information',
    'app.contactInfo': 'Contact Information',
    'app.applicationDetails': 'Application Details',
    'app.review': 'Review',
    'app.submit': 'Submit Application',
    'app.phone': 'Phone',
    'app.address': 'Address',
    'app.city': 'City',
    'app.region': 'Region',
    'app.zipCode': 'Zip Code',
    'app.dateOfBirth': 'Date of Birth',
    'app.gender': 'Gender',
    'app.idNumber': 'ID Number',
    'app.bankDetails': 'Bank Details',
    'app.bankName': 'Bank Name',
    'app.accountNumber': 'Account Number',
    'app.accountHolder': 'Account Holder',
    'app.beneficiaryRelation': 'Relation to Beneficiary',
    'app.medicalCondition': 'Medical Condition',
    'app.treatmentType': 'Treatment Type',
    'app.hospitalName': 'Hospital Name',
    'app.doctorName': 'Doctor Name',
    'app.businessName': 'Business Name',
    'app.businessType': 'Business Type',
    'app.yearsInBusiness': 'Years in Business',
    'app.businessPlan': 'Business Plan',
    'app.fieldOfStudy': 'Field of Study',
    'app.institution': 'Institution',
    'app.academicLevel': 'Academic Level',
    'app.graduationDate': 'Expected Graduation Date',
    'app.gpa': 'GPA/Grade Average',
    
    // Status
    'status.newSubmission': 'New Submission',
    'status.poReview': 'Project Officer Review',
    'status.poApproved': 'Project Officer Approved',
    'status.poRejected': 'Project Officer Rejected',
    'status.editRequested': 'Edit Requested',
    'status.managerReview': 'Manager Review',
    'status.managerApproved': 'Manager Approved',
    'status.managerRejected': 'Manager Rejected',
    'status.financeReview': 'Finance Review',
    'status.hospitalReview': 'Hospital Review',
    'status.financeApproved': 'Finance Approved',
    'status.hospitalApproved': 'Hospital Approved',
    'status.executiveReview': 'Executive Review',
    'status.executiveApproved': 'Executive Approved',
    'status.executiveRejected': 'Executive Rejected',
    'status.ceoReview': 'CEO Review',
    'status.ceoApproved': 'CEO Approved',
    'status.ceoRejected': 'CEO Rejected',
    'status.founderReview': 'Founder Review',
    'status.founderApproved': 'Founder Approved',
    'status.founderRejected': 'Founder Rejected',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
    
    // Roles
    'role.applicant': 'Applicant',
    'role.projectOfficer': 'Project Officer',
    'role.programManager': 'Program Manager',
    'role.financeDirector': 'Finance Director',
    'role.hospitalDirector': 'Hospital Director',
    'role.executiveDirector': 'Executive Director',
    'role.ceo': 'CEO',
    'role.founder': 'Founder',
    'role.admin': 'Administrator',
    
    // Reports
    'reports.title': 'M&E Reports',
    'reports.overview': 'Overview',
    'reports.impact': 'Impact Analysis',
    'reports.exportPdf': 'Export PDF',
    'reports.exportExcel': 'Export Excel',
    'reports.totalApplications': 'Total Applications',
    'reports.totalDisbursed': 'Total Disbursed',
    'reports.beneficiaries': 'Beneficiaries',
    'reports.successRate': 'Success Rate',
    'reports.disbursementsOverTime': 'Disbursements Over Time',
    'reports.applicationsByType': 'Applications by Type',
    'reports.regionalDistribution': 'Regional Distribution',
    'reports.educationImpact': 'Education Impact',
    'reports.medicalImpact': 'Medical Impact',
    'reports.economicImpact': 'Economic Impact',
    'reports.studentsSupported': 'Students Supported',
    'reports.graduationRate': 'Graduation Rate',
    'reports.patientsHelped': 'Patients Helped',
    'reports.livesSaved': 'Lives Saved',
    'reports.businessesSupported': 'Businesses Supported',
    'reports.jobsCreated': 'Jobs Created',
    
    // Validation
    'validation.required': 'This field is required',
    'validation.email': 'Please enter a valid email address',
    'validation.password': 'Password must be at least 6 characters',
    'validation.passwordMatch': 'Passwords do not match',
    'validation.phone': 'Please enter a valid phone number',
    'validation.amount': 'Please enter a valid amount',
    'validation.fileSize': 'File size must be less than 10MB',
    'validation.fileType': 'Invalid file type',
    
    // Messages
    'msg.applicationSubmitted': 'Application submitted successfully',
    'msg.applicationUpdated': 'Application updated successfully',
    'msg.applicationDeleted': 'Application deleted successfully',
    'msg.profileUpdated': 'Profile updated successfully',
    'msg.passwordChanged': 'Password changed successfully',
    'msg.fileUploaded': 'File uploaded successfully',
    'msg.networkError': 'Network error. Please try again.',
    'msg.serverError': 'Server error. Please try again later.',
    'msg.unauthorized': 'Unauthorized access',
    'msg.notFound': 'Resource not found',
  },
  
  sn: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.applications': 'Zvikumbiro',
    'nav.reports': 'Mishumo',
    'nav.profile': 'Profile',
    'nav.logout': 'Kubuda',
    'nav.admin': 'Mutariri',
    
    // Common
    'common.loading': 'Kutakura...',
    'common.error': 'Kukanganisa',
    'common.success': 'Budiriro',
    'common.save': 'Chengetedza',
    'common.cancel': 'Kanzura',
    'common.edit': 'Shandura',
    'common.delete': 'Dzima',
    'common.view': 'Ona',
    'common.submit': 'Tuma',
    'common.search': 'Tsvaka',
    'common.filter': 'Sarudza',
    'common.all': 'Zvese',
    'common.yes': 'Hongu',
    'common.no': 'Kwete',
    'common.close': 'Vhara',
    'common.next': 'Zvinotevera',
    'common.previous': 'Zvakaitika',
    'common.required': 'Zvinodiwa',
    
    // Auth
    'auth.login': 'Pinda',
    'auth.register': 'Nyoresa',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Simbisa Password',
    'auth.firstName': 'Zita Rekutanga',
    'auth.lastName': 'Mazita',
    'auth.forgotPassword': 'Wakanganwa Password?',
    'auth.noAccount': 'Hausi ne account?',
    'auth.hasAccount': 'Une account here?',
    'auth.loginSuccess': 'Kupinda kwakafanira',
    'auth.loginError': 'Email kana password yakakanganisa',
    'auth.registerSuccess': 'Kunyoresa kwakafanira',
    'auth.logoutSuccess': 'Kubuda kwakafanira',
    
    // Dashboard
    'dashboard.welcome': 'Wakagamuchirwa ku BGF Aid dashboard',
    'dashboard.myApplications': 'Zvikumbiro Zvangu',
    'dashboard.underReview': 'Zviri Kuongororwa',
    'dashboard.approved': 'Zvakabvumidzwa',
    'dashboard.totalReceived': 'Zvose Zvakagamuchirwa',
    'dashboard.pendingReview': 'Zvakamirira Kuongororwa',
    'dashboard.totalApplications': 'Zvikumbiro Zvose',
    'dashboard.newApplication': 'Chikumbiro Chitsva',
    'dashboard.recentApplications': 'Zvikumbiro Zvazvino',
    
    // Applications
    'app.title': 'Musoro weChikumbiro',
    'app.type': 'Rudzi',
    'app.status': 'Mamiriro',
    'app.amount': 'Mari',
    'app.date': 'Zuva',
    'app.applicant': 'Mukumbiri',
    'app.description': 'Tsananguro',
    'app.reason': 'Chikonzero cheChikumbiro',
    'app.grant': 'Rubatsiro',
    'app.scholarship': 'Scholarship',
    'app.medicalAssistance': 'Rubatsiro rwekurapa',
    'app.amountRequested': 'Mari Inokumbirwa',
    'app.currency': 'Mari',
    'app.urgencyLevel': 'Kukurumidzwa',
    'app.documents': 'Magwaro',
    'app.uploadFiles': 'Isa Mafaira',
    'app.personalInfo': 'Ruzivo rwako',
    'app.contactInfo': 'Ruzivo rwekubatirana',
    'app.applicationDetails': 'Ruzivo rweChikumbiro',
    'app.review': 'Ongorora',
    'app.submit': 'Tuma Chikumbiro',
    'app.phone': 'Runhare',
    'app.address': 'Kero',
    'app.city': 'Guta',
    'app.region': 'Dunhu',
    'app.zipCode': 'Kodhi',
    'app.dateOfBirth': 'Zuva rekuzvarwa',
    'app.gender': 'Chikadzi kana chikomunhurume',
    'app.idNumber': 'ID Number',
    'app.bankDetails': 'Ruzivo rweBank',
    'app.bankName': 'Zita reBank',
    'app.accountNumber': 'Account Number',
    'app.accountHolder': 'Muridzi we Account',
    'app.beneficiaryRelation': 'Ukama kune anobatsirwa',
    'app.medicalCondition': 'Chirwere',
    'app.treatmentType': 'Rudzi rwekurapwa',
    'app.hospitalName': 'Zita reChipatara',
    'app.doctorName': 'Zita reChiremba',
    'app.businessName': 'Zita reBhizinesi',
    'app.businessType': 'Rudzi rweBhizinesi',
    'app.yearsInBusiness': 'Makore muBhizinesi',
    'app.businessPlan': 'Hurongwa hweBhizinesi',
    'app.fieldOfStudy': 'Chikoro',
    'app.institution': 'Chikoro',
    'app.academicLevel': 'Chikamu cheChikoro',
    'app.graduationDate': 'Zuva rekupedza',
    'app.gpa': 'Zvibodzwa',
    
    // Additional Shona translations would continue here...
    // Status
    'status.newSubmission': 'Chikumbiro Chitsva',
    'status.completed': 'Zvapera',
    'status.cancelled': 'Zvakanzwa',
    
    // Messages
    'msg.applicationSubmitted': 'Chikumbiro chatumwa',
    'msg.applicationUpdated': 'Chikumbiro chashandurwa',
    'msg.networkError': 'Dambudziko renetwork. Edza zvakare.',
  },
  
  nd: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.applications': 'Izikhalazo',
    'nav.reports': 'Imibiko',
    'nav.profile': 'Profile',
    'nav.logout': 'Phuma',
    'nav.admin': 'Umlawuli',
    
    // Common
    'common.loading': 'Kuyalayishwa...',
    'common.error': 'Iphutha',
    'common.success': 'Impumelelo',
    'common.save': 'Gcina',
    'common.cancel': 'Rhoxisa',
    'common.edit': 'Hlela',
    'common.delete': 'Sula',
    'common.view': 'Buka',
    'common.submit': 'Thumela',
    'common.search': 'Funga',
    'common.filter': 'Hlungula',
    'common.all': 'Konke',
    'common.yes': 'Yebo',
    'common.no': 'Hayi',
    'common.close': 'Vala',
    'common.next': 'Okulandelayo',
    'common.previous': 'Okudlulileyo',
    'common.required': 'Kuyadingeka',
    
    // Auth
    'auth.login': 'Ngena',
    'auth.register': 'Bhalisa',
    'auth.email': 'I-email',
    'auth.password': 'Iphasiwedi',
    'auth.confirmPassword': 'Qinisekisa Iphasiwedi',
    'auth.firstName': 'Igama Lokuqala',
    'auth.lastName': 'Isibongo',
    'auth.forgotPassword': 'Ukhohlwe iphasiwedi?',
    'auth.noAccount': 'Awuna account?',
    'auth.hasAccount': 'Usunayo i-account?',
    'auth.loginSuccess': 'Ukungenela kuphumelele',
    'auth.loginError': 'I-email loba iphasiwedi ayifanelanga',
    'auth.registerSuccess': 'Ukubhalisa kuphumelele',
    'auth.logoutSuccess': 'Ukuphuma kuphumelele',
    
    // Dashboard
    'dashboard.welcome': 'Wamukelekile ku-BGF Aid dashboard',
    'dashboard.myApplications': 'Izikhalazo Zami',
    'dashboard.underReview': 'Ziyahlolwa',
    'dashboard.approved': 'Zemukelihiwe',
    'dashboard.totalReceived': 'Konke Okwamukelwayo',
    'dashboard.pendingReview': 'Zilinde Ukuhlolwa',
    'dashboard.totalApplications': 'Zonke Izikhalazo',
    'dashboard.newApplication': 'Isikhalazo Esisha',
    'dashboard.recentApplications': 'Izikhalazo Zakamuva',
    
    // Applications - Basic Ndebele translations
    'app.title': 'Inhloko yesikhalazo',
    'app.type': 'Uhlobo',
    'app.status': 'Isimo',
    'app.amount': 'Imali',
    'app.date': 'Usuku',
    'app.applicant': 'Umceli',
    'app.description': 'Incazelo',
    'app.reason': 'Isizatho sesikhalazo',
    'app.submit': 'Thumela isikhalazo',
    
    // Additional Ndebele translations would continue here...
    'status.completed': 'Kuqedile',
    'status.cancelled': 'Kurhoxisiwe',
    'msg.applicationSubmitted': 'Isikhalazo sithunyekhiwe',
    'msg.networkError': 'Inkinga ye-network. Zama futhi.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && ['en', 'sn', 'nd'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const translate = (key: string): string => {
    const translation = translations[language]?.[key];
    if (translation) {
      return translation;
    }
    
    // Fallback to English if translation not found
    const fallback = translations.en[key];
    if (fallback) {
      return fallback;
    }
    
    // Return the key if no translation found
    return key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage: changeLanguage,
    t: translate,
    languages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};