import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Home,
  FileText,
  Printer,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Calendar,
  LogOut,
  LogIn
} from 'lucide-react';

export default function Profile() {
  const { t, language } = useLanguage();
  const {
    userProfile,
    eligibilityAssessment,
    documents,
    milestones,
    documentReadiness,
    isDemoActive,
    loadDemoData,
    resetData
  } = useApp();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const effectiveName = currentUser?.name || userProfile?.name;
  const effectiveDistrict = currentUser?.district || userProfile?.district;
  const effectiveState = currentUser?.state || userProfile?.state;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#8EA66B] text-[#FFF9D6] flex items-center justify-center font-bold text-xl shadow-xs border border-[#8EA66B]">
            <User className="w-7 h-7 text-[#FFF9D6]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                {effectiveName || (language === 'hi' ? 'ग्रामीण परिवार प्रोफाइल' : 'Rural Family Profile')}
              </h1>
              {isDemoActive && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FFDCDC] text-[#612f2f] rounded-full border border-[#D8A2A2]">
                  {t('demoActive')}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#8EA66B]" />
              <span>
                {userProfile?.village ? `${userProfile.village}, ` : ''}{effectiveDistrict || 'Sitapur'}, {effectiveState || 'Uttar Pradesh'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('downloadReportBtn')}</span>
          </button>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="p-2 text-stone-600 hover:text-red-700 bg-stone-100 hover:bg-red-50 rounded-xl transition border border-stone-200 cursor-pointer"
              title={t('navLogout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <Link
              to="/login"
              className="p-2 text-[#2c3a1e] bg-[#FFF9D6] hover:bg-[#FFDCDC] rounded-xl transition border border-[#D8A2A2]"
              title={t('navLogin')}
            >
              <LogIn className="w-4 h-4 text-[#8EA66B]" />
            </Link>
          )}

          {isDemoActive ? (
            <button
              onClick={resetData}
              className="p-2 text-stone-600 hover:text-red-700 bg-stone-100 hover:bg-red-50 rounded-xl transition border border-stone-200 cursor-pointer"
              title={t('resetData')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={loadDemoData}
              className="p-2 text-[#612f2f] bg-[#FFF9D6] hover:bg-[#FFDCDC] rounded-xl transition border border-[#D8A2A2] cursor-pointer"
              title={t('loadDemo')}
            >
              <Sparkles className="w-4 h-4 text-[#914d4d]" />
            </button>
          )}
        </div>
      </div>

      {/* Printable Readiness Summary Report */}
      <div id="readiness-report" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              {language === 'hi' ? 'ग्रामीण आवास तैयारी सारांश रिपोर्ट' : 'Rural Housing Readiness Summary Report'}
            </h2>
            <p className="text-xs text-stone-500">
              {language === 'hi' ? 'घरसेतु नागरिक सहायता मंच द्वारा संकलित' : 'Compiled via GharSetu Civic Assistance Platform'}
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-400">
            {new Date().toLocaleDateString()}
          </span>
        </div>

        {/* Household Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#FAF7EE] rounded-2xl border border-stone-200">
            <span className="text-stone-500 block mb-0.5">{language === 'hi' ? 'परिवार के सदस्य' : 'Household Size'}</span>
            <span className="font-bold text-stone-900">{userProfile?.householdSize || 5} Members</span>
          </div>

          <div className="p-3 bg-[#FAF7EE] rounded-2xl border border-stone-200">
            <span className="text-stone-500 block mb-0.5">{language === 'hi' ? 'सामाजिक वर्ग' : 'Social Category'}</span>
            <span className="font-bold text-stone-900">{userProfile?.socialCategory || 'OBC'}</span>
          </div>

          <div className="p-3 bg-[#FAF7EE] rounded-2xl border border-stone-200">
            <span className="text-stone-500 block mb-0.5">{language === 'hi' ? 'वर्तमान मकान' : 'Current Shelter'}</span>
            <span className="font-bold text-stone-900 capitalize">{userProfile?.currentHouseType || 'Kutcha'}</span>
          </div>

          <div className="p-3 bg-[#FAF7EE] rounded-2xl border border-stone-200">
            <span className="text-stone-500 block mb-0.5">{language === 'hi' ? 'ज़मीन का स्वामित्व' : 'Land Title'}</span>
            <span className="font-bold text-stone-900 capitalize">{userProfile?.landOwnership || 'Ancestral'}</span>
          </div>
        </div>

        {/* Eligibility Status Section */}
        <div className="p-4 bg-[#FFF9D6] rounded-3xl border border-[#D8A2A2] text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#612f2f] uppercase tracking-wide">
              {t('eligibilityStatusTitle')}:
            </span>
            <span className="font-bold text-[#2c3a1e] px-2 py-0.5 bg-white rounded-md border border-[#8EA66B]">
              {eligibilityAssessment ? `${eligibilityAssessment.score}% Potential` : 'Pending'}
            </span>
          </div>
          <p className="text-[#2c3a1e] font-bold">
            {eligibilityAssessment
              ? (language === 'hi' ? eligibilityAssessment.summaryTextHi : eligibilityAssessment.summaryText)
              : 'Please complete the eligibility assessment wizard to verify scheme fit.'}
          </p>
          {eligibilityAssessment && (
            <p className="text-stone-700 text-[11px]">
              Estimated Benefit: <span className="font-black text-[#8EA66B]">{eligibilityAssessment.totalEstimatedAssistance}</span>
            </p>
          )}
        </div>

        {/* Documents Readiness Status */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 uppercase tracking-wide">
              {t('documentReadinessTitle')} ({documentReadiness}%)
            </h3>
            <Link to="/documents" className="text-[#8EA66B] underline font-bold">
              Manage in Document Center
            </Link>
          </div>

          <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
            {Object.entries(documents).map(([key, doc]) => (
              <div key={key} className="p-3 flex items-center justify-between bg-white text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#8EA66B]" />
                  <span className="font-medium text-stone-900">{doc.fileName}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  doc.status === 'ready'
                    ? 'bg-[#FFF9D6] text-[#2c3a1e] border-[#8EA66B]'
                    : 'bg-[#FFDCDC] text-[#612f2f] border-[#D8A2A2]'
                }`}>
                  {doc.status === 'ready' ? 'Ready' : 'Review Needed'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Summary */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-stone-900 uppercase tracking-wide">
            {language === 'hi' ? 'स्वीकृति यात्रा प्रगति' : 'Sanction Milestones Progress'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {milestones.map((m) => (
              <div key={m.id} className="p-3 rounded-2xl border border-stone-200 flex items-center justify-between bg-stone-50/50">
                <span className="text-stone-800 font-semibold truncate mr-2">
                  {language === 'hi' ? m.titleHi : m.title}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                  m.status === 'completed'
                    ? 'bg-[#FFF9D6] text-[#2c3a1e] border-[#8EA66B]'
                    : 'bg-stone-100 text-stone-600 border-stone-300'
                }`}>
                  {m.status === 'completed' ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Civic Transparency Footer Note */}
        <div className="p-4 bg-[#FAF7EE] rounded-3xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
          <p className="font-bold text-stone-800">Official Submission Guidance:</p>
          <p className="leading-relaxed">
            Take this report along with your certified Khatauni copy, Aadhaar card, and bank passbook to your local Gram Sabha meeting and Common Service Center (CSC) for official entry into the Awaas+ portal.
          </p>
        </div>
      </div>
    </div>
  );
}
