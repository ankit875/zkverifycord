'use client';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
          <p className="mt-2 text-gray-600">{error.message}</p>
          <button
            onClick={reset}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}