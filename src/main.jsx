import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("GlobalErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '60px auto',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          border: '1px solid #E2E6D8'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px', color: '#141E14' }}>
            StakDock Application Notice
          </h2>
          <p style={{ color: '#536253', marginBottom: '20px', fontSize: '0.95rem', background: '#F6F7F2', padding: '14px', borderRadius: '12px' }}>
            {this.state.error?.message || this.state.error?.toString() || "A temporary browser rendering state occurred."}
          </p>
          <button 
            onClick={() => {
              try { localStorage.clear(); } catch(e){}
              window.location.hash = '';
              window.location.reload();
            }} 
            style={{
              background: '#82A735',
              color: '#FFFFFF',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '9999px',
              fontWeight: '800',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(130, 167, 53, 0.3)'
            }}
          >
            Refresh StakDock
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const mount = () => {
  const container = document.getElementById('root');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <GlobalErrorBoundary>
          <App />
        </GlobalErrorBoundary>
      </React.StrictMode>
    );
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
