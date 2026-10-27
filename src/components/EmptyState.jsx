import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon: Icon = FolderOpen
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-2xl border border-dashed border-stone-300">
      <div className="p-4 bg-amber-50 rounded-2xl text-amber-700 mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-stone-900">{title}</h3>
      <p className="text-xs text-stone-500 max-w-sm mt-1 mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-medium rounded-xl shadow-xs transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
