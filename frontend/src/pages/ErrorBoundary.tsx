import { Component, type ErrorInfo, type ReactNode } from 'react';
import PageLayout from './PageLayout';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
		<PageLayout>
			<div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
				<h1 className="text-title">Something went wrong</h1>
				<p className="text-subtitle my-4">Please try refreshing the page.</p>
			</div>
		</PageLayout>
      );
    }
    return this.props.children;
  }
}
