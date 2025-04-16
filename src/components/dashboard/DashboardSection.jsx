import React from 'react';

/**
 * DashboardSection - A reusable section container for dashboard components
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to display
 * @param {string} props.title - The section title
 * @param {React.ReactNode} props.action - Optional action button/link
 * @param {string} props.description - Optional description text
 * @param {boolean} props.isLoading - Whether the section is in loading state
 * @param {string} props.className - Additional classes
 */
const DashboardSection = ({ 
  children,
  title,
  action,
  description,
  isLoading = false,
  className = ""
}) => {
  return (
    <div className={`bg-card shadow-sm rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-medium">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
      
      <div className={`${isLoading ? 'opacity-60' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default DashboardSection;