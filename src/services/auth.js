import api from './api';

// Dummy credentials for development
const DUMMY_CREDENTIALS = {
  username: 'abukasozi@gmail.com',
  password: 'password123'
};

// Mock user data
const MOCK_USER = {
  id: 1,
  name: 'Agent Demo',
  email: 'agent@example.com',
  role: 'AGENT'
};

// Mock token with refresh token
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFnZW50IERlbW8iLCJpYXQiOjE1MTYyMzkwMjJ9.fake_signature';
const MOCK_REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicmVmcmVzaCI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyfQ.fake_refresh_signature';

const AuthService = {
  // Login function
  async login(username, password) {
    try {
      // Format data as x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', username);
      formData.append('password', password);
      formData.append('scope', '');
      formData.append('client_id', 'string');
      formData.append('client_secret', 'string');
      
      const response = await api.post('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        
        // Store refresh token if available
        if (response.data.refresh_token) {
          localStorage.setItem('refreshToken', response.data.refresh_token);
        }
        
        // Extract user info from token or create basic user object
        const user = {
          id: response.data.user_id || 1,
          name: username.split('@')[0], // Extract name from email
          email: username,
          role: 'AGENT'
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        return { token: response.data.access_token, user };
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw {
        response: {
          data: {
            message: error.response?.data?.detail || 'Invalid credentials'
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