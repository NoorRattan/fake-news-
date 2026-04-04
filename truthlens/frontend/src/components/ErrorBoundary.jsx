import React, { Component } from 'react';
import { AlertOctagon } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("TruthLens ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg-base">
          <div className="clay-card p-10 max-w-md w-full text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-accent-red/10 flex items-center justify-center mb-2">
              <AlertOctagon size={48} className="text-accent-red" />
            </div>
            
            <h1 className="font-syne text-2xl font-bold text-text-primary">Something went wrong</h1>
            <p className="font-dm text-sm text-text-muted mb-2">
              An unexpected error occurred in the interface. Please refresh and try again.
            </p>
            
            {this.state.error?.message && (
              <div className="bg-bg-deep p-3 rounded-lg w-full overflow-hidden text-left mb-4">
                <code className="font-mono text-xs text-accent-red/80 break-words">
                  {this.state.error.message.length > 100 
                    ? this.state.error.message.slice(0, 100) + "..." 
                    : this.state.error.message}
                </code>
              </div>
            )}
            
            <button 
              onClick={() => window.location.reload()} 
              className="clay-btn-primary font-dm font-medium text-sm px-6 py-3 w-full"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
