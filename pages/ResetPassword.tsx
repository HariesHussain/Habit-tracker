
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { 
  Lock, 
  CheckCircle2, 
  Loader2, 
  ShieldAlert, 
  ArrowRight, 
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidCode, setIsValidCode] = useState<boolean | null>(null);

  useEffect(() => {
    if (!oobCode) {
      setError("Invalid or missing reset code.");
      setIsValidCode(false);
      return;
    }

    // Verify the password reset code is valid
    verifyPasswordResetCode(auth, oobCode)
      .then(() => setIsValidCode(true))
      .catch((err) => {
        console.error(err);
        setError("The reset link is invalid or has expired.");
        setIsValidCode(false);
      });
  }, [oobCode]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!oobCode) return;
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess("Password successfully updated!");
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const ErrorAlert = () => (
    error ? (
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm flex gap-3 items-center animate-in fade-in slide-in-from-top-1 duration-200">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <p>{error}</p>
      </div>
    ) : null
  );

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="text-center">
          <div className="inline-flex p-4 bg-emerald-500/10 rounded-3xl mb-6">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase italic">Update Core</h1>
          <p className="text-gray-500 font-medium">Re-establish secure access to your profile.</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl relative">
          {isValidCode === false ? (
            <div className="space-y-6 text-center">
              <ErrorAlert />
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    required 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => { setNewPassword(e.target.value); setError(""); }} 
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    required 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }} 
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <ErrorAlert />
              {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  {success}
                </div>
              )}

              <button 
                disabled={loading || isValidCode === null} 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group mt-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="w-full max-w-md py-8 mt-auto flex flex-col items-center justify-center gap-2 opacity-40">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Engine Security v2.5</p>
      </footer>
    </div>
  );
};
