import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import ChatAssistant from '../components/ChatAssistant';
import {
  Bot,
  Sparkles,
  HelpCircle,
  FileQuestion,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function AIHelp() {
  const { t, language } = useLanguage();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#8EA66B] uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#914d4d]" />
          <span>{language === 'hi' ? '24/7 एआई ग्रामीण आवास सलाहकार' : '24/7 AI Rural Housing Advisor'}</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          {t('aiChatTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          {t('aiChatSubtitle')}
        </p>
      </div>

      {/* Main Full-Height Chat Component */}
      <div className="max-w-4xl mx-auto">
        <ChatAssistant fullHeight={true} />
      </div>

      {/* Grounding & Accuracy Disclaimer */}
      <div className="max-w-4xl mx-auto p-4 bg-[#FFF9D6] rounded-3xl border border-[#D8A2A2] text-xs text-[#2c3a1e] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#8EA66B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#2c3a1e] block">
            {language === 'hi' ? 'मार्गदर्शन की प्रामाणिकता' : 'Informational Grounding Notice'}
          </span>
          <p className="leading-relaxed text-stone-700">
            {language === 'hi'
              ? 'यह एआई सहायक केवल ग्रामीण विकास मंत्रालय (MoRD) के प्रकाशित PMAY-G दिशानिर्देशों और भू-राजस्व नियमों के अनुसार सलाह देता है। यह किसी भी आवेदन की कानूनी या आधिकारिक स्वीकृति की गारंटी नहीं देता।'
              : 'This AI assistant is strictly grounded in official PMAY-G operational guidelines and state land documentation rules. It provides advisory support and cannot officially authorize a grant or file.'}
          </p>
        </div>
      </div>
    </div>
  );
}
