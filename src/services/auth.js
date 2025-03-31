import api from './api';

// Dummy credentials for development
const DUMMY_CREDENTIALS = {
  username: 'agent',
  password: 'password'
};

// Mock user data
const MOCK_USER = {
  id: 1,
  name: 'Agent Demo',
  email: 'agent@example.com',
  role: 'AGENT'
};

// Mock token
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFnZW50IERlbW8iLCJpYXQiOjE1MTYyMzkwMjJ9.fake_signature';

const AuthService = {
  // Login function
  async login(username, password) {
    // For development: Check if using dummy credentials
    if (username === DUMMY_CREDENTIALS.username && password === DUMMY_CREDENTIALS.password) {
      // Use mock data instead of API call
      const mockResponse = {
        token: MOCK_TOKEN,
        refreshToken: 'mock-refresh-token',
        user: MOCK_USER
      };
      
      // Store in localStorage
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      return mockResponse;
    }
    
    // If not using dummy credentials, proceed with actual API call
    try {
      const response = await api.post('/auth/token', { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // For development: Display a helpful message
      throw {
        response: {
          data: {
            message: 'Invalid credentials. Try using username: agent, password: password'
          }
        }
      };
    }
  },

  // Logout function
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Register function (if needed)
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Reset password
  async resetPassword(email) {
    try {
      const response = await api.post('/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update password using reset token
  async updatePassword(token, newPassword) {
    try {
      const response = await api.post('/auth/update-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default AuthService;