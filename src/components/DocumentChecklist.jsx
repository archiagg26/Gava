import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';

export default function DocumentChecklist({ onSelectDoc }) {
  const { language } = useLanguage();
  const { documents, documentReadiness, missingDocs } = useApp();

  const totalRequired = 7;
  const readyCount = Object.values(documents).filter(d => d.status === 'ready').length;
  const reviewCount = Object.values(documents).filter(d => d.status === 'review').length;
  const missingCount = missingDocs.length;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        <div>
          <span className="text-xs font-bold text-[#8EA66B] uppercase tracking-wider">
            {language === 'hi' ? 'दस्तावेज़ पूर्णता स्तर' : 'Readiness Gauge'}
          </span>
          <h3 className="text-2xl font-black text-stone-900 mt-0.5">
            {documentReadiness}% {language === 'hi' ? 'तैयार' : 'Complete'}
          </h3>
        </div>

        {/* Status mini tags */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-[#FFF9D6] text-[#2c3a1e] rounded-xl border border-[#8EA66B] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8EA66B]" />
            <span>{readyCount} {language === 'hi' ? 'तैयार' : 'Ready'}</span>
          </span>
          {reviewCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-[#FFDCDC] text-[#612f2f] rounded-xl border border-[#D8A2A2] font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-[#914d4d]" />
              <span>{reviewCount} {language === 'hi' ? 'जांचें' : 'Review'}</span>
            </span>
          )}
          {missingCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-stone-100 text-stone-700 rounded-xl border border-stone-200 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-stone-400" />
              <span>{missingCount} {language === 'hi' ? 'लंबित' : 'Missing'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
          <div
            className="h-full rounded-full transition-all duration-500 bg-[#8EA66B]"
            style={{ width: `${documentReadiness}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-stone-500 mt-2 font-medium">
          <span>0%</span>
          <span>50% (Basic Eligibility)</span>
          <span className="font-bold text-[#8EA66B]">100% (Gram Sabha Ready)</span>
        </div>
      </div>

      {/* Smart Tip */}
      <div className="mt-5 p-3.5 bg-[#FFF9D6] rounded-2xl border border-[#D8A2A2] text-xs text-[#612f2f] flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#914d4d] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {language === 'hi'
            ? 'सुझाव: खतौनी और आधार में नाम की स्पेलिंग समान होना सबसे महत्वपूर्ण है। छोटी सी त्रुटि भी सरकारी बैंक ट्रांसफर (DBT) में बाधा बन सकती है।'
            : 'Tip: Ensure your name spelling matches between your Khatauni (land record) and Aadhaar. Discrepancies cause delays in PFMS bank disbursements.'}
        </p>
      </div>
    </div>
  );
}
