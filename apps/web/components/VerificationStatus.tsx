import { ReactNode } from 'react';

interface StatusProps {
  children: ReactNode;
  type: 'success' | 'error' | 'loading';
  message: string;
}

export function VerificationStatus({ children, type, message }: StatusProps) {
  const bgColor = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    loading: 'bg-blue-100',
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    loading: 'text-blue-800',
  }[type];

  return (
    <div className={`rounded-md ${bgColor} p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {type === 'success' && (
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {type === 'error' && (
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          {type === 'loading' && (
            <svg className="h-5 w-5 text-blue-400 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${textColor}`}>
            {children}
          </h3>
          <div className={`mt-2 text-sm ${textColor}`}>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}