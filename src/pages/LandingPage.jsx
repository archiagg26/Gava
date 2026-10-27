import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Home,
  CheckCircle2,
  FileCheck2,
  ListTodo,
  BotMessageSquare,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Building,
  Users,
  Banknote,
  HelpCircle,
  ExternalLink,
  LogIn
} from 'lucide-react';

export default function LandingPage() {
  const { t, language } = useLanguage();
  const { isDemoActive, loadDemoData } = useApp();
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    {
      value: "2.95+ Cr",
      label: language === 'hi' ? 'पीएमएवाई-जी स्वीकृत मकान' : 'Houses Sanctioned under PMAY-G',
      source: "pmayg.nic.in / MoRD"
    },
    {
      value: "₹1.57 Lakh+",
      label: language === 'hi' ? 'कुल प्रत्यक्ष सरकारी सहायता' : 'Total Direct Financial Assistance',
      source: "Grant + MGNREGA + Toilet"
    },
    {
      value: "90-95 Days",
      label: language === 'hi' ? 'मनरेगा अकुशल मजदूरी लाभ' : 'MGNREGA Wages Paid to Family',
      source: "Statutory labor linkage"
    },
    {
      value: "100% Free",
      label: language === 'hi' ? 'नागरिक सहायता व मार्गदर्शन' : 'Civic Guidance for Every Family',
      source: "Open Civic Technology"
    }
  ];

  const fourSteps = [
    {
      number: "01",
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: Users,
      link: "/eligibility"
    },
    {
      number: "02",
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: CheckCircle2,
      link: "/eligibility"
    },
    {
      number: "03",
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: FileCheck2,
      link: "/documents"
    },
    {
      number: "04",
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: ListTodo,
      link: "/tracker"
    }
  ];

  const faqs = [
    {
      q: language === 'hi' ? 'क्या घरसेतु पर आवेदन करने से सीधा मकान स्वीकृत हो जाता है?' : 'Does applying on GharSetu directly sanction a government house?',
      a: language === 'hi'
        ? 'नहीं। घरसेतु एक नागरिक सहायता व तैयारी मंच है। यह परिवारों को उनके दस्तावेज़ तैयार करने, पात्रता जांचने और ग्राम सभा में सही आवेदन पेश करने में मदद करता है। अंतिम प्रशासनिक स्वीकृति केवल संबंधित ग्राम पंचायत व ब्लॉक विकास अधिकारी (BDO) द्वारा ही दी जाती है।'
        : 'No. GharSetu is an independent civic preparation tool, not a government portal. It helps families evaluate their potential eligibility, fix land document mismatches, and prepare for official Gram Sabha surveys. Formal sanction is issued only by authorized Block and Panchayat officials.'
    },
    {
      q: language === 'hi' ? 'यदि खतौनी में पिता का नाम अलग है तो क्या पीएमएवाई-जी का पैसा रुक जाता है?' : 'Will grant disbursements stop if my father’s name spelling is different in Khatauni and Aadhaar?',
      a: language === 'hi'
        ? 'हाँ, बैंक और पीएफएमएस (PFMS) प्रणाली में नाम मिसमैच होने पर प्रत्यक्ष लाभ अंतरण (DBT) रुक सकता है। घरसेतु का स्मार्ट दस्तावेज़ स्कैनर ऐसी वर्तनी त्रुटियों को पहले ही पहचान लेता है ताकि आप समय रहते लेखपाल या ग्राम प्रधान से पहचान प्रमाण पत्र या शपथ पत्र बनवा सकें।'
        : 'Yes, spelling mismatches between land records and bank accounts often lead to DBT rejection on PFMS. GharSetu highlights these differences in advance so you can obtain a Lekhpal certification or self-affidavit before Gram Sabha submission.'
    },
    {
      q: language === 'hi' ? 'क्या महिला मुखिया के नाम पर मकान होने पर विशेष प्राथमिकता मिलती है?' : 'Is there special priority for house titling in the name of a female family member?',
      a: language === 'hi'
        ? 'जी हाँ! पीएमएवाई-जी के नियमों के अनुसार मकान की स्वीकृति अनिवार्य रूप से परिवार की महिला मुखिया के नाम या पति-पत्नी के संयुक्त नाम पर की जाती है। कई राज्यों में महिला के नाम पर ज़मीन की रजिस्ट्री पर स्टाम्प शुल्क में भी 100% छूट मिलती है।'
        : 'Yes! PMAY-G statutory guidelines mandate that houses must be registered either solely in the name of the female head or jointly with her spouse. Several states also provide full stamp duty waivers on female land titling.'
    },
    {
      q: language === 'hi' ? 'क्या मेरे अपलोड किए गए दस्तावेज़ सुरक्षित हैं?' : 'Are my uploaded land and identity documents safe and private?',
      a: language === 'hi'
        ? 'बिल्कुल। आपके दस्तावेज़ केवल आपके ब्राउज़र सत्र में स्थानीय रूप से जाँचे जाते हैं। हम कोई भी आधार संख्या या संवेदनशील कागज़ात किसी सार्वजनिक सर्वर पर स्टोर नहीं करते।'
        : 'Yes. GharSetu processes your documents locally in your browser session for automated checklist verification. We never save raw identity numbers or private files to public servers.'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-[#D8A2A2]/40 bg-gradient-to-b from-[#FFF9D6]/60 via-[#FFDCDC]/30 to-[#FAF7EE]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#2c3a1e] border border-[#D8A2A2] text-xs font-bold shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#8EA66B]" />
              <span>{t('prototypeNotice').slice(0, 52)}...</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-950 tracking-tight leading-[1.15]">
              {t('heroHeading')}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-stone-700 max-w-2xl mx-auto leading-relaxed">
              {t('heroSubheading')}
            </p>

            {/* Hero CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/eligibility"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] text-sm font-bold rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <span>{t('checkEligibilityBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/schemes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#FFF9D6] text-stone-800 border border-[#D8A2A2] text-sm font-bold rounded-2xl shadow-xs transition"
              >
                <Building className="w-4 h-4 text-[#8EA66B]" />
                <span>{t('exploreSchemesBtn')}</span>
              </Link>

              {!isDemoActive && (
                <button
                  type="button"
                  onClick={loadDemoData}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#FFF9D6] hover:bg-[#FFDCDC] text-[#612f2f] border border-[#D8A2A2] text-sm font-bold rounded-2xl transition cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-[#914d4d]" />
                  <span>{t('loadDemo')}</span>
                </button>
              )}
            </div>

            {/* Demo Notice if active */}
            {isDemoActive && (
              <p className="text-xs text-[#612f2f] bg-[#FFDCDC] py-1.5 px-3 rounded-xl inline-block border border-[#D8A2A2] font-semibold">
                ★ {language === 'hi' ? 'डेमो प्रोफाइल सक्रिय है (रामकिशन यादव, सीतापुर, उ.प्र.) - आप सीधे डैशबोर्ड देख सकते हैं।' : 'Demo Profile Active (Ramkishan Yadav, UP) - Explore Dashboard & Pre-loaded status.'}
              </p>
            )}
          </div>

          {/* Stats Bar */}
          <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((st, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-4 sm:p-5 border border-[#D8A2A2]/60 shadow-xs text-center space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-[#8EA66B] tracking-tight">{st.value}</p>
                <p className="text-xs font-bold text-stone-800">{st.label}</p>
                <p className="text-[10px] text-stone-500">{st.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step Walkthrough Process */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-12">
          <span className="text-xs font-bold text-[#8EA66B] uppercase tracking-widest">
            {language === 'hi' ? 'सरल व पारदर्शी प्रक्रिया' : 'Simple 4-Step Journey'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            {language === 'hi' ? 'कच्चे आशियाने से पक्के मकान तक का सफर' : 'From Your Land to a Permanent Home'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            {language === 'hi'
              ? 'दलालों और अनिश्चितता से बचें। अपनी पात्रता समझें, दस्तावेज़ दुरुस्त करें और सरकारी सहायता पाएं।'
              : 'Avoid middlemen and administrative delays with verified rules and clear document readiness.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {fourSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Link
                key={idx}
                to={step.link}
                className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs hover:shadow-md hover:border-[#8EA66B] transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-[#612f2f] bg-[#FFDCDC] px-2.5 py-1 rounded-xl border border-[#D8A2A2]">
                      {step.number}
                    </span>
                    <div className="p-2.5 bg-[#FFF9D6] rounded-2xl text-[#8EA66B] group-hover:scale-110 transition-transform border border-[#D8A2A2]/40">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 mb-2 group-hover:text-[#2c3a1e] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-[#8EA66B] group-hover:text-[#788f57]">
                  <span>{language === 'hi' ? 'शुरू करें' : 'Get Started'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-[#FFF9D6]/30 py-16 border-y border-[#D8A2A2]/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-12">
            <span className="text-xs font-bold text-[#8EA66B] uppercase tracking-widest">
              {language === 'hi' ? 'घरसेतु की विशेषताएं' : 'Core Capabilities'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              {language === 'hi' ? 'ग्रामीण परिवारों के लिए विशेष रूप से निर्मित' : 'Built for Rural Realities'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF9D6] text-[#8EA66B] border border-[#8EA66B] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                {language === 'hi' ? '13 अपवर्जन नियमों की पारदर्शी जांच' : '13 Statutory Exclusion Rules Check'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'hi'
                  ? 'पीएमएवाई-ग्रामीण के सभी 13 अपवर्जन नियमों (जैसे वाहन, सरकारी नौकरी, केसीसी सीमा) की निष्पक्ष जांच, बिना किसी अनुमान के।'
                  : 'Checks the exact PMAY-G statutory economic exclusion criteria (motorized vehicles, govt employment, KCC thresholds) transparently.'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFDCDC] text-[#612f2f] border border-[#D8A2A2] flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                {language === 'hi' ? 'खतौनी व आधार मिसमैच डिटेक्टर' : 'Smart Khatauni & Aadhaar Validator'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'hi'
                  ? 'ज़मीन के कागज़ात और आधार में स्पेलिंग या स्पेस के अंतर को पहले ही पकड़ता है ताकि बैंक DBT ट्रांसफर फेल न हो।'
                  : 'Detects name spelling and spacing discrepancies between land title records and Aadhaar before PFMS disbursement delays occur.'}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF9D6] text-[#2c3a1e] border border-[#D8A2A2] flex items-center justify-center font-bold">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                {language === 'hi' ? 'द्विभाषी एआई सहायक (हिन्दी व अंग्रेज़ी)' : 'Bilingual AI Housing Sahayak'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'hi'
                  ? 'सरकारी दिशानिर्देशों पर आधारित एआई जो ग्राम सभा प्रस्ताव, वरासत और आवास+ के जटिल नियमों को सरल भाषा में समझाता है।'
                  : 'Grounded in official government rules, providing step-by-step guidance in simple Hindi or English with zero corporate jargon.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Privacy Guarantee */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-[#2c3a1e] text-[#FFF9D6] rounded-3xl p-8 sm:p-10 shadow-lg border border-[#8EA66B]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#FFDCDC] font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">
                <ShieldCheck className="w-4 h-4 text-[#8EA66B]" />
                <span>{language === 'hi' ? 'नागरिक गोपनीयता सुरक्षा' : 'Zero Data Selling & Client-Side Privacy'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                {language === 'hi' ? 'आपकी पहचान और ज़मीन के दस्तावेज़ सुरक्षित हैं' : 'Your Identity and Land Records Stay Private'}
              </h3>
              <p className="text-xs text-[#FFF9D6]/80 max-w-xl leading-relaxed">
                {language === 'hi'
                  ? 'घरसेतु में अपलोड किए गए दस्तावेज़ केवल आपके स्थानीय ब्राउज़र में जाँचे जाते हैं। हम कोई भी संवेदनशील आधार कार्ड संख्या या निजी फाइलें किसी भी तीसरे पक्ष या सार्वजनिक सर्वर पर स्टोर नहीं करते।'
                  : 'GharSetu runs document analysis locally within your secure browser session. We never persist raw identity numbers or private land deeds to external servers.'}
              </p>
            </div>
            <Link
              to="/documents"
              className="px-5 py-3 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] text-xs font-bold rounded-xl shadow-xs transition shrink-0"
            >
              {t('uploadDocumentsBtn')}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs Accordion */}
      <section className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold text-[#8EA66B] uppercase tracking-widest">
            {language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently Asked Questions'}
          </span>
          <h2 className="text-2xl font-bold text-stone-900">
            {language === 'hi' ? 'आपके मन में उठने वाले मुख्य प्रश्न' : 'Common Questions & Answers'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-stone-900 hover:text-[#2c3a1e] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform shrink-0 ${isOpen ? 'rotate-180 text-[#8EA66B]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#8EA66B] via-[#465a31] to-[#2c3a1e] text-[#FFF9D6] rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-4xl mx-auto shadow-md">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            {language === 'hi' ? 'क्या आप अपने घर की तैयारी शुरू करने के लिए तैयार हैं?' : 'Ready to Start Your Rural Housing Journey?'}
          </h2>
          <p className="text-xs sm:text-sm text-[#FFF9D6]/85 max-w-xl mx-auto leading-relaxed">
            {language === 'hi'
              ? 'केवल 5 मिनट में अपनी पात्रता जांचें और पता करें कि आपका परिवार किस सरकारी सहायता का पात्र है।'
              : 'Assess your eligibility in under 5 minutes and see the verified financial assistance available for your family.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/eligibility"
              className="px-6 py-3.5 bg-[#FFF9D6] hover:bg-[#FFDCDC] text-[#2c3a1e] font-bold text-xs rounded-xl shadow-xs transition"
            >
              {t('checkEligibilityBtn')}
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-[#FFF9D6] border border-white/20 font-bold text-xs rounded-xl transition"
            >
              {t('viewDashboardBtn')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
