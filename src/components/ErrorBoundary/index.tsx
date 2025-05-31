import { Component, type ErrorInfo, type ReactNode } from 'react';
import {
  StyledErrorContainer,
  StyledErrorDetailsPre,
  StyledErrorMessage,
  StyledErrorTitle,
  StyledTryAgainButton,
} from './styles';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(_: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
  }

  private handleTryAgain = () => {
    location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <StyledErrorContainer>
          <StyledErrorTitle>Application Error</StyledErrorTitle>
          <StyledErrorMessage>Oops! Something went wrong.</StyledErrorMessage>
          {this.state.error && (
            <StyledErrorDetailsPre>
              {this.state.error.toString()}
              {this.state.errorInfo && this.state.errorInfo.componentStack && (
                <>
                  <br />
                  <br />
                  <strong>Component Stack:</strong>
                  {this.state.errorInfo.componentStack}
                </>
              )}
            </StyledErrorDetailsPre>
          )}
          <StyledTryAgainButton onClick={this.handleTryAgain}>Try Again</StyledTryAgainButton>
        </StyledErrorContainer>
      );
    }

    return this.props.children;
  }
}
