import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import store from './redux/store';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgb(var(--surface-2))',
              color: 'rgb(var(--text-1))',
              border: '1px solid rgb(var(--border))',
              borderRadius: '0.75rem',
              fontFamily: 'Manrope, system-ui, sans-serif',
              fontSize: '0.875rem',
              boxShadow: '0 12px 32px -16px rgb(0 0 0 / 0.5)',
            },
            success: { iconTheme: { primary: 'rgb(var(--accent))', secondary: 'rgb(var(--surface-2))' } },
            error: { iconTheme: { primary: 'rgb(var(--danger))', secondary: 'rgb(var(--surface-2))' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
