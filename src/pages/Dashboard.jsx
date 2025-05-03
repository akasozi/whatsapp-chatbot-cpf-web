import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchConversations, fetchUnreadStats, selectTotalUnreadCount } from '../redux/slices/conversationsSlice';
import { fetchApplications, selectAllApplications } from '../redux/slices/applicationsSlice';
import { fetchLibApplications, selectAllLibApplications } from '../redux/slices/libApplicationsSlice';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import DashboardSection from '../components/dashboard/DashboardSection';
import LoadingSkeleton from '../components/dashboard/LoadingSkeleton';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import DailyUserStats from '../components/dashboard/DailyUserStats';
import AgentPerformanceSummary from '../components/dashboard/AgentPerformanceSummary';
import MessageStatistics from '../components/dashboard/MessageStatistics';
import DashboardService from '../services/dashboard';
import { Button } from '../components/ui/button';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { byId, allIds, conversationsWithUnread, loadingStatus } = useSelector((state) => state.conversations);
  const conversations = allIds.map(id => byId[id]);
  const conversationsLoading = loadingStatus.fetchConversations === 'pending';
  const totalUnreadCount = useSelector(selectTotalUnreadCount);
  
  // Get application data
  const applications = useSelector(selectAllApplications);
  const applicationsLoading = useSelector((state) => state.applications.loadingStatus.fetchApplications === 'pending');
  
  // Get LIB application data
  const libApplications = useSelector(selectAllLibApplications);
  const libApplicationsLoading = useSelector((state) => state.libApplications.loadingStatus.fetchLibApplications === 'pending');
  
  // Local state for additional dashboard data
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [uniqueUsersStats, setUniqueUsersStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUserStats, setIsLoadingUserStats] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('currentMonth');
  const [includeDailyStats, setIncludeDailyStats] = useState(true);
  
  // Date filter state for unique users statistics
  const getCurrentMonthDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayStr = firstDay.toISOString().split('T')[0];
    const todayStr = now.toISOString().split('T')[0];
    return { startDate: firstDayStr, endDate: todayStr };
  };
  
  const [dateFilter, setDateFilter] = useState(getCurrentMonthDates());

  // Function to fetch unique users statistics with date range
  const fetchUniqueUsersStats = async (startDate, endDate, includeDaily = includeDailyStats) => {
    setIsLoadingUserStats(true);
    try {
      console.log(`Dashboard: Fetching data for range ${startDate} to ${endDate}, includeDaily: ${includeDaily}`);
      const uniqueUsersData = await DashboardService.getUniqueUsersStats(startDate, endDate, includeDaily);
      console.log('Dashboard: Data received:', uniqueUsersData);
      setUniqueUsersStats(uniqueUsersData);
    } catch (error) {
      console.error('Dashboard: Failed to fetch unique users statistics', error);
      // Show error to user
      alert(`Error fetching user statistics: ${error.message}`);
    } finally {
      setIsLoadingUserStats(false);
    }
  };
  
  // Fetch all data needed for the dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch conversations from Redux
        dispatch(fetchConversations());
        
        // Fetch unread conversation stats
        dispatch(fetchUnreadStats());
        
        // Fetch applications from Redux
        dispatch(fetchApplications());
        
        // Fetch LIB applications from Redux
        dispatch(fetchLibApplications());
        
        // Fetch additional dashboard data
        const [statsData, activitiesData, performanceData] = await Promise.all([
          DashboardService.getStats(),
          DashboardService.getActivities(),
          DashboardService.getPerformance()
        ]);
        
        setStats(statsData);
        setActivities(activitiesData);
        setPerformance(performanceData);
        
        // Fetch unique users stats with current date filter
        await fetchUniqueUsersStats(dateFilter.startDate, dateFilter.endDate, includeDailyStats);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [dispatch]);

  // Get current time formatted for greeting
  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Data
          </Button>
        </div>
        
        {/* Date Filter Bar removed */}
        
        {/* Greeting Card */}
        <DashboardSection 
          title={`Good ${getCurrentTimeOfDay()}, ${user?.name || 'Agent'}`}
          description="Here's an overview of your conversations and performance"
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Your Status</h3>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Online - Available for new conversations</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Shift Overview</h3>
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  <LoadingSkeleton type="text" className="w-3/4 h-4" />
                ) : (
                  <>You've handled {performance?.conversationsHandled.current || 0} conversations today.</>
                )}
              </p>
            </div>
          </div>
        </DashboardSection>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <StatCard
            title="Pending Conversations"
            value={
              conversationsLoading 
                ? '...' 
                : totalUnreadCount
            }
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            iconClass="bg-yellow-100 text-yellow-600"
            isLoading={conversationsLoading}
            description="Unread messages"
          />
          
          <StatCard
            title="Active Conversations"
            value={
              conversationsLoading 
                ? '...' 
                : conversations.filter(c => c.status === 'ACTIVE').length
            }
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            }
            iconClass="bg-green-100 text-green-600"
            isLoading={conversationsLoading}
            description="In progress"
          />
          
          <StatCard
            title="Avg. Response Time"
            value={isLoading ? '...' : `${stats?.averageResponseTime || 0}m`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            iconClass="bg-blue-100 text-blue-600"
            isLoading={isLoading}
            description="Minutes to first response"
            trend={performance?.responseTime.trend}
            trendValue={performance?.responseTime.trendValue}
          />
          
          <StatCard
            title="Resolution Rate"
            value={isLoading ? '...' : `${performance?.resolutionRate.current || 0}%`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            iconClass="bg-purple-100 text-purple-600"
            isLoading={isLoading}
            description="Successfully resolved"
            trend={performance?.resolutionRate.trend}
            trendValue={performance?.resolutionRate.trendValue}
          />
        </div>
        
        {/* Main Content - First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Conversations */}
          <div className="md:col-span-2">
            <DashboardSection 
              title="Recent Conversations"
              isLoading={conversationsLoading}
              action={
                <Link to="/conversations">
                  <Button variant="link" size="sm">View All</Button>
                </Link>
              }
            >
              {conversationsLoading ? (
                <LoadingSkeleton type="table" count={5} />
              ) : conversations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Message</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {conversations.slice(0, 5).map((conversation) => (
                        <tr key={conversation.id} className="hover:bg-muted/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                                {conversation.customer_name.charAt(0)}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium">{conversation.customer_name}</p>
                                <p className="text-xs text-muted-foreground">{conversation.phone_number}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {conversation.lastMessage?.content?.length > 30
                              ? `${conversation.lastMessage.content.substring(0, 30)}...`
                              : conversation.lastMessage?.content}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              conversation.status === 'TRANSFERRED' ? 'bg-yellow-100 text-yellow-800' :
                              conversation.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {conversation.status}
                            </span>
                            {conversation.unread_count > 0 && (
                              <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                {conversation.unread_count}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {new Date(conversation.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No conversations found
                </div>
              )}
            </DashboardSection>
          </div>
          
          {/* Daily User Statistics */}
          <div>
            <DashboardSection 
              title="Daily User Statistics"
              description="Daily breakdown of user interactions"
              isLoading={isLoadingUserStats}
            >
              <DailyUserStats 
                dailyStats={uniqueUsersStats?.daily || []} 
                isLoading={isLoadingUserStats}
                hasDailyData={includeDailyStats && Boolean(uniqueUsersStats?.daily)}
              />
            </DashboardSection>
          </div>
        </div>
        
        {/* Main Content - Second Row - Applications Sections */}
        <div className="grid grid-cols-1 gap-6">
          {/* Applications sections removed per request */}
          {/* Both IPP and LIB Flex Applications sections are hidden */}
        </div>
        
        {/* User Stats */}
        <DashboardSection
          title="User Interaction Statistics"
          description={`Statistics for period: ${uniqueUsersStats?.summary?.start_date || dateFilter.startDate} to ${uniqueUsersStats?.summary?.end_date || dateFilter.endDate}`}
          isLoading={isLoading}
          action={
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <label htmlFor="startDate" className="text-sm">From:</label>
                <input
                  id="startDate"
                  type="date"
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="endDate" className="text-sm">To:</label>
                <input
                  id="endDate"
                  type="date"
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-1">
                <input
                  id="includeDailyStats"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={includeDailyStats}
                  onChange={(e) => setIncludeDailyStats(e.target.checked)}
                />
                <label htmlFor="includeDailyStats" className="text-sm ml-1">
                  Include Daily Data
                </label>
              </div>
              <Button 
                size="sm" 
                onClick={() => fetchUniqueUsersStats(dateFilter.startDate, dateFilter.endDate, includeDailyStats)}
                disabled={isLoadingUserStats}
              >
                {isLoadingUserStats ? 'Loading...' : 'Apply'}
              </Button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* First row - Summary metrics */}
            <div className="bg-muted/20 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-sm font-medium mb-1">Total Unique Users</h3>
              {isLoadingUserStats ? (
                <LoadingSkeleton className="h-8 w-20 mb-1" />
              ) : (
                <div className="flex items-end">
                  <span className="text-3xl font-bold mr-1">{uniqueUsersStats?.summary?.total_unique_users || 0}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Total unique customers in selected period</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg border-l-4 border-green-500">
              <h3 className="text-sm font-medium mb-1">New Users</h3>
              {isLoadingUserStats ? (
                <LoadingSkeleton className="h-8 w-20 mb-1" />
              ) : (
                <div className="flex items-end">
                  <span className="text-3xl font-bold mr-1">{uniqueUsersStats?.summary?.total_new_users || 0}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">First-time users in selected period</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="text-sm font-medium mb-1">Bot Handling Rate</h3>
              {isLoadingUserStats ? (
                <LoadingSkeleton className="h-8 w-20 mb-1" />
              ) : (
                <div className="flex items-end">
                  <span className="text-3xl font-bold mr-1">
                    {uniqueUsersStats?.summary?.total_unique_users ? 
                      Math.round((uniqueUsersStats.summary.total_bot_users / uniqueUsersStats.summary.total_unique_users) * 100) : 0}%
                  </span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Percentage of users handled by bot</p>
            </div>
            
            {/* Second row - User interaction breakdown */}
            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Automated Interaction</h3>
              {isLoadingUserStats ? (
                <LoadingSkeleton className="h-8 w-20 mb-1" />
              ) : (
                <div className="flex items-end">
                  <span className="text-2xl font-bold mr-1">{uniqueUsersStats?.summary?.total_bot_users || 0}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Users served by bot only</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Human Interaction</h3>
              {isLoadingUserStats ? (
                <LoadingSkeleton className="h-8 w-20 mb-1" />
              ) : (
                <div className="flex items-end">
                  <span className="text-2xl font-bold mr-1">{uniqueUsersStats?.summary?.total_agent_users || 0}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Users served by agents only</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Mixed Interaction</h3>
              {isLoadingUserStats ? (
                <LoadingSkeleton className="h-8 w-20 mb-1" />
              ) : (
                <div className="flex items-end">
                  <span className="text-2xl font-bold mr-1">{uniqueUsersStats?.summary?.total_mixed_users || 0}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Users served by both bot and agents</p>
            </div>
          </div>
        </DashboardSection>
        
        {/* Message Statistics */}
        <MessageStatistics />
        
        {/* Performance Stats */}
        <DashboardSection
          title="Performance Metrics"
          description="Your service metrics compared to last week"
          isLoading={isLoading}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Response Time</h3>
              {isLoading ? (
                <LoadingSkeleton className="h-8 w-20 mb-1" />
              ) : (
                <div className="flex items-end">
                  <span className="text-2xl font-bold mr-1">{performance?.responseTime.current}m</span>
                  <span className={`text-xs ${performance?.responseTime.trend === 'down' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                    {performance?.responseTime.trend === 'down' ? '↓' : '↑'} {performance?.responseTime.trendValue}%
                  </span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Average time to first response</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Resolution Rate</h3>
              {isLoading ? (
                <LoadingSkeleton className="h-8 w-20 mb-1" />
              ) : (
                <div className="flex items-end">
                  <span className="text-2xl font-bold mr-1">{performance?.resolutionRate.current}%</span>
                  <span className={`text-xs ${performance?.resolutionRate.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                    {performance?.resolutionRate.trend === 'up' ? '↑' : '↓'} {performance?.resolutionRate.trendValue}%
                  </span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Conversations successfully resolved</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Customer Satisfaction</h3>
              {isLoading ? (
                <LoadingSkeleton className="h-8 w-20 mb-1" />
              ) : (
                <div className="flex items-end">
                  <span className="text-2xl font-bold mr-1">{performance?.customerSatisfaction.current}%</span>
                  <span className={`text-xs ${performance?.customerSatisfaction.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                    {performance?.customerSatisfaction.trend === 'up' ? '↑' : '↓'} {performance?.customerSatisfaction.trendValue}%
                  </span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Based on customer feedback</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Conversations</h3>
              {isLoading ? (
                <LoadingSkeleton className="h-8 w-20 mb-1" />
              ) : (
                <div className="flex items-end">
                  <span className="text-2xl font-bold mr-1">{performance?.conversationsHandled.current}</span>
                  <span className={`text-xs ${performance?.conversationsHandled.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                    {performance?.conversationsHandled.trend === 'up' ? '↑' : '↓'} {performance?.conversationsHandled.trendValue}%
                  </span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Total conversations handled</p>
            </div>
          </div>
        </DashboardSection>
        
        {/* Agent Performance Summary */}
        <AgentPerformanceSummary 
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;