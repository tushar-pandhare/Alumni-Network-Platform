import React from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

/**
 * Production-grade React Error Boundary.
 * Catches any render/lifecycle errors in the subtree.
 * Shows a friendly fallback UI instead of a white screen crash.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production you'd send this to an error tracking service (Sentry, etc.)
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/home";
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center px-4">
          <div className="max-w-lg w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 border border-red-400/40 rounded-full mb-6">
              <FaExclamationTriangle className="text-red-400 text-4xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
            <p className="text-indigo-200 mb-6">
              An unexpected error occurred. Please try reloading the page.
            </p>

            {isDev && this.state.error && (
              <details className="text-left bg-black/30 rounded-xl p-4 mb-6 text-xs text-red-300 overflow-auto max-h-48">
                <summary className="cursor-pointer font-mono mb-2 text-red-400">
                  Error details (dev only)
                </summary>
                <pre className="whitespace-pre-wrap break-all">
                  {this.state.error.toString()}
                  {"\n\n"}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-all shadow-lg"
            >
              <FaRedo />
              Go to Homepage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
