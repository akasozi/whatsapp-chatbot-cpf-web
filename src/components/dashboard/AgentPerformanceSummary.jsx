import { useState, useEffect } from 'react';
import DashboardService from '@/services/dashboard';
import LoadingSkeleton from './LoadingSkeleton';

/**
 * AgentPerformanceSummary component displays conversation metrics by agent
 * with the ability to select different time periods.
 * 
 * @param {Object} props
 * @param {string} props.selectedPeriod - The currently selected time period
 * @param {Function} props.onPeriodChange - Callback when period changes
 */
const AgentPerformanceSummary = ({ selectedPeriod = 'currentMonth', onPeriodChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [agentData, setAgentData] = useState(null);
  const [periods, setPeriods] = useState([]);

  // Load agent performance data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Load both the agent data and available periods
        const [agentPerformance, availablePeriods] = await Promise.all([
          DashboardService.getAgentPerformance(selectedPeriod),
          DashboardService.getReportingPeriods()
        ]);
        
        setAgentData(agentPerformance);
        setPeriods(availablePeriods);
      } catch (error) {
        console.error('Failed to fetch agent performance data', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedPeriod]);

  // Handle period change from dropdown
  const handlePeriodChange = (e) => {
    if (onPeriodChange) {
      onPeriodChange(e.target.value);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Agent Performance Summary</h2>
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `Total: ${agentData?.totalConversations || 0} conversations`}
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center">
          <label htmlFor="period-select" className="text-sm mr-2">Period:</label>
          <select
            id="period-select"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            className="text-sm rounded-md border border-input bg-background px-3 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            disabled={isLoading}
          >
            {periods.map(period => (
              <option key={period.id} value={period.id}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Agent Performance Table */}
      {isLoading ? (
        <LoadingSkeleton type="table" count={4} className="mt-4" />
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
                    {((agent.conversations / agentData.totalConversations) * 100).toFixed(1)}%
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
          <p>Showing data for period: {agentData?.periodLabel}</p>
        )}
      </div>
    </div>
  );
};

export default AgentPerformanceSummary;