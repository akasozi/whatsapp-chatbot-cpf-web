import React, { useState } from 'react';
import LoadingSkeleton from './LoadingSkeleton';

/**
 * DailyUserStats - Displays a table of daily user statistics
 * 
 * @param {Object} props
 * @param {Array} props.dailyStats - Array of daily statistics
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.hasDailyData - Whether we have daily data or not
 */
const DailyUserStats = ({ dailyStats = [], isLoading = false, hasDailyData = false }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Unique Users</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">New Users</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="py-3 px-4"><LoadingSkeleton className="h-4 w-20" /></td>
                <td className="py-3 px-4"><LoadingSkeleton className="h-4 w-10" /></td>
                <td className="py-3 px-4"><LoadingSkeleton className="h-4 w-10" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!hasDailyData) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">Enable 'Include Daily Data' to see daily statistics</p>
      </div>
    );
  }

  if (dailyStats.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No daily data available for the selected period</p>
      </div>
    );
  }

  // Sort by date descending (most recent first)
  const sortedStats = [...dailyStats].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedStats.length / itemsPerPage);
  const paginatedStats = sortedStats.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Unique Users</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">New Users</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedStats.map((day) => (
              <tr key={day.date} className="hover:bg-muted/30">
                <td className="py-3 px-4 text-sm font-medium">{formatDate(day.date)}</td>
                <td className="py-3 px-4 text-sm">{day.unique_users}</td>
                <td className="py-3 px-4 text-sm">
                  {day.new_users}
                  {day.new_users > 0 && (
                    <span className="ml-1 text-green-600 text-xs">
                      (+{Math.round((day.new_users / day.unique_users) * 100)}%)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <div className="text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedStats.length)} of {sortedStats.length} days
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyUserStats;