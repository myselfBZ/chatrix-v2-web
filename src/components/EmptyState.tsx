interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
};