import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  badgeText,
  badgeVariant = 'neutral',
  onClick,
  className = ''
}) {
  const variantStyles = {
    default: 'bg-white border-stone-200 text-stone-900',
    olive: 'bg-[#8EA66B] text-[#FFF9D6] border-[#788f57]',
    forest: 'bg-[#2c3a1e] text-[#FFF9D6] border-[#3B4D27]',
    cream: 'bg-[#FFF9D6] border-[#D8A2A2] text-[#2c3a1e]',
    rose: 'bg-[#FFDCDC] border-[#D8A2A2] text-[#612f2f]',
  };

  const badgeStyles = {
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    success: 'bg-[#FFF9D6] text-[#2c3a1e] border-[#8EA66B]',
    warning: 'bg-[#FFDCDC] text-[#612f2f] border-[#D8A2A2]',
    info: 'bg-blue-50 text-blue-900 border-blue-200',
  };

  const isDark = variant === 'olive' || variant === 'forest';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 border shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={`text-xs font-semibold uppercase tracking-wider ${
            isDark ? 'text-[#FFF9D6]/80' : 'text-stone-500'
          }`}>
            {title}
          </p>
          <h3 className="text-2xl font-black tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${
            isDark
              ? 'bg-black/15 text-[#FFF9D6]'
              : 'bg-[#FFF9D6] text-[#8EA66B] border border-[#D8A2A2]/40'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || badgeText) && (
        <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-black/5">
          {subtitle && (
            <p className={`text-xs ${
              isDark ? 'text-[#FFF9D6]/90' : 'text-stone-600'
            }`}>
              {subtitle}
            </p>
          )}
          {badgeText && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyles[badgeVariant] || badgeStyles.neutral}`}>
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
