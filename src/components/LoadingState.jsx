import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading details...', messageHi = 'जानकारी लोड हो रही है...', isHindi = false }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/60 rounded-2xl border border-stone-200">
      <div className="p-3 bg-emerald-50 rounded-full text-emerald-800 mb-3 animate-spin">
        <Loader2 className="w-6 h-6" />
      </div>
      <p className="text-sm font-medium text-stone-700">
        {isHindi ? messageHi : message}
      </p>
      <p className="text-xs text-stone-400 mt-1">
        {isHindi ? 'कृपया प्रतीक्षा करें...' : 'Please wait a moment...'}
      </p>
    </div>
  );
}
