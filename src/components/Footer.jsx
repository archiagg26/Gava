import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ExternalLink, ShieldCheck, HeartHandshake, FileCheck2 } from 'lucide-react';

export default function Footer() {
  const { t, language } = useLanguage();

  const officialLinks = [
    { title: 'PMAY-G Official Portal', titleHi: 'पीएमएवाई-जी आधिकारिक पोर्टल', url: 'https://pmayg.nic.in' },
    { title: 'Ministry of Rural Development (MoRD)', titleHi: 'ग्रामीण विकास मंत्रालय', url: 'https://rural.gov.in' },
    { title: 'AwaasApp Beneficiary Verification', titleHi: 'आवास ऐप लाभार्थी सत्यापन', url: 'https://pmayg.nic.in/netiay/home.aspx' },
    { title: 'Digital India Land Records (DILRMP)', titleHi: 'डिजिटल लैंड रिकॉर्ड्स आधुनिकीकरण', url: 'https://dilrmp.gov.in' },
    { title: 'National Housing Bank (RHISS)', titleHi: 'राष्ट्रीय आवास बैंक', url: 'https://nhb.org.in' }
  ];

  return (
    <footer className="bg-[#2c3a1e] text-[#FFF9D6] border-t border-[#8EA66B]/30 text-xs">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#8EA66B] flex items-center justify-center text-[#FFF9D6] font-bold text-sm border border-[#D8A2A2]">
                GS
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">GharSetu</span>
                <span className="text-xs text-[#FFDCDC] block -mt-1 font-hindi">घरसेतु</span>
              </div>
            </div>
            <p className="text-[#FFF9D6]/80 leading-relaxed text-xs">
              {language === 'hi'
                ? 'ग्रामीण परिवारों को अपनी ज़मीन पर पक्का आशियाना बनाने में सहायता करने वाला स्वतंत्र एआई मार्गदर्शक।'
                : 'Empowering rural Indian families to navigate government housing schemes and document readiness with clarity.'}
            </p>
            <div className="flex items-center gap-2 text-[#FFDCDC] text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#8EA66B] shrink-0" />
              <span>{language === 'hi' ? 'गोपनीयता सुरक्षित • क्लाइंट-साइड सुरक्षा' : 'Zero Data Selling • Browser Privacy'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {language === 'hi' ? 'त्वरित लिंक' : 'Platform Navigation'}
            </h4>
            <ul className="space-y-2 text-[#FFF9D6]/80">
              <li><Link to="/dashboard" className="hover:text-[#FFDCDC] transition">{t('navDashboard')}</Link></li>
              <li><Link to="/eligibility" className="hover:text-[#FFDCDC] transition">{t('navEligibility')}</Link></li>
              <li><Link to="/documents" className="hover:text-[#FFDCDC] transition">{t('navDocuments')}</Link></li>
              <li><Link to="/schemes" className="hover:text-[#FFDCDC] transition">{t('navSchemes')}</Link></li>
              <li><Link to="/tracker" className="hover:text-[#FFDCDC] transition">{t('navTracker')}</Link></li>
              <li><Link to="/ai-help" className="hover:text-[#FFDCDC] transition">{t('navAIHelp')}</Link></li>
            </ul>
          </div>

          {/* Official Government Portals */}
          <div className="space-y-3 md:col-span-1">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-[#FFDCDC]" />
              {language === 'hi' ? 'आधिकारिक सरकारी पोर्टल' : 'Official Portals'}
            </h4>
            <ul className="space-y-2">
              {officialLinks.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#FFF9D6]/80 hover:text-[#FFDCDC] transition text-[11px]"
                  >
                    <span>{language === 'hi' ? item.titleHi : item.title}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hackathon Prototype Transparency Notice */}
          <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/10">
            <h4 className="text-[#FFDCDC] font-bold text-xs flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" />
              {language === 'hi' ? 'पारदर्शिता एवं कानूनी सूचना' : 'Civic Transparency Notice'}
            </h4>
            <p className="text-[#FFF9D6]/80 text-[11px] leading-relaxed">
              {t('disclaimerFooter')}
            </p>
            <div className="pt-2 border-t border-white/10 text-[10px] text-[#FFF9D6]/60">
              {t('developedWithLove')}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#FFF9D6]/60 gap-2">
          <p>© {new Date().getFullYear()} GharSetu. Designed for Indian Rural Development.</p>
          <p className="flex items-center gap-3">
            <Link to="/eligibility" className="hover:text-white">PMAY-G Eligibility</Link>
            <span>•</span>
            <Link to="/documents" className="hover:text-white">Khatauni Check</Link>
            <span>•</span>
            <Link to="/ai-help" className="hover:text-white">AI Sahayak</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
