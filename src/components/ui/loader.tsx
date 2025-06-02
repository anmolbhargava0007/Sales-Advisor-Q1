
import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loader = ({ className, size = 'md' }: LoaderProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn(
      "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
      sizeClasses[size],
      className
    )} />
  );
};

export { Loader };
