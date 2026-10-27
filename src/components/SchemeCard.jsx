import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CalendarCheck
} from 'lucide-react';

export default function SchemeCard({
  scheme,
  isComparing = false,
  onToggleCompare,
  onSelectDetails
}) {
  const { language } = useLanguage();

  const typeBadges = {
    central: {
      label: language === 'hi' ? 'केंद्रीय योजना' : 'Central Scheme',
      color: 'bg-[#FFF9D6] text-[#2c3a1e] border-[#8EA66B]'
    },
    state: {
      label: language === 'hi' ? 'राज्य योजना' : 'State Initiative',
      color: 'bg-[#FFDCDC] text-[#612f2f] border-[#D8A2A2]'
    },
    credit: {
      label: language === 'hi' ? 'ब्याज सब्सिडी' : 'Interest Subsidy',
      color: 'bg-blue-50 text-blue-900 border-blue-200'
    },
  };

  const badge = typeBadges[scheme.type] || typeBadges.central;

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs hover:shadow-md hover:border-[#D8A2A2] transition-all duration-200 flex flex-col justify-between relative group">
      {/* Top Bar: Authority and Type */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
            {badge.label}
          </span>
          {onToggleCompare && (
            <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isComparing}
                onChange={() => onToggleCompare(scheme.id)}
                className="w-3.5 h-3.5 text-[#8EA66B] rounded-xs border-stone-300 focus:ring-[#8EA66B] cursor-pointer"
              />
              <span className="text-[11px] font-medium">{language === 'hi' ? 'तुलना करें' : 'Compare'}</span>
            </label>
          )}
        </div>

        {/* Scheme Name */}
        <h3 className="text-base font-bold text-stone-900 group-hover:text-[#2c3a1e] transition-colors">
          {language === 'hi' ? scheme.nameHi : scheme.name}
        </h3>
        <p className="text-[11px] text-stone-500 mt-0.5 font-medium">
          {language === 'hi' ? scheme.authorityHi : scheme.authority}
        </p>

        {/* Total Financial Assistance Pill */}
        <div className="my-3 p-3 bg-[#FFF9D6] rounded-2xl border border-[#D8A2A2]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#612f2f] font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#914d4d]" />
              {language === 'hi' ? 'कुल अनुमानित सहायता:' : 'Total Financial Assistance:'}
            </span>
          </div>
          <p className="text-sm font-black text-[#2c3a1e] mt-1">
            {scheme.totalBenefitEstimate}
          </p>
        </div>

        {/* Purpose / Target Beneficiaries */}
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
          {language === 'hi' ? scheme.targetBeneficiariesHi : scheme.targetBeneficiaries}
        </p>

        {/* Key Eligibility Bullets */}
        <div className="space-y-1.5 mb-4">
          <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
            {language === 'hi' ? 'प्रमुख पात्रता शर्तें:' : 'Key Eligibility Highlights:'}
          </p>
          {scheme.eligibilitySummary.slice(0, 2).map((item, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-stone-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8EA66B] shrink-0 mt-0.5" />
              <span className="line-clamp-2">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-stone-100 space-y-3">
        {/* Verification Date */}
        <div className="flex items-center gap-1 text-[10px] text-stone-500">
          <CalendarCheck className="w-3 h-3 text-stone-400 shrink-0" />
          <span className="truncate">{scheme.lastVerifiedDate}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {onSelectDetails && (
            <button
              onClick={() => onSelectDetails(scheme)}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-stone-100 hover:bg-[#FFF9D6] text-stone-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <span>{language === 'hi' ? 'पूर्ण विवरण देखें' : 'View Full Details'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8EA66B]" />
            </button>
          )}

          <a
            href={scheme.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-[#FFF9D6] hover:bg-[#FFDCDC] text-[#2c3a1e] border border-[#D8A2A2] rounded-xl transition"
            title={language === 'hi' ? 'आधिकारिक सरकारी पोर्टल खोलें' : 'Open Official Govt Portal'}
          >
            <ExternalLink className="w-4 h-4 text-[#8EA66B]" />
          </a>
        </div>
      </div>
    </div>
  );
}
