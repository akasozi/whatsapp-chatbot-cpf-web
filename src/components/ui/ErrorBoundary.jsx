import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You can also log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          <h2 className="font-semibold mb-2">Something went wrong</h2>
          <p className="mb-4">{this.state.error?.toString()}</p>
          <details className="text-sm bg-card p-2 rounded">
            <summary className="cursor-pointer">View details</summary>
            <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-48">
              {this.state.errorInfo?.componentStack || "No additional information available"}
            </pre>
          </details>
          <button 
            className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;