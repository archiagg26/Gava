import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { cryptoService } from '../services/cryptoService';
import OtpInput from '../components/OtpInput';
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  RotateCcw,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const INDIAN_STATES = [
  "Uttar Pradesh", "Madhya Pradesh", "Bihar", "Rajasthan", "Odisha",
  "Assam", "West Bengal", "Chhattisgarh", "Jharkhand", "Maharashtra",
  "Gujarat", "Punjab", "Haryana", "Uttarakhand"
];

export default function Signup() {
  const { signup, requestOtp, verifyOtp, loading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Step 1: Form details, Step 2: OTP verification
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    state: 'Uttar Pradesh',
    district: '',
    village: '',
    isWomanHead: false,
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const passwordStrength = cryptoService.evaluatePasswordStrength(formData.password);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Step 1 Submit: Validate and Send OTP
  const handleProceedToOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }

    const cleanMobile = formData.mobile.trim();
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg(language === 'hi' ? 'कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (उदा. 9876543210)।' : 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg(language === 'hi' ? 'कृपया वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }

    if (!formData.district.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया अपना ज़िला दर्ज करें।' : 'Please enter your district.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg(language === 'hi' ? 'पासवर्ड मेल नहीं खा रहे हैं।' : 'Passwords do not match.');
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMsg(language === 'hi' ? 'कृपया नागरिक सेवा शर्तों की सहमति दें।' : 'Please agree to citizen terms.');
      return;
    }

    // Dispatch OTP
    const res = await requestOtp(cleanMobile);
    if (res.success) {
      setSimulatedOtpNotice(`📩 SMS Gateway (Demo): Verification OTP is ${res.otp}`);
      setResendCountdown(30);
      setCurrentStep(2);
    } else {
      setErrorMsg(res.error || 'Failed to dispatch OTP.');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setErrorMsg('');
    const res = await requestOtp(formData.mobile.trim());
    if (res.success) {
      setSimulatedOtpNotice(`📩 New SMS Gateway (Demo): Verification OTP is ${res.otp}`);
      setResendCountdown(30);
    } else {
      setErrorMsg(res.error || 'Failed to resend OTP.');
    }
  };

  // Step 2 Submit: Verify OTP & Activate Account
  const handleVerifyOtpAndSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.length !== 6) {
      setErrorMsg(language === 'hi' ? 'कृपया 6-अंकों का पूरा ओटीपी दर्ज करें।' : 'Please enter the complete 6-digit OTP code.');
      return;
    }

    setVerifyingOtp(true);
    // 1. Verify OTP with backend authService
    const verifyRes = await verifyOtp(formData.mobile.trim(), otpCode);
    if (!verifyRes.success) {
      setVerifyingOtp(false);
      setErrorMsg(verifyRes.error || 'Invalid OTP code.');
      return;
    }

    // 2. Register user now that mobile is verified
    const signupRes = await signup({
      ...formData,
      isMobileVerified: true
    });
    setVerifyingOtp(false);

    if (signupRes.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(signupRes.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#8EA66B] text-[#FFF9D6] mx-auto flex items-center justify-center font-bold text-xl shadow-xs border border-[#8EA66B]/50">
            {currentStep === 1 ? (
              <UserPlus className="w-6 h-6 text-[#FFF9D6]" />
            ) : (
              <Smartphone className="w-6 h-6 text-[#FFF9D6]" />
            )}
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            {currentStep === 1
              ? (language === 'hi' ? 'नया नागरिक खाता बनाएं' : 'Create Your Citizen Account')
              : (language === 'hi' ? 'मोबाइल नंबर सत्यापन (OTP)' : 'Verify Your Mobile Number')}
          </h1>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            {currentStep === 1
              ? (language === 'hi' ? 'अपनी ज़मीन पर आवास योजना अधिकार एवं दस्तावेज़ जांचने हेतु पंजीकरण करें।' : 'Register to verify your PMAY-G rights and organize land documents.')
              : (language === 'hi' ? `मोबाइल +91 ${formData.mobile} पर भेजे गए 6-अंकों के ओटीपी को दर्ज करें।` : `Enter the 6-digit OTP sent to +91 ${formData.mobile} to activate your account.`)}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm space-y-5">
          {/* Step indicator pill */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[#8EA66B]">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep === 1 ? 'bg-[#8EA66B] text-[#FFF9D6]' : 'bg-[#FFF9D6] text-[#8EA66B] border border-[#8EA66B]'
              }`}>
                1
              </span>
              <span>{language === 'hi' ? 'नागरिक विवरण' : 'Citizen Details'}</span>
            </span>

            <span className="text-stone-300">———</span>

            <span className={`flex items-center gap-1.5 ${currentStep === 2 ? 'text-[#8EA66B]' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep === 2 ? 'bg-[#8EA66B] text-[#FFF9D6]' : 'bg-stone-100 text-stone-500'
              }`}>
                2
              </span>
              <span>{language === 'hi' ? 'ओटीपी सत्यापन' : 'OTP Verification'}</span>
            </span>
          </div>

          {/* Simulated SMS Alert */}
          {simulatedOtpNotice && currentStep === 2 && (
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

          {/* STEP 1: Registration Form */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'hi' ? 'परिवार मुखिया / आवेदक का पूरा नाम *' : 'Applicant Full Name *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramkishan Yadav"
                    autoComplete="name"
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8EA66B]"
                    required
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? '10-अंकों का मोबाइल नंबर (OTP सत्यापन हेतु) *' : 'Mobile Number (for OTP) *'}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                      placeholder="9876543210"
                      maxLength={10}
                      autoComplete="tel"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8EA66B]"
                      required
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'ईमेल पता (वैकल्पिक)' : 'Email Address (Optional)'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="family@example.com"
                      autoComplete="email"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8EA66B]"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'राज्य' : 'State'}
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#8EA66B]"
                  >
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'ज़िला *' : 'District *'}
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Sitapur"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Gender priority indicator */}
              <div className="p-3 bg-[#FFF9D6] rounded-2xl border border-[#D8A2A2]">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.isWomanHead}
                    onChange={(e) => setFormData({ ...formData, isWomanHead: e.target.checked })}
                    className="w-4 h-4 text-[#8EA66B] rounded-xs cursor-pointer focus:ring-[#8EA66B]"
                  />
                  <span className="font-semibold text-[#2c3a1e]">
                    {language === 'hi' ? 'परिवार की मुखिया महिला / एकल माता हैं (PMAY-G प्राथमिकता)' : 'Applicant is a woman head of family / single mother (PMAY-G priority)'}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'पासवर्ड (कम से कम 6 अक्षर) *' : 'Password (min. 6 chars) *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full text-xs pl-9 pr-9 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8EA66B]"
                      required
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="mt-1 space-y-1">
                      <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-stone-500 font-medium">
                        Strength: <span className="font-bold">{language === 'hi' ? passwordStrength.labelHi : passwordStrength.label}</span>
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'hi' ? 'पासवर्ड की पुष्टि करें *' : 'Confirm Password *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8EA66B]"
                      required
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Terms Consent */}
              <div className="text-xs text-stone-600">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="w-4 h-4 text-[#8EA66B] rounded-xs cursor-pointer mt-0.5"
                  />
                  <span>
                    {language === 'hi'
                      ? 'मैं पुष्टि करता हूँ कि यह एक नागरिक सहायता मंच है और मेरे दस्तावेज़ केवल मेरे ब्राउज़र में सुरक्षित जाँचे जाएंगे।'
                      : 'I understand this is an independent civic tool and my records stay in my browser.'}
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{loading ? 'Sending OTP...' : (language === 'hi' ? 'मोबाइल पर OTP भेजें व आगे बढ़ें' : 'Send OTP to Mobile & Continue')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Dedicated OTP Verification Screen */}
          {currentStep === 2 && (
            <form onSubmit={handleVerifyOtpAndSignup} className="space-y-6">
              <div className="p-3 bg-[#FAF7EE] rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 block text-[10px]">Verifying Mobile Number:</span>
                  <span className="font-bold text-stone-900">+91 {formData.mobile}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setCurrentStep(1); setOtpCode(''); }}
                  className="text-xs text-[#8EA66B] font-bold underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>{language === 'hi' ? 'नंबर बदलें' : 'Edit'}</span>
                </button>
              </div>

              {/* 6-box interactive OTP input */}
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

              {/* Resend Controls */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-stone-500">
                  {language === 'hi' ? 'ओटीपी नहीं मिला?' : "Didn't receive code?"}
                </span>

                {resendCountdown > 0 ? (
                  <span className="text-stone-400 font-medium">
                    Resend in <span className="font-bold text-[#8EA66B]">{resendCountdown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#8EA66B] hover:text-[#465a31] font-bold underline cursor-pointer"
                  >
                    {language === 'hi' ? 'ओटीपी पुनः भेजें' : 'Resend OTP'}
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={verifyingOtp || otpCode.length !== 6}
                className="w-full py-3.5 bg-[#8EA66B] hover:bg-[#788f57] disabled:bg-stone-300 text-[#FFF9D6] rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{verifyingOtp ? 'Verifying OTP & Activating...' : (language === 'hi' ? '✓ ओटीपी सत्यापित करें व खाता सक्रिय करें' : '✓ Verify OTP & Activate Account')}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
            <span>{language === 'hi' ? 'पहले से खाता है?' : 'Already have an account?'} </span>
            <Link to="/login" className="font-bold text-[#8EA66B] hover:text-[#465a31] underline">
              {language === 'hi' ? 'लॉगिन करें' : 'Sign In here'}
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-stone-500 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8EA66B]" />
          <span>{language === 'hi' ? 'सुरक्षित ओटीपी प्रमाणीकरण • 100% निःशुल्क' : 'Secure OTP Authentication • 100% Free Civic Platform'}</span>
        </div>
      </div>
    </div>
  );
}
