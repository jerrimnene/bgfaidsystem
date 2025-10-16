'use client';

import React, { useState } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

interface LanguageSelectorProps {
  className?: string;
  compact?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '',
  compact = false 
}) => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  if (compact) {
    return (
      <div className={`relative inline-block text-left ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <span className="mr-2">{currentLanguage?.flag}</span>
          <span className="hidden sm:inline">{currentLanguage?.name}</span>
          <ChevronDown className="ml-2 -mr-1 h-4 w-4" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`${
                      language === lang.code
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-900'
                    } group flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100`}
                  >
                    <span className="mr-3">{lang.flag}</span>
                    <span className="flex-1 text-left">{lang.name}</span>
                    {language === lang.code && (
                      <Check className="ml-2 h-4 w-4 text-primary-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        aria-expanded="true"
        aria-haspopup="true"
      >
        <Globe className="mr-2 h-4 w-4 text-gray-500" />
        <span className="mr-2">{currentLanguage?.flag}</span>
        <span>{currentLanguage?.name}</span>
        <ChevronDown className="ml-2 -mr-1 h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                Select Language
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`${
                    language === lang.code
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-900'
                  } group flex items-center w-full px-4 py-3 text-sm hover:bg-gray-100 transition-colors duration-150`}
                >
                  <span className="mr-3 text-lg">{lang.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{lang.name}</div>
                    <div className="text-xs text-gray-500">
                      {lang.code === 'en' && 'English'}
                      {lang.code === 'sn' && 'ChiShona'}
                      {lang.code === 'nd' && 'IsiNdebele'}
                    </div>
                  </div>
                  {language === lang.code && (
                    <Check className="ml-2 h-4 w-4 text-primary-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;