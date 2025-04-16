import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications, updateFilters, selectFilteredApplications } from '../redux/slices/applicationsSlice';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

const Applications = () => {
  const dispatch = useDispatch();
  const applications = useSelector(selectFilteredApplications);
  const loadingStatus = useSelector((state) => state.applications.loadingStatus.fetchApplications);
  const isLoading = loadingStatus === 'pending';
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleStatusFilter = (status) => {
    if (status === 'all') {
      dispatch(updateFilters({ status: null }));
      setActiveTab('all');
    } else {
      dispatch(updateFilters({ status }));
      setActiveTab(status);
    }
  };

  const handleDateFilter = (e) => {
    dispatch(updateFilters({ dateRange: e.target.value || null }));
  };

  const handleSearch = (e) => {
    dispatch(updateFilters({ searchTerm: e.target.value }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING_DOCUMENTS':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-purple-100 text-purple-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">IPP Application Forms</h1>
        <p className="text-gray-600">
          View and manage Individual Pension Plan applications submitted through WhatsApp
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Status filter tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1">
            <button
              onClick={() => handleStatusFilter('all')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'all'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter('SUBMITTED')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'SUBMITTED'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Submitted
            </button>
            <button
              onClick={() => handleStatusFilter('PENDING_DOCUMENTS')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'PENDING_DOCUMENTS'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Pending Docs
            </button>
            <button
              onClick={() => handleStatusFilter('UNDER_REVIEW')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'UNDER_REVIEW'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Under Review
            </button>
            <button
              onClick={() => handleStatusFilter('APPROVED')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'APPROVED'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Approved
            </button>
          </div>

          {/* Other filters */}
          <div className="flex gap-2">
            <select
              onChange={handleDateFilter}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              defaultValue=""
            >
              <option value="">All Time</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">This Week</option>
              <option value="MONTH">This Month</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Search applications..."
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm w-full"
                onChange={handleSearch}
              />
              <svg
                className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filter criteria.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Form Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Submission Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.customer.phone_number}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.form_name}</div>
                    <div className="text-xs text-gray-500">{application.form_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        application.status
                      )}`}
                    >
                      {application.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(application.submission_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/applications/${application.id}`}
                      className="text-primary hover:text-primary-dark mr-3"
                    >
                      View
                    </Link>
                    <Link
                      to={`/conversations/${application.conversation_id}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Chat
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applications;