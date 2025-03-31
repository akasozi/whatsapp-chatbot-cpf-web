import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate('/login');
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow h-full transition-width duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <h1 className={`text-xl font-bold text-primary ${!isSidebarOpen && 'hidden'}`}>Agent Portal</h1>
            {!isSidebarOpen && <span className="text-xl font-bold text-primary">AP</span>}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {isSidebarOpen && <span className="ml-3">Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link to="/conversations" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {isSidebarOpen && <span className="ml-3">Conversations</span>}
                </Link>
              </li>
              <li>
                <Link to="/applications" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {isSidebarOpen && <span className="ml-3">IPP Applications</span>}
                </Link>
              </li>
              <li>
                <Link to="/lib-applications" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {isSidebarOpen && <span className="ml-3">LIB Flex Applications</span>}
                </Link>
              </li>
              {/* Add more navigation items here */}
            </ul>
          </nav>

          {/* Toggle Button & User Profile */}
          <div className="p-4 border-t">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-200 w-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              {isSidebarOpen && <span className="ml-3">Collapse</span>}
            </button>

            {isSidebarOpen && (
              <div className="mt-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                    <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Agent Portal</h2>
            {/* Add notification bell, settings, etc. here */}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;