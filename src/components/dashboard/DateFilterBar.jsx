import React from 'react';
import { Button } from '../ui/button';

/**
 * DateFilterBar - Date filter controls for dashboard
 * 
 * @param {Object} props
 * @param {Object} props.dateFilter - Date filter object with startDate and endDate
 * @param {Function} props.onDateFilterChange - Callback for date filter changes
 * @param {boolean} props.includeDailyStats - Whether to include daily statistics
 * @param {Function} props.onToggleDailyStats - Callback for toggling daily statistics
 * @param {Function} props.onApplyFilter - Callback for applying the filter
 * @param {boolean} props.isLoading - Whether the filter is currently loading
 */
const DateFilterBar = ({ 
  dateFilter, 
  onDateFilterChange, 
  includeDailyStats, 
  onToggleDailyStats, 
  onApplyFilter, 
  isLoading 
}) => {
  return (
    <div className="mb-6 p-4 bg-card rounded-lg shadow-sm border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Dashboard Filters</h2>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="text-sm">From:</label>
            <input
              id="startDate"
              type="date"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              value={dateFilter.startDate}
              onChange={(e) => onDateFilterChange({ ...dateFilter, startDate: e.target.value })}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="endDate" className="text-sm">To:</label>
            <input
              id="endDate"
              type="date"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              value={dateFilter.endDate}
              onChange={(e) => onDateFilterChange({ ...dateFilter, endDate: e.target.value })}
            />
          </div>
          
          <div className="flex items-center gap-1">
            <input
              id="includeDailyStats"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={includeDailyStats}
              onChange={(e) => onToggleDailyStats(e.target.checked)}
            />
            <label htmlFor="includeDailyStats" className="text-sm ml-1">
              Include Daily Data
            </label>
          </div>
          
          <Button 
            size="sm" 
            onClick={onApplyFilter}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Apply Filters'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateFilterBar;