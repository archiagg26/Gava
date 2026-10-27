import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import OtpInput from '../components/OtpInput';
import {
  LogIn,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Smartphone,
  KeyRound,
  Clock,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export default function Login() {
  const { loginWithPassword, loginWithOtp, requestOtp, quickLogin, loading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [authMode, setAuthMode] = useState('password'); // 'password' | 'otp'
  const [identifier, setIdentifier] = useState('demo@gharsetu.in');
  const [password, setPassword] = useState('demo1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // OTP Login states
  const [otpMobile, setOtpMobile] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState(null);

  // Errors & Modals
  const [errorMsg, setErrorMsg] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // Lockout countdown timer
  useEffect(() => {
    let timer;
    if (lockoutRemaining > 0) {
      timer = setInterval(() => {
        setLockoutRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  // OTP Resend countdown timer
  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  const targetRedirect = location.state?.from?.pathname || '/dashboard';

  // Handle Password Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया ईमेल/मोबाइल और पासवर्ड दर्ज करें।' : 'Please enter your email/mobile and password.');
      return;
    }

    const res = await loginWithPassword({ identifier, password, rememberMe });
    if (res.success) {
      navigate(targetRedirect, { replace: true });
    } else {
      setErrorMsg(res.error);
      if (res.locked && res.remainingSeconds) {
        setLockoutRemaining(res.remainingSeconds);
      }
    }
  };

  // Handle OTP Send
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanMobile = otpMobile.trim();
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg(language === 'hi' ? 'कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (उदा. 9876543210)।' : 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    const res = await requestOtp(cleanMobile);
    if (res.success) {
      setOtpSent(true);
      setOtpCountdown(30);
      setSimulatedOtpNotice(`📩 SMS Gateway (Demo): Verification OTP is ${res.otp}`);
    } else {
      setErrorMsg(res.error || 'Failed to send OTP.');
    }
  };

  // Handle OTP Submit
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.length !== 6) {
      setErrorMsg(language === 'hi' ? 'कृपया 6-अंकों का पूरा ओटीपी दर्ज करें।' : 'Please enter the complete 6-digit OTP code.');
      return;
    }

    const res = await loginWithOtp({ identifier: otpMobile.trim(), otp: otpCode.trim() });
    if (res.success) {
      navigate(targetRedirect, { replace: true });
    } else {
      setErrorMsg(res.error);
    }
  };

  // Quick Demo Login
  const handleQuickDemo = async (userId) => {
    setErrorMsg('');
    const res = await quickLogin(userId);
    if (res?.success) {
      navigate(targetRedirect, { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#8EA66B] text-[#FFF9D6] mx-auto flex items-center justify-center font-bold text-xl shadow-xs border border-[#8EA66B]/50">
            <LogIn className="w-6 h-6 text-[#FFF9D6]" />
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            {language === 'hi' ? 'घरसेतु में सुरक्षित लॉगिन' : 'Sign In to GharSetu'}
          </h1>
          <p className="text-xs text-stone-600">
            {language === 'hi'
              ? 'आवास योजना, खतौनी दस्तावेज़ और किस्त स्थिति देखने हेतु प्रवेश करें।'
              : 'Access your housing eligibility, land documents & milestone tracker.'}
          </p>
        </div>

        {/* 1-Click Demo Evaluator Box */}
        <div className="bg-[#FFF9D6] p-4 rounded-3xl border border-[#D8A2A2] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#612f2f] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#914d4d]" />
              <span>{language === 'hi' ? '1-क्लिक त्वरित डेमो लॉगिन' : '1-Click Quick Demo Login'}</span>
            </span>
            <span className="text-[10px] bg-[#FFDCDC] text-[#612f2f] px-2 py-0.5 rounded-full font-bold border border-[#D8A2A2]">
              Judge / Evaluator
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('usr_ramkishan')}
              className="p-2.5 bg-white hover:bg-[#FFDCDC]/60 text-stone-800 rounded-2xl border border-[#D8A2A2] transition flex flex-col items-start cursor-pointer group shadow-2xs"
            >
              <span className="font-bold text-[#2c3a1e] flex items-center gap-1 group-hover:text-[#8EA66B]">
                <UserCheck className="w-3.5 h-3.5 text-[#8EA66B]" />
                <span>Ramkishan Yadav</span>
              </span>
              <span className="text-[10px] text-stone-500">Sitapur, UP • Kutcha House</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('usr_geeta')}
              className="p-2.5 bg-white hover:bg-[#FFDCDC]/60 text-stone-800 rounded-2xl border border-[#D8A2A2] transition flex flex-col items-start cursor-pointer group shadow-2xs"
            >
              <span className="font-bold text-[#612f2f] flex items-center gap-1 group-hover:text-[#914d4d]">
                <UserCheck className="w-3.5 h-3.5 text-[#D8A2A2]" />
                <span>Geeta Devi</span>
              </span>
              <span className="text-[10px] text-stone-500">Sehore, MP • Woman Head</span>
            </button>
          </div>
        </div>

        {/* Main Card with Mode Tabs */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm space-y-5">
          {/* Tabs: Password vs Mobile OTP */}
          <div className="flex rounded-2xl bg-stone-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthMode('password'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'password'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पासवर्ड द्वारा' : 'Password Login'}</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('otp'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'otp'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#8EA66B]" />
              <span>{language === 'hi' ? 'मोबाइल OTP द्वारा' : 'Mobile OTP'}</span>
            </button>
          </div>

          {/* Rate Limit Lockout Banner */}
          {lockoutRemaining > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center gap-2 font-bold animate-pulse">
              <Clock className="w-4 h-4 text-red-600 shrink-0" />
              <span>Account locked for security. Please wait {lockoutRemaining}s before retrying.</span>
            </div>
          )}

          {/* Simulated OTP Alert */}
          {simulatedOtpNotice && authMode === 'otp' && (
            <div className="p-3 bg-[#FFDCDC] border border-[#D8A2A2] rounded-2xl text-xs text-[#612f2f] font-bold flex items-center gap-2 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8EA66B] animate-ping shrink-0" />
              <span>{simulatedOtpNotice}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-[#FFDCDC]/80 border border-[#D8A2A2] rounded-xl text-xs text-[#612f2f] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#914d4d]" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {/* MODE 1: Password Login */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'hi' ? 'ईमेल अथवा 10-अंकों का मोबाइल नंबर' : 'Email or Mobile Number'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="demo@gharsetu.in or 9876543210"
                    autoComplete="username"
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8EA66B] focus:border-[#8EA66B]"
                    required
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'hi' ? 'पासवर्ड' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[11px] text-[#8EA66B] hover:text-[#465a31] font-bold underline cursor-pointer"
                  >
                    {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full text-xs pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8EA66B] focus:border-[#8EA66B]"
                    required
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs text-stone-600">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#8EA66B] rounded-xs cursor-pointer focus:ring-[#8EA66B]"
                  />
                  <span>{language === 'hi' ? 'मुझे याद रखें (7 दिन)' : 'Remember me (7 days)'}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || lockoutRemaining > 0}
                className="w-full py-3 bg-[#8EA66B] hover:bg-[#788f57] disabled:bg-stone-300 text-[#FFF9D6] rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Verifying...' : (language === 'hi' ? 'सुरक्षित लॉगिन करें' : 'Sign In Securely')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 2: Mobile OTP Login */}
          {authMode === 'otp' && (
            <div className="space-y-5">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'hi' ? '10-अंकों का मोबाइल नंबर' : '10-digit Indian Mobile Number'}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        maxLength={10}
                        value={otpMobile}
                        onChange={(e) => setOtpMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full text-xs pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#8EA66B]"
                        required
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">
                      {language === 'hi' ? 'परीक्षण हेतु 9876543210 दर्ज करें' : 'Tip: Enter 9876543210 for Ramkishan demo'}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpMobile.length !== 10}
                    className="w-full py-3.5 bg-[#8EA66B] hover:bg-[#788f57] disabled:bg-stone-300 text-[#FFF9D6] rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{loading ? 'Sending OTP...' : (language === 'hi' ? 'मोबाइल पर OTP प्राप्त करें' : 'Get OTP Code')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div className="p-3 bg-[#FAF7EE] rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-stone-500 block text-[10px]">Mobile Number:</span>
                      <span className="font-bold text-stone-900">+91 {otpMobile}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtpCode(''); }}
                      className="text-xs text-[#8EA66B] font-bold underline flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>{language === 'hi' ? 'नंबर बदलें' : 'Edit'}</span>
                    </button>
                  </div>

                  {/* 6-box OtpInput */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-800 text-center">
                      {language === 'hi' ? 'प्राप्त 6-अंकों का ओटीपी दर्ज करें' : 'Enter 6-Digit Verification Code'}
                    </label>
                    <OtpInput
                      value={otpCode}
                      onChange={setOtpCode}
                      length={6}
                      autoFocus={true}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-stone-500">
                      {language === 'hi' ? 'ओटीपी नहीं मिला?' : "Didn't receive code?"}
                    </span>

                    {otpCountdown > 0 ? (
                      <span className="text-stone-400 font-medium">
                        Resend in <span className="font-bold text-[#8EA66B]">{otpCountdown}s</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[#8EA66B] hover:text-[#465a31] font-bold underline cursor-pointer"
                      >
                        {language === 'hi' ? 'ओटीपी पुनः भेजें' : 'Resend OTP'}
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className="w-full py-3.5 bg-[#8EA66B] hover:bg-[#788f57] disabled:bg-stone-300 text-[#FFF9D6] rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{loading ? 'Verifying...' : (language === 'hi' ? '✓ ओटीपी सत्यापित कर लॉगिन करें' : '✓ Verify OTP & Sign In')}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
            <span>{language === 'hi' ? 'नया परिवार हैं?' : 'New family on GharSetu?'} </span>
            <Link to="/signup" className="font-bold text-[#8EA66B] hover:text-[#465a31] underline">
              {language === 'hi' ? 'यहाँ नया खाता बनाएं' : 'Create an Account'}
            </Link>
          </div>
        </div>

        {/* Security footer note */}
        <div className="flex items-center justify-center gap-2 text-stone-500 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8EA66B]" />
          <span>{language === 'hi' ? 'नागरिक गोपनीयता सुरक्षित • शा-256 कूटलेखन' : 'Salted SHA-256 Encryption • Browser Protected'}</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        onPasswordResetSuccess={(id) => {
          setIdentifier(id);
          setPassword('');
          setErrorMsg('');
        }}
      />
    </div>
  );
}
