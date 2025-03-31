import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import socketService from './services/socket';
import './index.css';
import App from './App.jsx';

// Initialize socket if user is logged in
if (localStorage.getItem('token')) {
  socketService.init();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);