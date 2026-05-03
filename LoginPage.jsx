// web/src/pages/LoginPage.jsx
// Phone OTP login — works for Marathi/Hindi speaking users

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendOTP, verifyOTP } from '../services/firebase';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LANGS = [
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
];

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { refreshProfile } = useAuth();

  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'name'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    setError('');
    if (!phone || phone.length < 10) return setError('कृपया योग्य मोबाईल नंबर टाका');
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      await sendOTP(formattedPhone);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    if (otp.length !== 6) return setError('6 अंकी OTP टाका');
    setLoading(true);
    try {
      const firebaseUser = await verifyOTP(otp);
      const res = await registerUser({ name: 'temp', preferredLang: i18n.language });
      if (res.isNewUser) {
        setIsNewUser(true);
        setStep('name');
      } else {
        await refreshProfile();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetName = async () => {
    if (!name.trim()) return setError('नाव आवश्यक आहे');
    setLoading(true);
    try {
      await registerUser({ name: name.trim(), preferredLang: i18n.language });
      await refreshProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container" />

      {/* Language selector */}
      <div className="flex gap-2 mb-8">
        {LANGS.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => { i18n.changeLanguage(code); localStorage.setItem('lang', code); }}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              i18n.language === code
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏦</div>
          <h1 className="text-2xl font-bold text-green-800">{t('app_name')}</h1>
          <p className="text-gray-500 text-sm mt-1">स्वयंसहायता बचत गट</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Phone */}
        {step === 'phone' && (
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium">{t('enter_mobile')}</label>
            <div className="flex">
              <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg text-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl text-lg transition disabled:opacity-50"
            >
              {loading ? t('loading') : t('send_otp')}
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium">{t('enter_otp')}</label>
            <p className="text-gray-500 text-sm">+91 {phone} वर OTP पाठवला</p>
            <input
              type="number"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.slice(0, 6))}
              placeholder="6 अंकी OTP"
              className="w-full px-4 py-4 border border-gray-300 rounded-xl text-2xl text-center tracking-widest focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl text-lg transition disabled:opacity-50"
            >
              {loading ? t('loading') : t('verify_otp')}
            </button>
            <button onClick={() => setStep('phone')} className="w-full text-gray-500 text-sm py-2">
              ← {t('back')}
            </button>
          </div>
        )}

        {/* Step 3: Name (new users only) */}
        {step === 'name' && (
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium">आपले नाव सांगा</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="उदा. सुनीता पाटील"
              className="w-full px-4 py-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleSetName}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl text-lg transition disabled:opacity-50"
            >
              {loading ? t('loading') : 'पुढे जा →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}