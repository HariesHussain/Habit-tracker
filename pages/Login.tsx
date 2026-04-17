
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { CheckCircle2, Mail, Lock, User, ArrowRight, Loader2, ShieldAlert, ChevronLeft } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { KEYS } from '../apiKeys';
import emailjs from '@emailjs/browser';
import { normalizeOtpInput, sanitizeEmail, sanitizeText, validateDisplayName, validateEmail, validatePassword } from '../lib/security';

type AuthMode = 'login' | 'signup' | 'forgot' | 'otp';

export const Login: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // DEEP LINK HANDLER: Detects Firebase reset parameters in the URL 
  // Improved to check window.location.search for standard non-hash params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const firebaseMode = urlParams.get('mode') || searchParams.get('mode');
    const oobCode = urlParams.get('oobCode') || searchParams.get('oobCode');

    if (firebaseMode === 'resetPassword' && oobCode) {
      navigate(`/reset-password?oobCode=${oobCode}`);
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    let interval: number;
    if (resendTimer > 0) {
      interval = window.setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const getFriendlyErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/weak-password':
        return 'Password is too weak.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const cleanEmail = sanitizeEmail(email);
    if (!validateEmail(cleanEmail)) return setError("Invalid email.");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setSuccess("Check your inbox! Reset link sent.");
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const sendOtpEmail = async () => {
    if (resendTimer > 0) return;
    setError("");
    setLoading(true);
    try {
      const cleanName = sanitizeText(name, 50);
      const cleanEmail = sanitizeEmail(email);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      await emailjs.send(KEYS.emailjs.serviceId, KEYS.emailjs.templateId, { to_name: cleanName, to_email: cleanEmail, otp: code }, KEYS.emailjs.publicKey);
      setResendTimer(60);
      setSuccess("Verification code sent!");
      return true;
    } catch (err) {
      setError("Failed to send email.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const startSignupFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanEmail = sanitizeEmail(email);
    const cleanName = sanitizeText(name, 50);
    if (!validateDisplayName(cleanName)) return setError("Name must be 2-50 letters.");
    if (!validateEmail(cleanEmail)) return setError("Invalid email.");
    if (!validatePassword(password)) return setError("Password must be at least 8 characters.");
    const sent = await sendOtpEmail();
    if (sent) setMode('otp');
  };

  const verifyOtpAndCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanOtp = normalizeOtpInput(otpInput);
    const cleanEmail = sanitizeEmail(email);
    const cleanName = sanitizeText(name, 50);

    if (!validateDisplayName(cleanName)) return setError("Name must be 2-50 letters.");
    if (!validateEmail(cleanEmail)) return setError("Invalid email.");
    if (!validatePassword(password)) return setError("Password must be at least 8 characters.");
    if (cleanOtp !== generatedOtp) return setError("Invalid OTP");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      await updateProfile(userCredential.user, { displayName: cleanName });
      await setDoc(doc(db, 'users', userCredential.user.uid), { uid: userCredential.user.uid, name: cleanName, email: cleanEmail, createdAt: Date.now() });
      navigate('/dashboard');
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanEmail = sanitizeEmail(email);
    if (!validateEmail(cleanEmail)) return setError("Invalid email.");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const ErrorAlert = () => (
    error ? (
      <div role="alert" className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm flex gap-3 items-center animate-in fade-in slide-in-from-top-1 duration-200">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <p>{error}</p>
      </div>
    ) : null
  );

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md space-y-8 z-10 flex-1 flex flex-col justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-emerald-500/10 rounded-3xl mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase italic">Habit Tracker</h1>
          <p className="text-gray-500 font-medium">Master your consistency. Master your life.</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl relative">
          {mode === 'otp' ? (
            <form onSubmit={verifyOtpAndCreateAccount} className="space-y-6">
              <button type="button" onClick={() => { setMode('signup'); setError(""); }} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold mb-4">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Verify Email</h3>
                <p className="text-sm text-gray-400">Code sent to <strong>{email}</strong></p>
              </div>
              <input 
                required 
                type="text" 
                maxLength={6} 
                value={otpInput} 
                onChange={(e) => { setOtpInput(normalizeOtpInput(e.target.value)); setError(""); }} 
                inputMode="numeric"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl p-4 text-white text-2xl tracking-[0.5em] font-black focus:outline-none text-center" 
                placeholder="000000" 
              />
              <ErrorAlert />
              <button disabled={loading} type="submit" className="w-full bg-emerald-500 py-4 rounded-2xl text-white font-bold shadow-xl shadow-emerald-500/20">{loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Verify & Continue'}</button>
            </form>
          ) : (
            <form onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? startSignupFlow : handleForgotPassword} className="space-y-5">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input required type="text" value={name} maxLength={50} onChange={(e) => { setName(sanitizeText(e.target.value, 50)); setError(""); }} className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="Your name" />
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input required type="email" value={email} onChange={(e) => { setEmail(sanitizeEmail(e.target.value)); setError(""); }} className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="name@example.com" />
                </div>
              </div>

              {(mode === 'login' || mode === 'signup') && (
                <div className="space-y-1 animate-in fade-in duration-300">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input required type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="••••••••" />
                  </div>
                  {mode === 'login' && (
                    <div className="flex justify-end pt-2 pr-1">
                      <button 
                        type="button" 
                        onClick={() => { setMode('forgot'); setError(""); setSuccess(""); }} 
                        className="text-[10px] font-bold text-emerald-500 uppercase hover:text-emerald-400 transition-colors tracking-widest"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              <ErrorAlert />
              {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm flex items-center gap-3 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group mt-2 active:scale-95 transition-all">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <span>{mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Get Started' : 'Reset Password'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="pt-4 text-center">
                <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(""); setSuccess(""); }} className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                  {mode === 'login' ? "New here? Create account" : "Wait, I remember my password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <footer className="w-full max-w-md py-8 mt-auto flex flex-col items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
          Created by
        </p>
        <p className="text-xs font-bold text-gray-300 tracking-[0.2em] flex items-center gap-2 italic">
          Shaik Haries Hussain
        </p>
      </footer>
    </div>
  );
};
