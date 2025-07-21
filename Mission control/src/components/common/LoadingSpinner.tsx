import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'muted';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  muted: 'text-gray-400',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  className,
  variant = 'primary',
}) => {
  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 
          className={clsx(
            'animate-spin',
            sizeClasses[size],
            variantClasses[variant]
          )} 
        />
        {message && (
          <p className={clsx(
            'text-sm font-medium',
            variant === 'muted' ? 'text-gray-500' : 'text-gray-700'
          )}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

// Inline spinner for buttons and small spaces
export const InlineSpinner: React.FC<{
  size?: 'sm' | 'md';
  className?: string;
}> = ({ size = 'sm', className }) => {
  return (
    <Loader2 
      className={clsx(
        'animate-spin',
        sizeClasses[size],
        'text-current',
        className
      )} 
    />
  );
};

// Full page loading overlay
export const LoadingOverlay: React.FC<{
  message?: string;
}> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <LoadingSpinner size="xl" message={message} />
    </div>
  );
};

// Loading skeleton for content placeholders
export const LoadingSkeleton: React.FC<{
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}> = ({ className, variant = 'rectangular' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
  };

  return (
    <div 
      className={clsx(
        baseClasses,
        variantClasses[variant],
        className
      )} 
    />
  );
};

// Loading card placeholder
export const LoadingCard: React.FC = () => {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <LoadingSkeleton className="h-12 w-12" variant="circular" />
        <div className="space-y-2 flex-1">
          <LoadingSkeleton className="h-4 w-3/4" variant="text" />
          <LoadingSkeleton className="h-3 w-1/2" variant="text" />
        </div>
      </div>
      <div className="space-y-2">
        <LoadingSkeleton className="h-3 w-full" variant="text" />
        <LoadingSkeleton className="h-3 w-5/6" variant="text" />
        <LoadingSkeleton className="h-3 w-4/6" variant="text" />
      </div>
      <div className="flex space-x-2">
        <LoadingSkeleton className="h-8 w-20" />
        <LoadingSkeleton className="h-8 w-20" />
      </div>
    </div>
  );
};
