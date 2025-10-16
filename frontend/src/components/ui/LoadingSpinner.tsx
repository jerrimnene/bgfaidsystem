'use client';

import React from 'react';
import { Loader2, Heart, CheckCircle2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'heart' | 'success';
  text?: string;
  className?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  text,
  className = '',
  fullScreen = false,
  overlay = false
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-6 w-6';
      case 'lg': return 'h-8 w-8';
      case 'xl': return 'h-12 w-12';
      default: return 'h-6 w-6';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary': return 'text-blue-600';
      case 'secondary': return 'text-gray-500';
      case 'heart': return 'text-red-600';
      case 'success': return 'text-green-600';
      default: return 'text-blue-600';
    }
  };

  const SpinnerIcon = () => {
    if (variant === 'heart') {
      return <Heart className={`${getSizeClasses()} ${getVariantClasses()} animate-pulse`} fill="currentColor" />;
    }
    if (variant === 'success') {
      return <CheckCircle2 className={`${getSizeClasses()} ${getVariantClasses()}`} />;
    }
    return <Loader2 className={`${getSizeClasses()} ${getVariantClasses()} animate-spin`} />;
  };

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <SpinnerIcon />
      {text && (
        <div className="text-center">
          <p className={`font-medium ${getVariantClasses()}`}>{text}</p>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              <div className={`w-2 h-2 bg-current rounded-full animate-pulse ${getVariantClasses()}`} style={{ animationDelay: '0ms' }}></div>
              <div className={`w-2 h-2 bg-current rounded-full animate-pulse ${getVariantClasses()}`} style={{ animationDelay: '150ms' }}></div>
              <div className={`w-2 h-2 bg-current rounded-full animate-pulse ${getVariantClasses()}`} style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${
        overlay ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'
      }`}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;