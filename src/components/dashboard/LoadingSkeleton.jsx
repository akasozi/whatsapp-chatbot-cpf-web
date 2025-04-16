import React from 'react';

/**
 * LoadingSkeleton - A reusable skeleton loader component
 * 
 * @param {Object} props
 * @param {string} props.type - The type of skeleton to display ('card', 'table', 'text', 'circle')
 * @param {number} props.count - Number of skeleton items to display
 * @param {string} props.className - Additional classes to apply
 */
const LoadingSkeleton = ({ type = 'text', count = 1, className = '' }) => {
  const items = Array.from({ length: count }, (_, i) => i);
  
  // Base classes for all skeleton types
  const baseClasses = 'bg-muted animate-pulse rounded';
  
  // Type-specific classes
  const typeClasses = {
    text: 'h-4 w-full',
    circle: 'rounded-full',
    card: 'h-24 w-full',
    table: 'h-8 w-full',
  };
  
  // Classes based on selected type
  const combinedClasses = `${baseClasses} ${typeClasses[type] || typeClasses.text} ${className}`;
  
  if (type === 'table') {
    return (
      <div className="w-full">
        {/* Table header */}
        <div className="flex gap-2 mb-3 w-full">
          {[...Array(4)].map((_, i) => (
            <div key={`header-${i}`} className={`${baseClasses} h-6 flex-1`}></div>
          ))}
        </div>
        
        {/* Table rows */}
        {items.map((item) => (
          <div key={`row-${item}`} className="flex gap-2 mb-2 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={`cell-${item}-${i}`} className={`${baseClasses} h-10 flex-1`}></div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <>
      {items.map((item) => (
        <div key={item} className={combinedClasses}></div>
      ))}
    </>
  );
};

export default LoadingSkeleton;