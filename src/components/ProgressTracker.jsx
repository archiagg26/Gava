import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
  HelpCircle,
  Building
} from 'lucide-react';

export default function ProgressTracker() {
  const { language } = useLanguage();
  const { milestones, toggleMilestone } = useApp();

  return (
    <div className="space-y-6">
      {/* Official FTO Tracker Guide Callout */}
      <div className="bg-[#2c3a1e] text-[#FFF9D6] p-5 rounded-3xl shadow-sm border border-[#8EA66B]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[#FFDCDC] font-bold text-xs uppercase tracking-wider">
                {language === 'hi' ? 'आधिकारिक स्थिति जांच' : 'Official Portal Verification'}
              </span>
            </div>
            <h4 className="text-base font-bold">
              {language === 'hi'
                ? 'आधिकारिक पीएमएवाई-जी पोर्टल पर अपनी किस्त व एफटीओ देखें'
                : 'Track Official FTO & Geotag Status on pmayg.nic.in'}
            </h4>
            <p className="text-xs text-[#FFF9D6]/80 max-w-xl leading-relaxed">
              {language === 'hi'
                ? 'यदि आपके पास ब्लॉक से मिला पंजीकरण नंबर है, तो आप आवास+ पर सीधे अपनी पुरानी व नई फोटो और बैंक ट्रांसफर देख सकते हैं।'
                : 'If you have received a Beneficiary Registration ID from your block, you can verify geo-tagged photos and PFMS transaction orders directly on the Ministry portal.'}
            </p>
          </div>
          <a
            href="https://pmayg.nic.in/netiay/Benificiary.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] font-bold text-xs rounded-xl shadow-xs transition shrink-0"
          >
            <span>{language === 'hi' ? 'आधिकारिक एफटीओ पोर्टल खोलें' : 'Open Official FTO Tracker'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Step by step timeline list */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-stone-900 mb-6 flex items-center justify-between">
          <span>{language === 'hi' ? 'स्थानीय तैयारी से स्वीकृति तक के 6 चरण' : '6 Key Milestones to House Sanction'}</span>
          <span className="text-xs font-semibold text-stone-500">
            {milestones.filter(m => m.status === 'completed').length} of {milestones.length} {language === 'hi' ? 'पूर्ण' : 'Completed'}
          </span>
        </h3>

        <div className="relative border-l-2 border-stone-200 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8 pb-2">
          {milestones.map((milestone, idx) => {
            const isDone = milestone.status === 'completed';
            const isInProgress = milestone.status === 'in_progress';

            return (
              <div key={milestone.id} className="relative group">
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-[35px] sm:-left-[43px] top-0.5 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                    isDone
                      ? 'bg-[#8EA66B] border-[#788f57] text-[#FFF9D6]'
                      : isInProgress
                      ? 'bg-[#FFF9D6] border-[#D8A2A2] text-[#612f2f] animate-pulse'
                      : 'bg-white border-stone-300 text-stone-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Milestone Card */}
                <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-[#FFF9D6]/30 border-[#8EA66B]/50'
                    : isInProgress
                    ? 'bg-[#FFDCDC]/30 border-[#D8A2A2]'
                    : 'bg-stone-50/60 border-stone-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-stone-900">
                      {language === 'hi' ? milestone.titleHi : milestone.title}
                    </h4>

                    {/* Status Badge */}
                    <span className={`self-start sm:self-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isDone
                        ? 'bg-[#FFF9D6] text-[#2c3a1e] border-[#8EA66B]'
                        : isInProgress
                        ? 'bg-[#FFDCDC] text-[#612f2f] border-[#D8A2A2]'
                        : 'bg-stone-100 text-stone-600 border-stone-300'
                    }`}>
                      {isDone
                        ? (language === 'hi' ? 'पूर्ण' : 'Completed')
                        : isInProgress
                        ? (language === 'hi' ? 'प्रगति में' : 'In Progress')
                        : (language === 'hi' ? 'आगामी' : 'Pending')}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    {language === 'hi' ? milestone.descriptionHi : milestone.description}
                  </p>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-stone-500 mb-3">
                    <div className="flex items-center gap-1 text-stone-600">
                      <Building className="w-3.5 h-3.5 text-stone-400" />
                      <span>{milestone.officialRole}</span>
                    </div>

                    {milestone.completedAt && (
                      <div className="flex items-center gap-1 text-[#8EA66B] font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(milestone.completedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Guidance */}
                  <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 mb-3 flex items-start gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-[#8EA66B] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-800">
                        {language === 'hi' ? 'आपके लिए अगला कदम: ' : 'Your Action: '}
                      </span>
                      <span>{language === 'hi' ? milestone.actionRequiredHi : milestone.actionRequired}</span>
                    </div>
                  </div>

                  {/* Interactive Toggle */}
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => toggleMilestone(milestone.id)}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition cursor-pointer ${
                        isDone
                          ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                          : 'bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] border-[#8EA66B] shadow-2xs'
                      }`}
                    >
                      {isDone
                        ? (language === 'hi' ? 'लंबित के रूप में चिह्नित करें' : 'Mark Incomplete')
                        : (language === 'hi' ? '✓ यह चरण पूर्ण हुआ' : '✓ Mark Step Completed')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
