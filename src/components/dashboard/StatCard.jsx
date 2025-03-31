import React from 'react';

/**
 * StatCard - A reusable card for displaying statistics
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the stat
 * @param {string|number} props.value - The value to display
 * @param {React.ReactNode} props.icon - The icon to display
 * @param {string} props.iconClass - Classes for the icon container
 * @param {string} props.description - Optional description text
 * @param {string} props.trend - Optional trend direction ('up', 'down', or null)
 * @param {number} props.trendValue - Optional trend value
 * @param {boolean} props.isLoading - Whether the card is in loading state
 * @param {string} props.className - Additional classes to apply to the card
 */
const StatCard = ({ 
  title, 
  value, 
  icon, 
  iconClass = "bg-primary/10 text-primary",
  description,
  trend,
  trendValue,
  isLoading = false,
  className = ""
}) => {
  
  // Get trend display elements
  const getTrendDisplay = () => {
    if (!trend || !trendValue) return null;
    
    const isPositive = trend === 'up';
    const isNegative = trend === 'down';
    
    const trendClasses = isPositive ? 'text-green-600' : 
                          isNegative ? 'text-red-600' : 'text-gray-600';
    
    const TrendIcon = isPositive ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
      </svg>
    );
    
    return (
      <div className={`flex items-center space-x-1 text-sm ${trendClasses}`}>
        {TrendIcon}
        <span>{trendValue}%</span>
      </div>
    );
  };
  
  return (
    <div className={`bg-card shadow-sm rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          {isLoading ? (
            <div className="h-9 w-16 bg-muted animate-pulse rounded mt-1"></div>
          ) : (
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {getTrendDisplay()}
        </div>
        <div className={`p-3 rounded-full ${iconClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;