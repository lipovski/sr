interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <div className="max-w-2xl mx-auto p-6">
    <div
      data-testid="error-container"
      className="bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <p data-testid="error-message" className="text-red-600 text-center">
        {error}
      </p>
      <button
        data-testid="retry-button"
        onClick={() => window.location.reload()}
        className="mt-4 mx-auto block px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);
