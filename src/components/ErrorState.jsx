import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred while processing your request.',
  onRetry
}) {
  return (
    <div className="p-6 bg-red-50/60 rounded-2xl border border-red-200 text-center max-w-md mx-auto my-6">
      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-red-950">{title}</h3>
      <p className="text-xs text-red-700 mt-1 mb-4 leading-relaxed">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
