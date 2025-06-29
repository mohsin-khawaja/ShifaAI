import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  border = true,
  hover = false,
}) => {
  const baseClasses = 'bg-white rounded-lg transition-all duration-200';
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const borderClasses = border ? 'border border-gray-200' : '';
  const hoverClasses = hover ? 'hover:shadow-md hover:-translate-y-0.5' : '';

  const combinedClasses = [
    baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    borderClasses,
    hoverClasses,
    className,
  ].join(' ');

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export default Card; 