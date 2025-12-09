import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
      <Toaster 
        position="top-center"  // Middle of screen
        toastOptions={{
          duration: 3000,      // Auto-dismiss after 3 seconds
        }}
      />
    </ThemeProvider>
  </React.StrictMode>,
);