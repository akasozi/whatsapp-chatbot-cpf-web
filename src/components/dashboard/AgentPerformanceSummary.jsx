import { useState, useEffect } from 'react';
import DashboardService from '@/services/dashboard';
import LoadingSkeleton from './LoadingSkeleton';

/**
 * AgentPerformanceSummary component displays conversation metrics by agent
 * with the ability to select different time periods or custom date ranges.
 * 
 * @param {Object} props
 * @param {string} props.selectedPeriod - The currently selected time period
 * @param {Function} props.onPeriodChange - Callback when period changes
 */
const AgentPerformanceSummary = ({ selectedPeriod = 'currentMonth', onPeriodChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [agentData, setAgentData] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [useCustomDates, setUseCustomDates] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Set default dates when switching to custom date mode
  useEffect(() => {
    if (useCustomDates && !startDate) {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      setEndDate(today.toISOString().split('T')[0]);
      setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
    }
  }, [useCustomDates, startDate]);

  // Load agent performance data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let agentPerformance;
        let availablePeriods;
        
        if (useCustomDates && startDate && endDate) {
          // Use custom date range
          agentPerformance = await DashboardService.getAgentPerformance('custom', startDate, endDate);
          availablePeriods = await DashboardService.getReportingPeriods();
        } else {
          // Use predefined periods
          [agentPerformance, availablePeriods] = await Promise.all([
            DashboardService.getAgentPerformance(selectedPeriod),
            DashboardService.getReportingPeriods()
          ]);
        }
        
        setAgentData(agentPerformance);
        setPeriods(availablePeriods);
      } catch (error) {
        console.error('Failed to fetch agent performance data', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedPeriod, useCustomDates, startDate, endDate]);

  // Handle period change from dropdown
  const handlePeriodChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setUseCustomDates(true);
    } else {
      setUseCustomDates(false);
      if (onPeriodChange) {
        onPeriodChange(value);
      }
    }
  };

  // Handle date input changes
  const handleDateChange = (e, type) => {
    if (type === 'start') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <div>
          <h2 className="text-lg font-semibold">Customer Service Metrics</h2>
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `Total: ${agentData?.totalConversations || 0} conversations`}
          </p>
          {agentData?.avgMetrics && (
            <div className="mt-2 text-sm grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Avg. Response Time: </span>
                <span className="font-medium">{agentData.avgMetrics.avg_response_time}m</span>
              </div>
              <div>
                <span className="text-muted-foreground">Avg. Resolution Time: </span>
                <span className="font-medium">{agentData.avgMetrics.avg_resolution_time}m</span>
              </div>
              <div>
                <span className="text-muted-foreground">Avg. Satisfaction: </span>
                <span className="font-medium">{agentData.avgMetrics.avg_satisfaction}</span>
              </div>
              <div>
                <span className="text-muted-foreground">FCR Rate: </span>
                <span className="font-medium">{(agentData.avgMetrics.avg_fcr_rate * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Period Selector */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <div className="flex items-center">
            <label htmlFor="period-select" className="text-sm mr-2">Period:</label>
            <select
              id="period-select"
              value={useCustomDates ? 'custom' : selectedPeriod}
              onChange={handlePeriodChange}
              className="text-sm rounded-md border border-input bg-background px-3 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-w-[160px]"
              disabled={isLoading}
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
          
          {useCustomDates && (
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange(e, 'start')}
                className="text-sm rounded-md border border-input bg-background px-3 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isLoading}
              />
              <span className="text-sm">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange(e, 'end')}
                className="text-sm rounded-md border border-input bg-background px-3 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isLoading}
                min={startDate}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Agent Performance Table */}
      {isLoading ? (
        <LoadingSkeleton type="table" count={4} className="mt-4" />
      ) : agentData.error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error fetching agent performance data</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>We couldn't retrieve the agent performance data for this time period. The API returned an error.</p>
                <p className="mt-1 text-xs">{agentData.error}</p>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : agentData.byAgent.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">No data available</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>No agent performance data is available for the selected time period.</p>
                <p className="mt-1">Try selecting a different date range or time period.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Agent</th>
                <th className="py-2 px-4 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Conversations</th>
                <th className="py-2 px-4 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">% of Total</th>
                <th className="py-2 px-4 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg. Response</th>
                <th className="py-2 px-4 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Resolution %</th>
                <th className="py-2 px-4 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Responses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agentData?.byAgent.map((agent) => (
                <tr key={agent.id} className="hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                        {agent.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{agent.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-medium">
                    {agent.conversations}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {agentData.totalConversations > 0 
                      ? ((agent.conversations / agentData.totalConversations) * 100).toFixed(1) 
                      : "0.0"}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    {agent.avgResponseTime}m
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-muted rounded-full h-2 mr-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${agent.resolutionRate}%` }}
                        ></div>
                      </div>
                      <span>{agent.resolutionRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {agent.messages}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Period description */}
      <div className="mt-4 text-xs text-muted-foreground">
        {isLoading ? (
          <LoadingSkeleton className="h-4 w-full" />
        ) : (
          <div>
            <p>
              {useCustomDates 
                ? `Showing data for custom period: ${startDate} to ${endDate}`
                : `Showing data for period: ${agentData?.periodLabel}`
              }
            </p>
            {agentData?.periodDetails && (
              <p className="mt-1 text-xs text-muted-foreground">
                Data period details: 
                {new Date(agentData.periodDetails.start).toLocaleString()} - 
                {new Date(agentData.periodDetails.end).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentPerformanceSummary;