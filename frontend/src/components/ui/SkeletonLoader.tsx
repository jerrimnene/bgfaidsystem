'use client';

import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'list' | 'table';
  count?: number;
  height?: string;
  width?: string;
  className?: string;
  animate?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangular',
  count = 1,
  height,
  width,
  className = '',
  animate = true
}) => {
  const baseClasses = `bg-gray-200 ${animate ? 'animate-pulse' : ''}`;

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full rounded';
      case 'circular':
        return 'h-10 w-10 rounded-full';
      case 'rectangular':
        return 'h-20 w-full rounded-lg';
      case 'card':
        return 'h-48 w-full rounded-xl';
      case 'list':
        return 'h-12 w-full rounded-md';
      case 'table':
        return 'h-8 w-full rounded';
      default:
        return 'h-20 w-full rounded-lg';
    }
  };

  const getInlineStyles = () => {
    const styles: React.CSSProperties = {};
    if (height) styles.height = height;
    if (width) styles.width = width;
    return styles;
  };

  const SkeletonItem = ({ index }: { index: number }) => (
    <div
      key={index}
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={getInlineStyles()}
    />
  );

  // Special compound skeletons
  if (variant === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <div className="flex items-center space-x-4">
              <div className={`${baseClasses} h-12 w-12 rounded-full`} />
              <div className="space-y-2 flex-1">
                <div className={`${baseClasses} h-4 w-1/2 rounded`} />
                <div className={`${baseClasses} h-3 w-1/3 rounded`} />
              </div>
            </div>
            <div className="space-y-2">
              <div className={`${baseClasses} h-4 w-full rounded`} />
              <div className={`${baseClasses} h-4 w-3/4 rounded`} />
              <div className={`${baseClasses} h-4 w-1/2 rounded`} />
            </div>
            <div className="flex justify-between">
              <div className={`${baseClasses} h-8 w-20 rounded-md`} />
              <div className={`${baseClasses} h-8 w-16 rounded-md`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border">
            <div className={`${baseClasses} h-10 w-10 rounded-full flex-shrink-0`} />
            <div className="flex-1 space-y-2">
              <div className={`${baseClasses} h-4 w-3/4 rounded`} />
              <div className={`${baseClasses} h-3 w-1/2 rounded`} />
            </div>
            <div className={`${baseClasses} h-6 w-16 rounded`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="space-y-2">
        {/* Table header */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-t-lg">
          <div className={`${baseClasses} h-4 rounded`} />
          <div className={`${baseClasses} h-4 rounded`} />
          <div className={`${baseClasses} h-4 rounded`} />
          <div className={`${baseClasses} h-4 rounded`} />
        </div>
        {/* Table rows */}
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-white border-b">
            <div className={`${baseClasses} h-4 rounded`} />
            <div className={`${baseClasses} h-4 rounded`} />
            <div className={`${baseClasses} h-4 rounded`} />
            <div className={`${baseClasses} h-4 rounded`} />
          </div>
        ))}
      </div>
    );
  }

  // Standard skeleton items
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} index={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;