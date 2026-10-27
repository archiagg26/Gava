import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { cryptoService } from '../services/cryptoService';
import OtpInput from './OtpInput';
import {
  KeyRound,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose, onPasswordResetSuccess }) {
  const { requestOtp, resetPassword, loading } = useAuth();
  const { language } = useLanguage();

  const [step, setStep] = useState(1); // 1: Enter Identifier, 2: Enter OTP & New Password, 3: Success
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const strength = cryptoService.evaluatePasswordStrength(newPassword);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया ईमेल या मोबाइल नंबर दर्ज करें।' : 'Please enter your email or mobile.');
      return;
    }

    const res = await requestOtp(identifier);
    if (res.success) {
      setSimulatedOtpNotice(`SMS/Email Simulation: Verification OTP is ${res.otp}`);
      setStep(2);
    } else {
      setErrorMsg(res.error || 'Failed to dispatch OTP.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpCode.trim() || otpCode.length !== 6) {
      setErrorMsg(language === 'hi' ? 'कृपया 6-अंकों का वैध ओटीपी दर्ज करें।' : 'Please enter a valid 6-digit OTP.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg(language === 'hi' ? 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(language === 'hi' ? 'दोनों पासवर्ड समान होने चाहिए।' : 'Passwords do not match.');
      return;
    }

    const res = await resetPassword({ identifier, otp: otpCode, newPassword });
    if (res.success) {
      setSuccessMsg(res.message);
      setStep(3);
      if (onPasswordResetSuccess) {
        onPasswordResetSuccess(identifier);
      }
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleClose = () => {
    setStep(1);
    setIdentifier('');
    setOtpCode('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg('');
    setSimulatedOtpNotice(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-[#D8A2A2] animate-in fade-in duration-150">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#FFF9D6] text-[#8EA66B] flex items-center justify-center mb-3 border border-[#D8A2A2]">
          <KeyRound className="w-6 h-6 text-[#8EA66B]" />
        </div>

        <h3 className="text-lg font-bold text-stone-900 mb-1">
          {language === 'hi' ? 'पासवर्ड रीसेट करें' : 'Reset Your Password'}
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          {language === 'hi'
            ? 'ओटीपी सत्यापन के माध्यम से अपने खाते का नया पासवर्ड बनाएं।'
            : 'Verify your registered mobile or email to create a new password.'}
        </p>

        {/* Simulated SMS delivery notification */}
        {simulatedOtpNotice && (
          <div className="mb-4 p-2.5 bg-[#FFDCDC] border border-[#D8A2A2] rounded-xl text-xs text-[#612f2f] font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8EA66B] animate-ping" />
            <span>{simulatedOtpNotice}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Identifier */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'hi' ? 'पंजीकृत ईमेल या 10-अंकों का मोबाइल' : 'Registered Email or Mobile'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="demo@gharsetu.in or 9876543210"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#8EA66B]"
                  required
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{loading ? 'Sending OTP...' : (language === 'hi' ? 'ओटीपी कोड भेजें' : 'Send OTP Code')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: OTP & New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1 text-center">
                {language === 'hi' ? '6-अंकों का ओटीपी दर्ज करें' : 'Enter 6-Digit OTP'}
              </label>
              <OtpInput
                value={otpCode}
                onChange={setOtpCode}
                length={6}
                autoFocus={true}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'hi' ? 'नया पासवर्ड' : 'New Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-3 pr-9 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#8EA66B]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Strength meter */}
              {newPassword && (
                <div className="mt-1.5 space-y-1">
                  <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${strength.color}`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-500">
                    Strength: <span className="font-semibold">{language === 'hi' ? strength.labelHi : strength.label}</span>
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'hi' ? 'नए पासवर्ड की पुष्टि करें' : 'Confirm New Password'}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#8EA66B]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{loading ? 'Updating...' : (language === 'hi' ? 'पासवर्ड बदलें' : 'Update Password')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 3: Success Confirmation */}
        {step === 3 && (
          <div className="text-center py-4 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#8EA66B] mx-auto" />
            <p className="text-xs text-stone-700 leading-relaxed font-semibold">
              {successMsg}
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-[#8EA66B] text-[#FFF9D6] rounded-xl text-xs font-bold shadow-xs hover:bg-[#788f57]"
            >
              {language === 'hi' ? 'लॉगिन स्क्रीन पर जाएं' : 'Proceed to Sign In'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
