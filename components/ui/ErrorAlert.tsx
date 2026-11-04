import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-rose-50/90 border border-rose-200/90 rounded-2xl p-6 text-rose-900 shadow-xs">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-rose-950">Generation Failed</h3>
          <p className="text-xs text-rose-700 mt-1 leading-relaxed">{message}</p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
            <span className="text-[11px] text-rose-600/80">
              Your prompt and options were preserved.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
