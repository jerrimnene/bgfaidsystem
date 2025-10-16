'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  action,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(id);
    }, 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: CheckCircle2,
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: XCircle,
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: Info,
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          icon: Info,
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-700'
        };
    }
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 w-96 max-w-sm mx-auto
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isExiting ? 'translate-x-full opacity-0' : ''}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className={`
        ${styles.bg}
        border
        rounded-xl
        shadow-lg
        backdrop-blur-sm
        p-4
        space-y-3
        hover:shadow-xl
        transition-shadow
        duration-200
      `}>
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 ${styles.iconColor} mt-0.5`}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-semibold ${styles.titleColor}`}>
              {title}
            </h3>
            {message && (
              <p className={`text-sm mt-1 ${styles.messageColor}`}>
                {message}
              </p>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className={`
              flex-shrink-0 
              ${styles.iconColor} 
              hover:opacity-70 
              transition-opacity 
              duration-150
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-current
              rounded-md
              p-1
            `}
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {action && (
          <div className="flex justify-end">
            <button
              onClick={action.onClick}
              className={`
                text-sm font-medium
                ${styles.iconColor}
                hover:underline
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-current
                rounded-md
                px-2
                py-1
              `}
            >
              {action.label}
            </button>
          </div>
        )}

        {/* Progress bar for timed toasts */}
        {duration > 0 && (
          <div className="relative">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${styles.iconColor.replace('text-', 'bg-')} rounded-full transition-transform duration-linear`}
                style={{
                  animation: `shrink ${duration}ms linear forwards`,
                  transformOrigin: 'left'
                }}
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastProps[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index
          }}
        >
          <Toast {...toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};

export default Toast;