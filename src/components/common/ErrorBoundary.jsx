import React from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
            <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-xs">
              <FiAlertTriangle />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <FiRefreshCw /> Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                Reset App Data
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
