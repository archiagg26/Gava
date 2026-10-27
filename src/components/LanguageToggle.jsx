import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Languages } from 'lucide-react';

export default function LanguageToggle({ className = '' }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border shadow-2xs cursor-pointer ${
        language === 'hi'
          ? 'bg-[#FFF9D6] text-[#2c3a1e] border-[#D8A2A2] hover:bg-[#FFDCDC]'
          : 'bg-white text-[#2c3a1e] border-[#8EA66B] hover:bg-[#FFF9D6]'
      } ${className}`}
      title={language === 'hi' ? 'Switch to English' : 'हिन्दी में बदलें'}
      aria-label="Toggle Language"
    >
      <Languages className="w-3.5 h-3.5 text-[#8EA66B]" />
      <span>{language === 'hi' ? 'हिन्दी | EN' : 'EN | हिन्दी'}</span>
    </button>
  );
}
