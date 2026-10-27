import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import SchemeCard from '../components/SchemeCard';
import DocumentChecklist from '../components/DocumentChecklist';
import ChatAssistant from '../components/ChatAssistant';
import EmptyState from '../components/EmptyState';
import { schemeService } from '../services/schemeService';
import {
  ClipboardCheck,
  FileText,
  Building2,
  ListTodo,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Clock,
  ExternalLink,
  UserCheck
} from 'lucide-react';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const {
    userProfile,
    eligibilityAssessment,
    documents,
    milestones,
    recentActivity,
    documentReadiness,
    missingDocs,
    isDemoActive,
    loadDemoData,
    resetData
  } = useApp();
  const { currentUser } = useAuth();

  const allSchemes = schemeService.getAllSchemes();

  const matchedSchemeIds = eligibilityAssessment?.matchedSchemes || ['pmay-g', 'rhiss'];
  const recommendedSchemes = allSchemes.filter(s => matchedSchemeIds.includes(s.id));

  const hasReviewDocs = Object.values(documents).some(d => d.status === 'review');
  const hasPendingEligibility = !eligibilityAssessment;

  const displayName = currentUser?.name || userProfile?.name;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8 max-w-7xl">
      {/* Top Welcome & Demo Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              {displayName
                ? `${language === 'hi' ? 'नमस्ते' : 'Welcome'}, ${displayName}`
                : t('dashboardTitle')}
            </h1>
            {isDemoActive && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FFDCDC] text-[#612f2f] rounded-full border border-[#D8A2A2]">
                {t('demoActive')}
              </span>
            )}
            {currentUser && !isDemoActive && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FFF9D6] text-[#2c3a1e] rounded-full border border-[#8EA66B]">
                Active Session
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {userProfile?.village && userProfile?.district
              ? `${userProfile.village}, ${userProfile.district}, ${userProfile.state}`
              : t('dashboardSubtitle')}
          </p>
        </div>

        {/* Quick Demo Load / Reset */}
        <div className="flex items-center gap-2">
          {isDemoActive ? (
            <button
              onClick={resetData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 rounded-xl text-xs font-semibold border border-stone-200 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('resetData')}</span>
            </button>
          ) : (
            <button
              onClick={loadDemoData}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFF9D6]" />
              <span>{t('loadDemo')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Priority Action Banner */}
      {hasPendingEligibility ? (
        <div className="p-4 bg-[#FFF9D6] rounded-3xl border border-[#D8A2A2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#914d4d] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#612f2f] uppercase tracking-wide">
                {language === 'hi' ? 'पात्रता मूल्यांकन लंबित है' : 'Eligibility Assessment Pending'}
              </h4>
              <p className="text-xs text-stone-700 mt-0.5">
                {language === 'hi'
                  ? 'सरकारी आवास अनुदान के नियम अनुसार अपनी पात्रता जांचने के लिए 3 मिनट का फॉर्म भरें।'
                  : 'Complete the short 4-step questionnaire to determine which central or state schemes you can claim.'}
              </p>
            </div>
          </div>
          <Link
            to="/eligibility"
            className="px-4 py-2 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] font-bold text-xs rounded-xl shadow-xs transition shrink-0"
          >
            {t('checkEligibilityBtn')}
          </Link>
        </div>
      ) : hasReviewDocs ? (
        <div className="p-4 bg-[#FFDCDC] rounded-3xl border border-[#D8A2A2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#914d4d] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#612f2f] uppercase tracking-wide">
                {language === 'hi' ? 'दस्तावेज़ में वर्तनी सुधार आवश्यक' : 'Document Attention Needed'}
              </h4>
              <p className="text-xs text-[#612f2f] mt-0.5 font-medium">
                {language === 'hi'
                  ? 'आपकी खतौनी और आधार में नाम की भिन्नता पाई गई है। कृपया समय रहते लेखपाल प्रमाण पत्र या हलफनामा तैयार करें।'
                  : 'Potential name or spacing discrepancy detected in land record. Resolve with an affidavit before Gram Sabha.'}
              </p>
            </div>
          </div>
          <Link
            to="/documents"
            className="px-4 py-2 bg-[#612f2f] hover:bg-[#914d4d] text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
          >
            {language === 'hi' ? 'दस्तावेज़ जांचें' : 'Review Document'}
          </Link>
        </div>
      ) : null}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('eligibilityStatusTitle')}
          value={
            eligibilityAssessment
              ? (eligibilityAssessment.status === 'eligible'
                  ? (language === 'hi' ? 'उच्च पात्र' : 'High Potential')
                  : eligibilityAssessment.status === 'potentially_eligible'
                  ? (language === 'hi' ? 'संभावित पात्र' : 'Potentially Eligible')
                  : (language === 'hi' ? 'अपात्र' : 'Ineligible'))
              : (language === 'hi' ? 'जांच आवश्यक' : 'Needs Check')
          }
          subtitle={eligibilityAssessment ? eligibilityAssessment.totalEstimatedAssistance : 'Run assessment'}
          icon={ClipboardCheck}
          variant="olive"
          badgeText={eligibilityAssessment ? `${eligibilityAssessment.score}% Score` : 'Pending'}
          badgeVariant="warning"
        />

        <StatCard
          title={t('documentReadinessTitle')}
          value={`${documentReadiness}%`}
          subtitle={`${Object.keys(documents).length} of 7 papers uploaded`}
          icon={FileText}
          variant="cream"
          badgeText={documentReadiness >= 75 ? 'Ready' : 'In Progress'}
          badgeVariant={documentReadiness >= 75 ? 'success' : 'warning'}
        />

        <StatCard
          title={t('schemesMatchedTitle')}
          value={recommendedSchemes.length.toString()}
          subtitle="PMAY-G, MMAY-G, RHISS"
          icon={Building2}
          variant="rose"
          badgeText="Verified Official"
          badgeVariant="warning"
        />

        <StatCard
          title={t('currentMilestoneTitle')}
          value={`Step ${milestones.filter(m => m.status === 'completed').length + 1}`}
          subtitle={`${milestones.filter(m => m.status === 'completed').length} of ${milestones.length} milestones complete`}
          icon={ListTodo}
          variant="default"
          badgeText="Tracking Active"
          badgeVariant="neutral"
        />
      </div>

      {/* Main Grid: Recommended Schemes & Document Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Recommended Schemes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                {t('recommendedSchemesTitle')}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'hi'
                  ? 'आपकी पारिवारिक व ज़मीनी स्थिति के आधार पर उपयुक्त सरकारी योजनाएं।'
                  : 'Schemes matched to your household profile and rural location.'}
              </p>
            </div>
            <Link
              to="/schemes"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#8EA66B] hover:text-[#788f57]"
            >
              <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedSchemes.map(scheme => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
              />
            ))}
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center justify-between">
              <span>{t('recentActivityTitle')}</span>
              <span className="text-[10px] text-stone-400 font-normal">Audit Log</span>
            </h3>
            {recentActivity.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-4">
                {language === 'hi' ? 'कोई हालिया गतिविधि नहीं।' : 'No activity logged yet.'}
              </p>
            ) : (
              <div className="divide-y divide-stone-100 text-xs">
                {recentActivity.slice(0, 5).map(act => (
                  <div key={act.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#8EA66B]" />
                      <span className="text-stone-800 font-medium">
                        {language === 'hi' ? (act.titleHi || act.title) : act.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Document Checklist & Mini AI Chat */}
        <div className="space-y-6">
          <DocumentChecklist />

          {/* Missing Documents Quick Upload List */}
          {missingDocs.length > 0 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center justify-between">
                <span>{language === 'hi' ? 'लंबित दस्तावेज़' : 'Pending Documents'}</span>
                <span className="text-[#612f2f] font-bold bg-[#FFDCDC] px-2 py-0.5 rounded-full border border-[#D8A2A2]">
                  {missingDocs.length}
                </span>
              </h4>
              <div className="space-y-2">
                {missingDocs.slice(0, 3).map(doc => (
                  <div key={doc.id} className="p-2.5 bg-[#FAF7EE] rounded-2xl flex items-center justify-between text-xs border border-stone-200/60">
                    <span className="font-bold text-stone-800 truncate mr-2">
                      {language === 'hi' ? doc.nameHi : doc.name}
                    </span>
                    <Link
                      to="/documents"
                      className="px-2.5 py-1 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] rounded-xl text-[10px] font-bold shrink-0 shadow-2xs"
                    >
                      {language === 'hi' ? 'अपलोड' : 'Upload'}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick AI Assistant Card */}
          <ChatAssistant fullHeight={false} />
        </div>
      </div>
    </div>
  );
}
