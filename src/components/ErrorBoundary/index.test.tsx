import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '.';

jest.mock('./styles', () => ({
  StyledErrorContainer: jest.fn(({ children }) => (
    <div data-testid="error-container">{children}</div>
  )),
  StyledErrorTitle: jest.fn(({ children }) => <h2 data-testid="error-title">{children}</h2>),
  StyledErrorMessage: jest.fn(({ children }) => <p data-testid="error-message">{children}</p>),
  StyledErrorDetailsPre: jest.fn(({ children }) => (
    <pre data-testid="error-details">{children}</pre>
  )),
  StyledTryAgainButton: jest.fn(({ children, onClick }) => (
    <button data-testid="try-again-button" onClick={onClick}>
      {children}
    </button>
  )),
}));

const ProblemChild = () => {
  throw new Error('Test error from child');
};

const GoodChild = () => <div data-testid="good-child">Everything is fine</div>;

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );
    expect(screen.getByTestId('good-child')).toBeInTheDocument();
    expect(screen.queryByTestId('error-container')).not.toBeInTheDocument();
  });

  it('renders error UI when a child component throws an error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByTestId('error-container')).toBeInTheDocument();
    expect(screen.getByTestId('error-title')).toHaveTextContent('Application Error');
    expect(screen.getByTestId('error-message')).toHaveTextContent('Oops! Something went wrong.');
    expect(screen.getByTestId('error-details')).toHaveTextContent('Error: Test error from child');
    expect(screen.getByTestId('try-again-button')).toBeInTheDocument();
    expect(screen.queryByTestId('good-child')).not.toBeInTheDocument();
  });

  it('displays componentStack in error details if available', () => {
    const TestComponentWithErrorBoundary = () => {
      const [hasError, setHasError] = useState(false);
      if (hasError) {
        throw new Error('Simulated error for stack trace');
      }
      return <button onClick={() => setHasError(true)}>Trigger Error</button>;
    };

    render(
      <ErrorBoundary>
        <TestComponentWithErrorBoundary />
      </ErrorBoundary>
    );
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    const errorDetails = screen.getByTestId('error-details');
    expect(errorDetails).toBeInTheDocument();
    expect(errorDetails.textContent).toContain('Component Stack:');
  });
});
