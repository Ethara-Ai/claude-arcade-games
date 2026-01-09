import { Component } from 'react';
import PropTypes from 'prop-types';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // You could also log the error to an error reporting service here
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    if (this.props.onGoHome) {
      this.props.onGoHome();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="glass-panel-dark p-8 max-w-2xl w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                <FiAlertTriangle className="w-10 h-10 text-red-500" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h1>

            <p className="text-gray-300 mb-6">
              {this.props.fallbackMessage ||
                "We're sorry, but something unexpected happened. Please try again."}
            </p>

            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={this.handleReset}
                className="btn-glass text-white flex items-center gap-2"
                aria-label="Try again"
              >
                <FiRefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>

              {this.props.onGoHome && (
                <button
                  onClick={this.handleGoHome}
                  className="btn-glass text-white flex items-center gap-2"
                  aria-label="Go to home"
                >
                  <FiHome className="w-5 h-5" />
                  <span>Go Home</span>
                </button>
              )}
            </div>

            {/* Show error details only in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mt-8">
                <summary className="cursor-pointer text-accent-pink font-semibold mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="bg-black/50 p-4 rounded-lg overflow-auto max-h-64">
                  <p className="text-red-400 font-mono text-sm mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-gray-400 text-xs overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackMessage: PropTypes.string,
  onError: PropTypes.func,
  onReset: PropTypes.func,
  onGoHome: PropTypes.func,
};

export default ErrorBoundary;
