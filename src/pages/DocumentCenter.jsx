import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import DocumentUploader from '../components/DocumentUploader';
import DocumentChecklist from '../components/DocumentChecklist';
import { documentService } from '../services/documentService';
import {
  ShieldCheck,
  Sparkles,
  FileText,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function DocumentCenter() {
  const { t, language } = useLanguage();
  const { documents, uploadDocument, removeDocument } = useApp();
  const [filter, setFilter] = useState('all');

  const docDefs = documentService.getRequiredDocsList();

  const filteredDefs = docDefs.filter(doc => {
    if (filter === 'mandatory') return doc.mandatory;
    if (filter === 'missing') {
      const userDoc = documents[doc.id];
      return !userDoc || userDoc.status === 'missing';
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#8EA66B] uppercase tracking-widest">
          {language === 'hi' ? 'दस्तावेज़ सत्यापन एवं तैयारी' : 'Smart Document Readiness'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          {t('docCenterTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          {t('docCenterSubtitle')}
        </p>
      </div>

      {/* Privacy Guarantee Box */}
      <div className="p-4 bg-[#FFF9D6] rounded-3xl border border-[#D8A2A2] flex items-start gap-3 text-xs text-[#612f2f]">
        <ShieldCheck className="w-5 h-5 text-[#8EA66B] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block">
            {language === 'hi' ? 'गोपनीयता और डेटा सुरक्षा आश्वासन' : 'Zero Public Storage Guarantee'}
          </span>
          <p className="text-stone-700 leading-relaxed">
            {t('privacyGuarantee')}
          </p>
        </div>
      </div>

      {/* Document Checklist Overview Banner */}
      <DocumentChecklist />

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filter === 'all'
                ? 'bg-[#8EA66B] text-[#FFF9D6] shadow-2xs'
                : 'bg-white text-stone-700 hover:bg-[#FFF9D6] border border-stone-200'
            }`}
          >
            {language === 'hi' ? 'सभी 7 दस्तावेज़' : 'All 7 Documents'}
          </button>
          <button
            onClick={() => setFilter('mandatory')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filter === 'mandatory'
                ? 'bg-[#8EA66B] text-[#FFF9D6] shadow-2xs'
                : 'bg-white text-stone-700 hover:bg-[#FFF9D6] border border-stone-200'
            }`}
          >
            {language === 'hi' ? 'केवल अनिवार्य' : 'Mandatory Only'}
          </button>
          <button
            onClick={() => setFilter('missing')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filter === 'missing'
                ? 'bg-[#8EA66B] text-[#FFF9D6] shadow-2xs'
                : 'bg-white text-stone-700 hover:bg-[#FFF9D6] border border-stone-200'
            }`}
          >
            {language === 'hi' ? 'लंबित कागज़ात' : 'Missing / Incomplete'}
          </button>
        </div>

        <span className="text-xs text-stone-500 hidden sm:block">
          {filteredDefs.length} {language === 'hi' ? 'दस्तावेज़ दिखाए गए' : 'items shown'}
        </span>
      </div>

      {/* Documents Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDefs.map(docDef => {
          const currentDoc = documents[docDef.id];
          return (
            <DocumentUploader
              key={docDef.id}
              docDef={docDef}
              currentDoc={currentDoc}
              onUpload={uploadDocument}
              onRemove={removeDocument}
            />
          );
        })}
      </div>

      {/* Common Land Record Hurdles & Advisory */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#8EA66B]" />
          <span>{language === 'hi' ? 'ग्रामीण आवास में सामान्य दस्तावेज़ी बाधाएं व समाधान:' : 'Common Rural Documentation Roadblocks & Remedies:'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FAF7EE] rounded-2xl border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-stone-900">
              {language === 'hi' ? '1. खतौनी में नाम का अंतर' : '1. Spelling Variance in Khatauni'}
            </h4>
            <p className="text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'यदि खतौनी में पिता का नाम या उपनाम भिन्न है, तो ₹50 के स्टांप पेपर पर हलफनामा व ग्राम प्रधान का पहचान प्रमाण पत्र बनवाएं।'
                : 'If a spacing or surname difference exists between Khatauni and Aadhaar, a simple self-affidavit with Lekhpal endorsement prevents rejection.'}
            </p>
          </div>

          <div className="p-4 bg-[#FAF7EE] rounded-2xl border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-stone-900">
              {language === 'hi' ? '2. बैंक में डीबीटी सक्रिय न होना' : '2. Bank NPCI DBT Inactive'}
            </h4>
            <p className="text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'केवल खाता होना काफी नहीं है। बैंक शाखा में जाकर आधार सीडिंग व DBT सक्रियण फॉर्म भरें ताकि केंद्र का पैसा न रुके।'
                : 'A bank account must be mapped to Aadhaar NPCI. Visit your branch to submit the DBT mandate form to ensure PFMS credits work.'}
            </p>
          </div>

          <div className="p-4 bg-[#FAF7EE] rounded-2xl border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-stone-900">
              {language === 'hi' ? '3. मनरेगा जॉब कार्ड लिंकेज' : '3. MGNREGA Wages Linkage'}
            </h4>
            <p className="text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'मकान निर्माण में 90 दिनों की मजदूरी पाने के लिए जॉब कार्ड सक्रिय होना चाहिए। अपने ग्राम रोजगार सहायक (GRS) से सत्यापन कराएं।'
                : 'Ensure your MGNREGA Job Card is active to receive 90 to 95 days of unskilled construction wages (~₹25,000) during building.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
