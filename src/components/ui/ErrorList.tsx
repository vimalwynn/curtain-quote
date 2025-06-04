import { AlertCircle } from 'lucide-react';
import type { ValidationError } from '../../types/validation';

interface ErrorListProps {
  errors: ValidationError[];
  className?: string;
}

export default function ErrorList({ errors, className = '' }: ErrorListProps) {
  if (errors.length === 0) return null;

  return (
    <div className={`bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 ${className}`}>
      <div className="flex items-start gap-2 text-red-700 dark:text-red-400">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          {errors.length === 1 ? (
            <p>{errors[0].message}</p>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}