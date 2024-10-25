export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <div
      data-testid="loading-spinner"
      className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
    />
  </div>
);
