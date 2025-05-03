import { useState, useEffect } from 'react';
import DashboardSection from './DashboardSection';
import LoadingSkeleton from './LoadingSkeleton';
import DashboardService from '../../services/dashboard';
import { Button } from '../ui/button';

const MessageStatistics = () => {
  // Date filter state
  const getCurrentMonthDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayStr = firstDay.toISOString().split('T')[0];
    const todayStr = now.toISOString().split('T')[0];
    return { startDate: firstDayStr, endDate: todayStr };
  };

  const [dateFilter, setDateFilter] = useState(getCurrentMonthDates());
  const [includeDailyStats, setIncludeDailyStats] = useState(true);
  const [messageStats, setMessageStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch message statistics
  const fetchMessageStats = async (startDate, endDate, includeDaily = includeDailyStats) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await DashboardService.getMessageStats(startDate, endDate, includeDaily);
      setMessageStats(data);
    } catch (err) {
      console.error('Failed to fetch message statistics', err);
      setError(err.message || 'Failed to load message statistics');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMessageStats(dateFilter.startDate, dateFilter.endDate, includeDailyStats);
  }, []);

  // Format percentage for display
  const formatPercent = (value) => {
    if (value === undefined || value === null) return '0%';
    return `${(value * 100).toFixed(1)}%`;
  };

  // Render loading state
  if (isLoading && !messageStats) {
    return (
      <DashboardSection
        title="Message Statistics"
        description="Loading message statistics..."
        isLoading={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <LoadingSkeleton className="h-32" count={4} />
        </div>
      </DashboardSection>
    );
  }

  // Render error state
  if (error && !messageStats) {
    return (
      <DashboardSection
        title="Message Statistics"
        description={`Error: ${error}`}
      >
        <div className="p-4 bg-red-50 text-red-800 rounded-lg">
          <p>Failed to load message statistics. Please try again later.</p>
          <Button 
            onClick={() => fetchMessageStats(dateFilter.startDate, dateFilter.endDate, includeDailyStats)} 
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </DashboardSection>
    );
  }

  // Extract summary data
  const summary = messageStats?.summary || {};
  const daily = messageStats?.daily || [];

  return (
    <DashboardSection
      title="Message Statistics"
      description={`Statistics for period: ${summary.start_date || dateFilter.startDate} to ${summary.end_date || dateFilter.endDate}`}
      isLoading={isLoading}
      action={
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <label htmlFor="msgStartDate" className="text-sm">From:</label>
            <input
              id="msgStartDate"
              type="date"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="msgEndDate" className="text-sm">To:</label>
            <input
              id="msgEndDate"
              type="date"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <div className="flex items-center space-x-1">
            <input
              id="msgIncludeDailyStats"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={includeDailyStats}
              onChange={(e) => setIncludeDailyStats(e.target.checked)}
            />
            <label htmlFor="msgIncludeDailyStats" className="text-sm ml-1">
              Include Daily Data
            </label>
          </div>
          <Button 
            size="sm" 
            onClick={() => fetchMessageStats(dateFilter.startDate, dateFilter.endDate, includeDailyStats)}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Apply'}
          </Button>
        </div>
      }
    >
      {/* Message Volume Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-muted/20 p-4 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-sm font-medium mb-1">Total Messages</h3>
          {isLoading ? (
            <LoadingSkeleton className="h-8 w-20 mb-1" />
          ) : (
            <div className="flex items-end">
              <span className="text-3xl font-bold mr-1">{summary.total_messages || 0}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">All messages exchanged in the period</p>
        </div>
        
        <div className="bg-muted/20 p-4 rounded-lg border-l-4 border-green-500">
          <h3 className="text-sm font-medium mb-1">Inbound Messages</h3>
          {isLoading ? (
            <LoadingSkeleton className="h-8 w-20 mb-1" />
          ) : (
            <div className="flex items-end">
              <span className="text-3xl font-bold mr-1">{summary.inbound?.total || 0}</span>
              <span className="text-sm text-muted-foreground">
                ({((summary.inbound?.total / summary.total_messages) * 100).toFixed(1)}%)
              </span>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Messages received from users</p>
        </div>
        
        <div className="bg-muted/20 p-4 rounded-lg border-l-4 border-purple-500">
          <h3 className="text-sm font-medium mb-1">Outbound Messages</h3>
          {isLoading ? (
            <LoadingSkeleton className="h-8 w-20 mb-1" />
          ) : (
            <div className="flex items-end">
              <span className="text-3xl font-bold mr-1">{summary.outbound?.total || 0}</span>
              <span className="text-sm text-muted-foreground">
                ({((summary.outbound?.total / summary.total_messages) * 100).toFixed(1)}%)
              </span>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Messages sent to users</p>
        </div>
      </div>

      {/* Message Source Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-muted/20 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Active Conversations</h3>
          {isLoading ? (
            <LoadingSkeleton className="h-8 w-20 mb-1" />
          ) : (
            <div className="flex items-end">
              <span className="text-2xl font-bold mr-1">{summary.active_conversations || 0}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Conversations during period</p>
        </div>
        
        <div className="bg-muted/20 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Bot Automation Rate</h3>
          {isLoading ? (
            <LoadingSkeleton className="h-8 w-20 mb-1" />
          ) : (
            <div className="flex items-end">
              <span className="text-2xl font-bold mr-1">{formatPercent(summary.bot_automation_rate)}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Percentage handled by automation</p>
        </div>
        
        <div className="bg-muted/20 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Agent Handling Rate</h3>
          {isLoading ? (
            <LoadingSkeleton className="h-8 w-20 mb-1" />
          ) : (
            <div className="flex items-end">
              <span className="text-2xl font-bold mr-1">{formatPercent(summary.agent_handling_rate)}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Percentage handled by human agents</p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-3">Message Source Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/10 p-4 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-3">Outbound Messages</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Bot Messages</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{summary.outbound?.by_source?.BOT || 0}</span>
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${summary.outbound?.total ? (summary.outbound.by_source?.BOT / summary.outbound.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {summary.outbound?.total ? ((summary.outbound.by_source?.BOT / summary.outbound.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Agent Messages</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{summary.outbound?.by_source?.AGENT || 0}</span>
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${summary.outbound?.total ? (summary.outbound.by_source?.AGENT / summary.outbound.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {summary.outbound?.total ? ((summary.outbound.by_source?.AGENT / summary.outbound.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/10 p-4 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-3">Inbound Messages</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">User Messages</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{summary.inbound?.by_source?.USER || 0}</span>
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: '100%' }}
                    />
                  </div>
                  <span className="ml-2 text-xs text-muted-foreground">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Daily Message Stats Table */}
      {includeDailyStats && daily.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Daily Message Statistics</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Messages</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Inbound</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Outbound</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Bot Msgs</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Agent Msgs</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Convs</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Bot Auto %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {daily.map((day) => (
                  <tr key={day.message_date} className="hover:bg-muted/30">
                    <td className="py-2 px-4 text-sm">{new Date(day.message_date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 text-sm font-medium">{day.total_messages}</td>
                    <td className="py-2 px-4 text-sm">{day.total_inbound}</td>
                    <td className="py-2 px-4 text-sm">{day.total_outbound}</td>
                    <td className="py-2 px-4 text-sm">{day.outbound_bot}</td>
                    <td className="py-2 px-4 text-sm">{day.outbound_agent}</td>
                    <td className="py-2 px-4 text-sm">{day.active_conversations}</td>
                    <td className="py-2 px-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-16 bg-muted rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${day.bot_automation_percentage}%` }}
                          />
                        </div>
                        <span>{day.bot_automation_percentage.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardSection>
  );
};

export default MessageStatistics;