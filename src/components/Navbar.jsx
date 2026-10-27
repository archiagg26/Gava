import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import LanguageToggle from './LanguageToggle';
import {
  Home,
  LayoutDashboard,
  ClipboardCheck,
  FileText,
  Building2,
  ListTodo,
  BotMessageSquare,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export default function Navbar() {
  const { t, language } = useLanguage();
  const { isDemoActive, loadDemoData, resetData } = useApp();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t('navHome'), icon: Home },
    { to: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { to: '/eligibility', label: t('navEligibility'), icon: ClipboardCheck },
    { to: '/documents', label: t('navDocuments'), icon: FileText },
    { to: '/schemes', label: t('navSchemes'), icon: Building2 },
    { to: '/tracker', label: t('navTracker'), icon: ListTodo },
    { to: '/ai-help', label: t('navAIHelp'), icon: BotMessageSquare },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7EE]/95 backdrop-blur-md border-b border-[#D8A2A2]/40 shadow-xs">
      {/* Top micro banner for prototype notice */}
      <div className="bg-[#2c3a1e] text-[#FFF9D6] text-[11px] px-3 py-1 flex justify-between items-center text-center sm:text-left">
        <div className="container mx-auto flex items-center justify-between">
          <p className="truncate">
            <span className="font-semibold text-[#FFDCDC]">🇮🇳 {language === 'hi' ? 'नागरिक सहायता मंच' : 'Civic Hackathon Prototype'}:</span>{' '}
            {language === 'hi'
              ? 'आधिकारिक निर्णय संबंधित ग्राम पंचायत एवं ब्लॉक कार्यालय द्वारा ही मान्य है।'
              : 'Informational navigator. Official sanctions rest with local authorities.'}
          </p>
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isDemoActive ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-[#D8A2A2]/30 text-[#FFF9D6] px-2 py-0.5 rounded text-[10px] font-medium border border-[#D8A2A2]/40">
                  <Sparkles className="w-3 h-3 text-[#FFF9D6]" />
                  {t('demoActive')}
                </span>
                <button
                  onClick={resetData}
                  className="inline-flex items-center gap-1 text-[#FFDCDC] hover:text-white text-[10px] underline cursor-pointer"
                  title="Reset to empty state"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  {t('resetData')}
                </button>
              </div>
            ) : (
              <button
                onClick={loadDemoData}
                className="inline-flex items-center gap-1 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#FFF9D6]" />
                {t('loadDemo')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#8EA66B] flex items-center justify-center text-[#FFF9D6] shadow-sm border border-[#D8A2A2]/60 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-[#FFF9D6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
                <path d="M4 14h16" stroke="#FFF9D6" strokeWidth="1.5" strokeDasharray="2 2" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#2c3a1e]">GharSetu</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#FFDCDC] text-[#612f2f] rounded-sm border border-[#D8A2A2]">
                  {language === 'hi' ? 'घरसेतु' : 'Rural'}
                </span>
              </div>
              <p className="text-[10px] text-stone-600 font-medium hidden sm:block">
                {t('brandTagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((item) => {
              const active = isActive(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#8EA66B] text-[#FFF9D6] shadow-2xs'
                      : 'text-stone-700 hover:text-[#2c3a1e] hover:bg-[#FFF9D6]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#FFF9D6]' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2">
            <LanguageToggle />

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-stone-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-[#D8A2A2] hover:bg-[#FFF9D6] transition"
                >
                  <div className="w-5 h-5 rounded-full bg-[#8EA66B] text-[#FFF9D6] flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-stone-800 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-stone-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  title={t('navLogout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 pl-1 border-l border-stone-200">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-[#2c3a1e] hover:bg-[#FFF9D6] rounded-xl transition"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] text-xs font-bold rounded-xl transition shadow-2xs"
                >
                  {t('navSignup')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-stone-700 hover:bg-[#FFF9D6] transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FAF7EE] border-b border-[#D8A2A2]/40 px-4 pt-2 pb-4 space-y-2">
          {/* User state in mobile */}
          <div className="py-2 border-b border-stone-200 flex items-center justify-between">
            {isAuthenticated ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#8EA66B] text-[#FFF9D6] flex items-center justify-center text-xs font-bold">
                    {currentUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                    <p className="text-[10px] text-stone-500">{currentUser.email || currentUser.mobile}</p>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="text-xs text-red-600 font-bold"
                >
                  {t('navLogout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-white text-stone-800 text-xs font-bold rounded-xl border border-[#D8A2A2]"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-[#8EA66B] text-[#FFF9D6] text-xs font-bold rounded-xl"
                >
                  {t('navSignup')}
                </Link>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((item) => {
              const active = isActive(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-[#8EA66B] text-[#FFF9D6]'
                      : 'text-stone-700 hover:bg-[#FFF9D6]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#FFF9D6]' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive('/profile')
                  ? 'bg-[#8EA66B] text-[#FFF9D6]'
                  : 'text-stone-700 hover:bg-[#FFF9D6]'
              }`}
            >
              <User className="w-4 h-4 text-stone-500" />
              <span>{t('navProfile')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
