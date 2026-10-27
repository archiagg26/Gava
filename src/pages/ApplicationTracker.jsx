import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import ProgressTracker from '../components/ProgressTracker';
import {
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  Building,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function ApplicationTracker() {
  const { t, language } = useLanguage();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#8EA66B] uppercase tracking-widest">
          {language === 'hi' ? 'चरणबद्ध प्रगति एवं स्वीकृति गाइड' : 'Progress & Sanction Timeline'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          {t('trackerTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          {t('trackerSubtitle')}
        </p>
      </div>

      {/* Warning on Middlemen & Anti-Bribery Advisory */}
      <div className="p-4 bg-[#FFDCDC] rounded-3xl border border-[#D8A2A2] text-xs text-[#612f2f] flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#914d4d] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#612f2f] block">
            {language === 'hi' ? 'दलालों और बिचौलियों से सावधान (Anti-Fraud Warning):' : 'Anti-Middlemen & Official DBT Notice:'}
          </span>
          <p className="text-[#612f2f]/90 leading-relaxed font-medium">
            {language === 'hi'
              ? 'पीएमएवाई-जी का संपूर्ण पैसा सीधे आपके आधार से जुड़े बैंक खाते में (DBT द्वारा) आता है। किसी भी प्रधान, सचिव या बिचौलिए को नकद राशि न दें। कोई भी अधिकारी आवास स्वीकृति के लिए पैसे मांगने का हकदार नहीं है।'
              : 'All PMAY-G financial grants are credited directly to your Aadhaar-linked bank account via PFMS Direct Benefit Transfer. Never pay cash to any middleman or local agent.'}
          </p>
        </div>
      </div>

      {/* Main Interactive Progress Tracker */}
      <ProgressTracker />

      {/* Detailed Stage-Wise Guidance Grid */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-stone-900">
          {language === 'hi' ? 'किस्त भुगतान एवं जियो-टैगिंग के 3 महत्वपूर्ण नियम' : '3 Key Rules for Geotagging & Installment Disbursement'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FFF9D6]/40 rounded-2xl border border-[#8EA66B]/50 space-y-2">
            <span className="text-[10px] font-bold text-[#2c3a1e] bg-[#FFF9D6] px-2 py-0.5 rounded-md border border-[#8EA66B]">
              Stage 1
            </span>
            <h4 className="font-bold text-stone-900">
              {language === 'hi' ? 'नींव (Plinth) जियो-टैग' : 'Plinth Level Geotag'}
            </h4>
            <p className="text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'पहली किस्त मिलने के बाद नींव की खुदाई और कुर्सी स्तर तक निर्माण करें। ग्राम रोजगार सहायक से आवास ऐप पर फोटो खिंचवाएं।'
                : 'After 1st installment, complete plinth foundation. Gram Rozgar Sahayak uploads verification photo on AwaasApp to release 2nd installment.'}
            </p>
          </div>

          <div className="p-4 bg-[#FFDCDC]/40 rounded-2xl border border-[#D8A2A2] space-y-2">
            <span className="text-[10px] font-bold text-[#612f2f] bg-[#FFDCDC] px-2 py-0.5 rounded-md border border-[#D8A2A2]">
              Stage 2
            </span>
            <h4 className="font-bold text-stone-900">
              {language === 'hi' ? 'लिंटेल / छत (Roof) जियो-टैग' : 'Roof Level Inspection'}
            </h4>
            <p className="text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'दीवारें और छत डलने के बाद दूसरा फोटो अपलोड होता है। इसके बाद अंतिम किस्त एवं मनरेगा मजदूरी का भुगतान पूर्ण होता है।'
                : 'Second inspection occurs once walls and roof casting are in place, unlocking the remaining grant and MGNREGA wages.'}
            </p>
          </div>

          <div className="p-4 bg-[#FFF9D6]/40 rounded-2xl border border-[#D8A2A2] space-y-2">
            <span className="text-[10px] font-bold text-[#2c3a1e] bg-[#FFF9D6] px-2 py-0.5 rounded-md border border-[#D8A2A2]">
              Stage 3
            </span>
            <h4 className="font-bold text-stone-900">
              {language === 'hi' ? 'शौचालय व पूर्णता प्रमाण' : 'Toilet & Completion Certificate'}
            </h4>
            <p className="text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'स्वच्छ भारत मिशन के तहत शौचालय का निर्माण पूरा कर ₹12,000 अतिरिक्त अनुदान का दावा करें।'
                : 'Construct the household latrine under Swachh Bharat to receive the additional ₹12,000 sanitation grant.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
