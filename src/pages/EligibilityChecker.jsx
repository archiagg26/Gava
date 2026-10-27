import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import SchemeCard from '../components/SchemeCard';
import { schemeService } from '../services/schemeService';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  Building,
  RotateCcw,
  Check,
  FileText
} from 'lucide-react';

const INDIAN_STATES = [
  "Uttar Pradesh", "Madhya Pradesh", "Bihar", "Rajasthan", "Odisha",
  "Assam", "West Bengal", "Chhattisgarh", "Jharkhand", "Maharashtra",
  "Gujarat", "Punjab", "Haryana", "Karnataka", "Tamil Nadu", "Uttarakhand",
  "Himachal Pradesh", "Jammu & Kashmir", "Andhra Pradesh", "Telangana"
];

export default function EligibilityChecker() {
  const { t, language } = useLanguage();
  const { userProfile, eligibilityAssessment, submitEligibility } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    state: userProfile?.state || 'Uttar Pradesh',
    district: userProfile?.district || 'Sitapur',
    block: userProfile?.block || 'Maholi',
    village: userProfile?.village || 'Rampur Grant',
    isRural: userProfile?.isRural ?? true,
    householdSize: userProfile?.householdSize || 5,
    primaryEarner: userProfile?.primaryEarner || 'Agricultural Labour & Small Farmer',
    socialCategory: userProfile?.socialCategory || 'OBC',
    isWomanHead: userProfile?.isWomanHead ?? false,
    isDifferentlyAbled: userProfile?.isDifferentlyAbled ?? false,
    currentHouseType: userProfile?.currentHouseType || 'kutcha',
    landOwnership: userProfile?.landOwnership || 'ancestral',
    landArea: userProfile?.landArea || '850 sq. ft.',
    annualIncome: userProfile?.annualIncome || '₹72,000',
    rationCardType: userProfile?.rationCardType || 'BPL / Priority Household (PHH)',
    hasMotorVehicle: userProfile?.hasMotorVehicle ?? false,
    hasKccLimit: userProfile?.hasKccLimit ?? false,
    hasGovtEmployee: userProfile?.hasGovtEmployee ?? false,
    hasNonAgriEnterprise: userProfile?.hasNonAgriEnterprise ?? false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(Boolean(eligibilityAssessment));

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.district.trim()) newErrors.district = 'District is required';
      if (!formData.village.trim()) newErrors.village = 'Village name is required';
    } else if (step === 2) {
      if (!formData.name.trim()) newErrors.name = 'Applicant name is required';
      if (!formData.householdSize || formData.householdSize < 1) newErrors.householdSize = 'Valid family size required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      submitEligibility(formData);
      setIsSubmitting(false);
      setShowResults(true);
    }, 600);
  };

  const resetFormToRetake = () => {
    setShowResults(false);
    setCurrentStep(1);
  };

  const allSchemes = schemeService.getAllSchemes();
  const matchedSchemesList = allSchemes.filter(s =>
    (eligibilityAssessment?.matchedSchemes || []).includes(s.id)
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#8EA66B] uppercase tracking-widest">
          {language === 'hi' ? 'आवास अधिकार मूल्यांकन' : 'Housing Rights Assessment'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          {t('eligibilityWizardTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto">
          {t('eligibilityWizardSubtitle')}
        </p>
      </div>

      {showResults && eligibilityAssessment ? (
        /* Results View */
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Main Status Hero Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${
            eligibilityAssessment.status === 'eligible'
              ? 'bg-[#8EA66B] text-[#FFF9D6] border-[#788f57]'
              : eligibilityAssessment.status === 'potentially_eligible'
              ? 'bg-[#FFF9D6] text-[#2c3a1e] border-[#D8A2A2]'
              : 'bg-[#2c3a1e] text-[#FFF9D6] border-stone-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/20">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFDCDC]">
                  {t('assessmentResultTitle')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black">
                  {language === 'hi' ? eligibilityAssessment.summaryTextHi : eligibilityAssessment.summaryText}
                </h2>
                <p className="text-xs opacity-90">
                  {language === 'hi' ? 'आवास+ एवं सरकारी नियमों के अनुसार प्रारंभिक परिणाम' : 'Grounded in PMAY-G & State Housing Norms'}
                </p>
              </div>

              <div className="p-4 bg-white/15 rounded-2xl text-center border border-white/20 shrink-0">
                <span className="text-xs opacity-80 block">{language === 'hi' ? 'पात्रता स्कोर' : 'Readiness'}</span>
                <span className="text-3xl font-black text-[#FFF9D6]">{eligibilityAssessment.score}%</span>
              </div>
            </div>

            {/* Financial estimate pill */}
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs opacity-80 block">{t('benefitsEstimateTitle')}:</span>
                <span className="text-xl sm:text-2xl font-black text-[#FFDCDC]">
                  {eligibilityAssessment.totalEstimatedAssistance}
                </span>
                <span className="text-xs opacity-80 block mt-0.5">
                  {language === 'hi' ? 'सीधा अनुदान + मनरेगा मजदूरी + शौचालय सहायता' : 'Direct Grant + MGNREGA wages + Toilet assistance'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/documents"
                  className="px-5 py-3 bg-[#FFF9D6] hover:bg-[#FFDCDC] text-[#2c3a1e] text-xs font-bold rounded-xl shadow-xs transition"
                >
                  {t('uploadDocumentsBtn')}
                </Link>
                <button
                  onClick={resetFormToRetake}
                  className="px-4 py-3 bg-white/15 hover:bg-white/25 text-[#FFF9D6] text-xs font-bold rounded-xl border border-white/20 transition cursor-pointer"
                >
                  {language === 'hi' ? 'पुनः जांचें' : 'Retake'}
                </button>
              </div>
            </div>
          </div>

          {/* Reasons Factors Grid */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              {t('reasonsTitle')}
            </h3>

            <div className="space-y-3">
              {eligibilityAssessment.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 ${
                    reason.status === 'positive'
                      ? 'bg-[#FFF9D6]/60 border-[#8EA66B]/60 text-[#2c3a1e]'
                      : 'bg-[#FFDCDC]/60 border-[#D8A2A2] text-[#612f2f]'
                  }`}
                >
                  {reason.status === 'positive' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#8EA66B] shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#914d4d] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block mb-0.5">{reason.factor}</span>
                    <p className="leading-relaxed">
                      {language === 'hi' ? (reason.textHi || reason.text) : reason.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matched Schemes Cards */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              {language === 'hi' ? 'आपके परिवार हेतु सुझाई गई योजनाएं' : 'Eligible Housing Schemes for You'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedSchemesList.map(scheme => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          </div>

          {/* Recommended Action Plan */}
          <div className="bg-[#FFF9D6] rounded-3xl border border-[#D8A2A2] p-6 space-y-3">
            <h3 className="text-sm font-bold text-[#612f2f] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#914d4d]" />
              <span>{t('nextStepsTitle')}</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#2c3a1e] leading-relaxed font-medium">
              {eligibilityAssessment.actionPlan.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        /* Multi-Step Wizard */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          {/* Wizard Step Bar */}
          <div className="bg-[#FAF7EE] border-b border-stone-200 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-2">
              <span>{language === 'hi' ? `चरण ${currentStep} / 5` : `Step ${currentStep} of 5`}</span>
              <span className="text-[#8EA66B]">
                {currentStep === 1 && t('stepLocation')}
                {currentStep === 2 && t('stepHousehold')}
                {currentStep === 3 && t('stepHousing')}
                {currentStep === 4 && t('stepEconomic')}
                {currentStep === 5 && t('stepReview')}
              </span>
            </div>
            {/* Progress Track */}
            <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8EA66B] rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Wizard Form Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Step 1: Location & Geography */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-base font-bold text-stone-900">{t('stepLocation')}</h3>
                  <p className="text-xs text-stone-500">
                    {language === 'hi'
                      ? 'पीएमएवाई-ग्रामीण केवल अधिसूचित ग्रामीण क्षेत्रों व ग्राम पंचायतों के लिए मान्य है।'
                      : 'PMAY-G benefits are reserved specifically for notified rural areas.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('stateLabel')} *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#8EA66B]"
                    >
                      {INDIAN_STATES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('districtLabel')} *
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#8EA66B]"
                      placeholder="e.g. Sitapur"
                    />
                    {errors.district && <p className="text-[10px] text-red-600 mt-1">{errors.district}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('blockLabel')}
                    </label>
                    <input
                      type="text"
                      value={formData.block}
                      onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                      placeholder="e.g. Maholi"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('villageLabel')} *
                    </label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                      placeholder="e.g. Rampur Grant"
                    />
                    {errors.village && <p className="text-[10px] text-red-600 mt-1">{errors.village}</p>}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-stone-800 mb-2">
                    {t('isRuralLabel')}
                  </label>
                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.isRural === true}
                        onChange={() => setFormData({ ...formData, isRural: true })}
                        className="text-[#8EA66B] focus:ring-[#8EA66B]"
                      />
                      <span>{t('yes')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.isRural === false}
                        onChange={() => setFormData({ ...formData, isRural: false })}
                        className="text-[#8EA66B] focus:ring-[#8EA66B]"
                      />
                      <span>{t('no')} (Urban Municipality)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Family Profile */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-base font-bold text-stone-900">{t('stepHousehold')}</h3>
                  <p className="text-xs text-stone-500">
                    {language === 'hi'
                      ? 'महिला मुखिया एवं सामाजिक वर्ग के आधार पर वरीयता निर्धारित होती है।'
                      : 'Social category and female-headed households receive statutory priority.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'hi' ? 'आवेदक / मुखिया का नाम' : 'Applicant Full Name'} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                      placeholder="e.g. Ramkishan Yadav"
                    />
                    {errors.name && <p className="text-[10px] text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('householdSizeLabel')} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="18"
                      value={formData.householdSize}
                      onChange={(e) => setFormData({ ...formData, householdSize: parseInt(e.target.value) || 1 })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('primaryEarnerLabel')}
                    </label>
                    <input
                      type="text"
                      value={formData.primaryEarner}
                      onChange={(e) => setFormData({ ...formData, primaryEarner: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('socialCategoryLabel')}
                    </label>
                    <select
                      value={formData.socialCategory}
                      onChange={(e) => setFormData({ ...formData, socialCategory: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    >
                      <option value="SC">SC (Scheduled Caste)</option>
                      <option value="ST">ST (Scheduled Tribe)</option>
                      <option value="OBC">OBC (Other Backward Class)</option>
                      <option value="Minority">Minority Community</option>
                      <option value="General">General Category</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-[#FAF7EE] rounded-2xl border border-stone-200">
                    <label className="block text-xs font-semibold text-stone-800 mb-2">
                      {t('womanHeadLabel')}
                    </label>
                    <div className="flex items-center gap-4 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.isWomanHead === true}
                          onChange={() => setFormData({ ...formData, isWomanHead: true })}
                        />
                        <span>{t('yes')}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.isWomanHead === false}
                          onChange={() => setFormData({ ...formData, isWomanHead: false })}
                        />
                        <span>{t('no')}</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7EE] rounded-2xl border border-stone-200">
                    <label className="block text-xs font-semibold text-stone-800 mb-2">
                      {t('differentlyAbledLabel')}
                    </label>
                    <div className="flex items-center gap-4 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.isDifferentlyAbled === true}
                          onChange={() => setFormData({ ...formData, isDifferentlyAbled: true })}
                        />
                        <span>{t('yes')}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.isDifferentlyAbled === false}
                          onChange={() => setFormData({ ...formData, isDifferentlyAbled: false })}
                        />
                        <span>{t('no')}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Land & Shelter Status */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-base font-bold text-stone-900">{t('stepHousing')}</h3>
                  <p className="text-xs text-stone-500">
                    {language === 'hi'
                      ? 'पक्का मकान होने पर पीएमएवाई-जी अनुदान नहीं मिलता। कच्चा मकान होना आवश्यक शर्त है।'
                      : 'Living in a kutcha house is a mandatory prerequisite for PMAY-G direct grants.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-stone-800">
                    {t('currentHouseTypeLabel')} *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'kutcha', label: t('kutchaKaccha'), note: 'Highest Priority for PMAY-G' },
                      { id: 'semiPucca', label: t('semiPucca'), note: 'Eligible for inspection' },
                      { id: 'pucca', label: t('pucca'), note: 'Exclusion Criterion' },
                      { id: 'homeless', label: t('homeless'), note: 'Homeless Priority' },
                    ].map(type => (
                      <label
                        key={type.id}
                        className={`p-3.5 rounded-2xl border cursor-pointer text-xs flex items-start justify-between transition ${
                          formData.currentHouseType === type.id
                            ? 'bg-[#FFF9D6] border-[#D8A2A2] text-[#2c3a1e] ring-1 ring-[#8EA66B]'
                            : 'bg-stone-50/60 border-stone-200 hover:bg-[#FFF9D6]/30'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="houseType"
                            checked={formData.currentHouseType === type.id}
                            onChange={() => setFormData({ ...formData, currentHouseType: type.id })}
                            className="mt-0.5 text-[#8EA66B]"
                          />
                          <div>
                            <span className="font-bold block">{type.label}</span>
                            <span className="text-[10px] text-stone-500">{type.note}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-stone-800">
                    {t('landOwnershipLabel')} *
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'ancestral', label: t('landAncestral') },
                      { id: 'self', label: t('landSelf') },
                      { id: 'patta', label: t('landPatta') },
                      { id: 'none', label: t('landNone') },
                    ].map(land => (
                      <label
                        key={land.id}
                        className={`p-3 rounded-2xl border cursor-pointer text-xs flex items-center gap-2.5 transition ${
                          formData.landOwnership === land.id
                            ? 'bg-[#FFF9D6] border-[#D8A2A2] text-[#2c3a1e] ring-1 ring-[#8EA66B]'
                            : 'bg-stone-50/60 border-stone-200 hover:bg-[#FFF9D6]/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="landOwnership"
                          checked={formData.landOwnership === land.id}
                          onChange={() => setFormData({ ...formData, landOwnership: land.id })}
                          className="text-[#8EA66B]"
                        />
                        <span className="font-medium">{land.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Socio-Economic & PMAY-G Exclusions */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-base font-bold text-stone-900">{t('stepEconomic')}</h3>
                  <p className="text-xs text-stone-500">
                    {language === 'hi'
                      ? 'पीएमएवाई-जी के 13 अपवर्जन नियमों की जांच ताकि आवेदन बाद में निरस्त न हो।'
                      : 'Statutory check of economic exclusion criteria to prevent later rejection.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('incomeRangeLabel')}
                    </label>
                    <select
                      value={formData.annualIncome}
                      onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    >
                      <option value="Under ₹50,000">Under ₹50,000 / year</option>
                      <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000 / year (Typical rural)</option>
                      <option value="₹1,00,000 - ₹1,80,000">₹1,00,000 - ₹1,80,000 / year</option>
                      <option value="Above ₹2,50,000">Above ₹2,50,000 / year (Taxable)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('rationCardTypeLabel')}
                    </label>
                    <select
                      value={formData.rationCardType}
                      onChange={(e) => setFormData({ ...formData, rationCardType: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    >
                      <option value="Antyodaya (AAY - Red Card)">Antyodaya (AAY - Poorest of poor)</option>
                      <option value="BPL / Priority Household (PHH)">BPL / Priority Household (PHH)</option>
                      <option value="APL / General">APL / Non-Priority</option>
                      <option value="No Ration Card">No Ration Card</option>
                    </select>
                  </div>
                </div>

                {/* Statutory Exclusion Checkboxes */}
                <div className="p-4 bg-[#FAF7EE] rounded-3xl border border-stone-200 space-y-3">
                  <p className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    {language === 'hi' ? '13 अपवर्जन प्रश्नों की पुष्टि (हाँ / नहीं):' : 'Confirm Exclusion Status:'}
                  </p>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200 cursor-pointer">
                      <span>{t('hasMotorVehicleLabel')}</span>
                      <input
                        type="checkbox"
                        checked={formData.hasMotorVehicle}
                        onChange={(e) => setFormData({ ...formData, hasMotorVehicle: e.target.checked })}
                        className="w-4 h-4 text-[#8EA66B] rounded-xs cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200 cursor-pointer">
                      <span>{t('hasKccLimitLabel')}</span>
                      <input
                        type="checkbox"
                        checked={formData.hasKccLimit}
                        onChange={(e) => setFormData({ ...formData, hasKccLimit: e.target.checked })}
                        className="w-4 h-4 text-[#8EA66B] rounded-xs cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200 cursor-pointer">
                      <span>{t('hasGovtEmployeeLabel')}</span>
                      <input
                        type="checkbox"
                        checked={formData.hasGovtEmployee}
                        onChange={(e) => setFormData({ ...formData, hasGovtEmployee: e.target.checked })}
                        className="w-4 h-4 text-[#8EA66B] rounded-xs cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Confirm */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-base font-bold text-stone-900">{t('stepReview')}</h3>
                  <p className="text-xs text-stone-500">{t('reviewAnswers')}</p>
                </div>

                <div className="bg-[#FAF7EE] rounded-3xl border border-stone-200 p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-stone-500 block">Applicant:</span>
                      <span className="font-bold text-stone-900">{formData.name}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Location:</span>
                      <span className="font-bold text-stone-900">{formData.village}, {formData.district}, {formData.state}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">House Type:</span>
                      <span className="font-bold text-stone-900 capitalize">{formData.currentHouseType}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Land Status:</span>
                      <span className="font-bold text-stone-900 capitalize">{formData.landOwnership}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Social Category:</span>
                      <span className="font-bold text-stone-900">{formData.socialCategory}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Woman Head:</span>
                      <span className="font-bold text-stone-900">{formData.isWomanHead ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#FFF9D6] rounded-2xl border border-[#D8A2A2] text-xs text-[#612f2f] flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#914d4d] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {language === 'hi'
                      ? 'सूचना: यह गणना सरकारी नियमों के आधार पर आपका संभावित अधिकार दिखाती है। औपचारिक चयन ग्राम सभा द्वारा होता है।'
                      : 'Transparency Notice: This tool estimates eligibility under government guidelines. Formal approval rests with your Gram Sabha.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Wizard Footer Controls */}
          <div className="bg-[#FAF7EE] border-t border-stone-200 p-4 sm:p-6 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#FFF9D6] text-stone-700 border border-[#D8A2A2] rounded-xl text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('backBtn')}</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <span>{t('nextBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Evaluating...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t('calculateEligibilityBtn')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
