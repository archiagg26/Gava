import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { schemeService } from '../services/schemeService';
import SchemeCard from '../components/SchemeCard';
import {
  Search,
  SlidersHorizontal,
  Building2,
  ExternalLink,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';

export default function SchemeExplorer() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [comparingIds, setComparingIds] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const filteredSchemes = schemeService.searchSchemes({
    query: searchQuery,
    filterType
  });

  const handleToggleCompare = (id) => {
    setComparingIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        alert(language === 'hi' ? 'आप अधिकतम 3 योजनाओं की तुलना कर सकते हैं।' : 'You can compare up to 3 schemes at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const comparedSchemesList = schemeService.getAllSchemes().filter(s => comparingIds.includes(s.id));

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#8EA66B] uppercase tracking-widest">
          {language === 'hi' ? 'आधिकारिक योजना निर्देशिका' : 'Official Schemes Directory'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          {t('schemesCatalogTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          {t('schemesCatalogSubtitle')}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchSchemesPlaceholder')}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8EA66B] focus:border-[#8EA66B]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
          {[
            { id: 'all', label: t('filterAll') },
            { id: 'central', label: t('filterCentral') },
            { id: 'state', label: t('filterState') },
            { id: 'credit', label: t('filterCredit') }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                filterType === f.id
                  ? 'bg-[#8EA66B] text-[#FFF9D6] shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-[#FFF9D6]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
          <p className="text-sm font-semibold text-stone-800">
            {language === 'hi' ? 'कोई योजना नहीं मिली।' : 'No schemes match your criteria.'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setFilterType('all'); }}
            className="mt-3 text-xs text-[#8EA66B] font-bold underline cursor-pointer"
          >
            {language === 'hi' ? 'फ़िल्टर साफ़ करें' : 'Clear search and filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map(scheme => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              isComparing={comparingIds.includes(scheme.id)}
              onToggleCompare={handleToggleCompare}
              onSelectDetails={(s) => setSelectedScheme(s)}
            />
          ))}
        </div>
      )}

      {/* Floating Compare Bar */}
      {comparingIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#2c3a1e] text-[#FFF9D6] px-6 py-3.5 rounded-2xl shadow-xl border border-[#8EA66B] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <span className="text-xs font-bold">
            {comparingIds.length} {language === 'hi' ? 'योजनाएं चुनी गईं' : 'schemes selected'}
          </span>
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-4 py-2 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] text-xs font-bold rounded-xl shadow-xs transition"
          >
            {t('compareBtn')}
          </button>
          <button
            onClick={() => setComparingIds([])}
            className="text-[#FFDCDC] hover:text-white text-xs underline font-medium"
          >
            {language === 'hi' ? 'रद्द करें' : 'Clear'}
          </button>
        </div>
      )}

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-[#D8A2A2]">
            <button
              onClick={() => setSelectedScheme(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2c3a1e] bg-[#FFF9D6] px-2.5 py-1 rounded-full border border-[#8EA66B]">
                {selectedScheme.category}
              </span>
              <h2 className="text-xl font-bold text-stone-900 mt-1">
                {language === 'hi' ? selectedScheme.nameHi : selectedScheme.name}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'hi' ? selectedScheme.authorityHi : selectedScheme.authority}
              </p>
            </div>

            {/* Assistance breakdown */}
            <div className="p-4 bg-[#FFF9D6] rounded-2xl border border-[#D8A2A2] mb-6 space-y-2">
              <span className="text-xs font-bold text-[#612f2f] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#914d4d]" />
                {language === 'hi' ? 'कुल प्रत्यक्ष सरकारी सहायता' : 'Total Financial Benefit Package'}
              </span>
              <p className="text-2xl font-black text-[#2c3a1e]">
                {selectedScheme.totalBenefitEstimate}
              </p>
              {selectedScheme.financialAssistance && (
                <div className="pt-2 text-xs text-stone-700 space-y-1 border-t border-[#D8A2A2]/50">
                  {Object.entries(selectedScheme.financialAssistance).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-bold">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Target & Applicability */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-stone-900 mb-1">
                  {language === 'hi' ? 'लक्षित लाभार्थी:' : 'Target Beneficiaries:'}
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  {language === 'hi' ? selectedScheme.targetBeneficiariesHi : selectedScheme.targetBeneficiaries}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">
                  {language === 'hi' ? 'भौगोलिक विस्तार:' : 'Geographic Applicability:'}
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  {language === 'hi' ? selectedScheme.applicabilityHi : selectedScheme.applicability}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-2">
                  {language === 'hi' ? 'पात्रता की मुख्य शर्तें:' : 'Eligibility Prerequisites:'}
                </h4>
                <div className="space-y-1.5">
                  {selectedScheme.eligibilitySummary.map((el, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-stone-600">
                      <CheckCircle2 className="w-4 h-4 text-[#8EA66B] shrink-0 mt-0.5" />
                      <span>{el}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-2">
                  {language === 'hi' ? 'आवश्यक दस्तावेज़:' : 'Required Documentation Checklist:'}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-stone-600">
                  {selectedScheme.requiredDocuments.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2 text-[11px] text-stone-500">
                <CalendarCheck className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{selectedScheme.lastVerifiedDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
              <a
                href={selectedScheme.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] rounded-xl text-xs font-bold shadow-xs transition"
              >
                <span>{t('officialPortalBtn')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-[#D8A2A2]">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-stone-900 mb-2">
              {language === 'hi' ? 'योजनाओं की तुलना' : 'Side-by-Side Scheme Comparison'}
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              {language === 'hi'
                ? 'सरकारी अनुदान, ब्याज सब्सिडी और दस्तावेज़ी नियमों की सीधी तुलना।'
                : 'Compare assistance amounts, criteria, and official portals side-by-side.'}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-[#FAF7EE]">
                    <th className="p-3 font-bold text-stone-600 w-1/4">Parameters</th>
                    {comparedSchemesList.map(s => (
                      <th key={s.id} className="p-3 font-bold text-stone-900">
                        {language === 'hi' ? s.nameHi : s.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="p-3 font-semibold text-stone-600">Scheme Type</td>
                    {comparedSchemesList.map(s => (
                      <td key={s.id} className="p-3 capitalize font-medium">{s.category}</td>
                    ))}
                  </tr>
                  <tr className="bg-[#FFF9D6]/40">
                    <td className="p-3 font-bold text-[#612f2f]">Total Benefit</td>
                    {comparedSchemesList.map(s => (
                      <td key={s.id} className="p-3 font-black text-[#2c3a1e]">{s.totalBenefitEstimate}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-600">Target Group</td>
                    {comparedSchemesList.map(s => (
                      <td key={s.id} className="p-3 text-stone-600">{language === 'hi' ? s.targetBeneficiariesHi : s.targetBeneficiaries}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-600">Official Portal</td>
                    {comparedSchemesList.map(s => (
                      <td key={s.id} className="p-3">
                        <a href={s.officialPortalUrl} target="_blank" rel="noopener noreferrer" className="text-[#8EA66B] underline font-bold flex items-center gap-1">
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-5 py-2.5 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] rounded-xl text-xs font-bold"
              >
                {language === 'hi' ? 'समझ गया' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
