import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Conversations from './pages/Conversations';
import ConversationView from './pages/ConversationView';
import Applications from './pages/Applications';
import ApplicationDetails from './pages/ApplicationDetails';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-4xl font-bold text-primary">404</h1>
    <p className="mt-2 text-muted-foreground">Page Not Found</p>
    <a href="/" className="mt-4 text-primary hover:underline">
      Return to Dashboard
    </a>
  </div>
);

function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  // Protected route component to prevent unauthorized access
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={
            isLoggedIn ? <Navigate to="/" /> : <Login />
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/conversations" element={
            <ProtectedRoute>
              <Conversations />
            </ProtectedRoute>
          } />
          
          <Route path="/conversations/:id" element={
            <ProtectedRoute>
              <ConversationView />
            </ProtectedRoute>
          } />
          
          <Route path="/applications" element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          } />
          
          <Route path="/applications/:id" element={
            <ProtectedRoute>
              <ApplicationDetails />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;