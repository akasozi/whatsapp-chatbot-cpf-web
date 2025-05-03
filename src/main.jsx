import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import store from './redux/store';
import socketService from './services/socket';
import { fetchUnreadStats } from './redux/slices/conversationsSlice';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Import test utilities (only in development mode)
import './utils/testNotification';

// App wrapper to handle global effects
const AppWrapper = () => {
  const dispatch = useDispatch();
  
  // Initialize socket and fetch initial unread stats when app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Initialize WebSocket connection
      socketService.init();
      
      // Fetch initial unread message statistics
      dispatch(fetchUnreadStats());
      
      // Set up periodic refresh of unread stats every 60 seconds
      const interval = setInterval(() => {
        dispatch(fetchUnreadStats());
      }, 60000);
      
      // Clean up on unmount
      return () => {
        clearInterval(interval);
        socketService.disconnect();
      };
    }
  }, [dispatch]);
  
  return <App />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <AppWrapper />
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
);