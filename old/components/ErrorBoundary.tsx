import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('App crashed:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-surfaceHighlight border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30 animate-pulse">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-3 font-display tracking-wide uppercase">
              System Failure Detected
            </h1>
            <p className="text-gray-400 text-center mb-8 font-mono text-sm">
              Critical error encountered. Automatic recovery failed.
            </p>

            <div className="bg-black/50 border border-red-500/30 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto">
              <div className="text-xs text-red-400 font-mono">
                <div className="font-bold mb-2 uppercase tracking-wider">Error Details:</div>
                <div className="text-gray-300">
                  {this.state.error?.toString()}
                </div>
                {this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-gray-500 hover:text-gray-300 uppercase tracking-widest text-[10px]">
                      View Stack Trace
                    </summary>
                    <pre className="mt-2 text-gray-500 text-[10px] overflow-x-auto border-l-2 border-red-500/20 pl-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={this.handleReset}
                variant="primary"
                className="flex-1 bg-primary text-black hover:bg-primary/80 font-bold tracking-wide"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                REBOOT SYSTEM
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
