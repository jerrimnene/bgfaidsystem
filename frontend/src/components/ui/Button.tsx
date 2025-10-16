'use client';

import React from 'react';
import { Loader2, ChevronRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  animated?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  animated = true,
  pulse = false,
  className = '',
  disabled,
  children,
  onClick,
  ...props
}) => {
  const getVariantClasses = () => {
    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 border border-gray-300',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-transparent',
      destructive: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl',
      success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl'
    };
    return variants[variant];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-6 py-4 text-base',
      xl: 'px-8 py-5 text-lg'
    };
    return sizes[size];
  };

  const baseClasses = `
    relative
    inline-flex
    items-center
    justify-center
    space-x-2
    font-semibold
    rounded-xl
    transition-all
    duration-200
    ease-in-out
    focus:outline-none
    focus:ring-4
    focus:ring-opacity-50
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:transform-none
    ${animated ? 'hover:scale-[1.02] active:scale-[0.98]' : ''}
    ${pulse ? 'animate-pulse' : ''}
    ${fullWidth ? 'w-full' : ''}
  `;

  const getFocusRingColor = () => {
    switch (variant) {
      case 'primary': return 'focus:ring-blue-500';
      case 'destructive': return 'focus:ring-red-500';
      case 'success': return 'focus:ring-green-500';
      default: return 'focus:ring-gray-500';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || disabled) return;
    
    // Add ripple effect
    if (animated) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
      `;
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
    
    onClick?.(e);
  };

  return (
    <>
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
      <button
        className={`
          ${baseClasses}
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${getFocusRingColor()}
          ${className}
        `}
        disabled={isLoading || disabled}
        onClick={handleClick}
        aria-label={typeof children === 'string' ? children : undefined}
        {...props}
      >
        {/* Loading state */}
        {isLoading && (
          <Loader2 className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' || size === 'xl' ? 'h-6 w-6' : 'h-5 w-5'} animate-spin`} />
        )}
        
        {/* Left icon */}
        {!isLoading && leftIcon && (
          <span className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' || size === 'xl' ? 'h-6 w-6' : 'h-5 w-5'}`}>
            {leftIcon}
          </span>
        )}
        
        {/* Button text */}
        <span className={isLoading ? 'opacity-70' : ''}>
          {isLoading && loadingText ? loadingText : children}
        </span>
        
        {/* Right icon */}
        {!isLoading && rightIcon && (
          <span className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' || size === 'xl' ? 'h-6 w-6' : 'h-5 w-5'} transition-transform duration-200 ${animated ? 'group-hover:translate-x-1' : ''}`}>
            {rightIcon}
          </span>
        )}
        
        {/* Animated arrow for certain variants */}
        {!isLoading && !rightIcon && animated && (variant === 'primary' || variant === 'success') && (
          <ChevronRight className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' || size === 'xl' ? 'h-6 w-6' : 'h-5 w-5'} opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0`} />
        )}
        
        {/* Gradient overlay for hover effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>
    </>
  );
};

export default Button;