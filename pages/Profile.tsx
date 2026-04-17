
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    reauthenticateWithCredential,
    EmailAuthProvider,
    deleteUser
} from 'firebase/auth';
import {
    collection,
    getDocs,
    writeBatch,
    doc,
    deleteDoc
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import {
    User,
    Mail,
    Calendar,
    ShieldAlert,
    Trash2,
    Lock,
    Loader2,
    X,
    ArrowLeft,
    AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ADMIN_EMAIL = 'shaikharieshussain09@gmail.com';

export const Profile: React.FC = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isAdmin = user?.email === ADMIN_EMAIL;
    const memberSince = profile?.createdAt
        ? new Date(
            typeof profile.createdAt === 'object' && 'toMillis' in profile.createdAt
                ? profile.createdAt.toMillis()
                : (profile.createdAt as any)
        ).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Unknown';

    const handleDeleteAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !user.email) return;

        setError('');
        setLoading(true);

        try {
            // Step 1: Re-authenticate
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            // Step 2: Delete all habits subcollection
            const habitsRef = collection(db, 'users', user.uid, 'habits');
            const habitsSnapshot = await getDocs(habitsRef);
            if (!habitsSnapshot.empty) {
                const batch = writeBatch(db);
                habitsSnapshot.docs.forEach((docSnap) => {
                    batch.delete(docSnap.ref);
                });
                await batch.commit();
            }

            // Step 3: Delete all sleepLogs subcollection
            const sleepRef = collection(db, 'users', user.uid, 'sleep');
            const sleepSnapshot = await getDocs(sleepRef);
            if (!sleepSnapshot.empty) {
                const batch = writeBatch(db);
                sleepSnapshot.docs.forEach((docSnap) => {
                    batch.delete(docSnap.ref);
                });
                await batch.commit();
            }

            // Step 4: Delete user document
            await deleteDoc(doc(db, 'users', user.uid));

            // Step 5: Delete Firebase Auth user
            await deleteUser(user);

            navigate('/login');
        } catch (err: any) {
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.');
            } else {
                setError(err.message || 'Failed to delete account.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 md:space-y-12 pb-32 animate-in fade-in duration-700 max-w-2xl mx-auto">
            {/* Header */}
            <section className="flex items-center gap-4 px-1">
                <Link
                    to="/dashboard"
                    className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-white transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase italic">
                        Profile
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[8px] md:text-[10px]">
                        Identity Core
                    </p>
                </div>
            </section>

            {/* Profile Card */}
            <section className="bg-gray-900/60 border border-gray-800 rounded-2xl md:rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/5 blur-[100px] rounded-full" />
                <div className="relative z-10">
                    {/* Avatar & Name */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8 mb-10">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-black text-3xl md:text-4xl uppercase shrink-0 shadow-xl shadow-emerald-500/20">
                            {profile?.name?.[0] || 'U'}
                        </div>
                        <div className="text-center sm:text-left flex-1 min-w-0">
                            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter truncate">
                                {profile?.name || 'User'}
                            </h2>
                            {isAdmin && (
                                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                                    <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Admin</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-gray-950/50 border border-gray-800/50 rounded-2xl p-5 md:p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-emerald-500/10 rounded-xl">
                                    <Mail className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em]">Email</span>
                            </div>
                            <p className="text-sm md:text-base text-white font-bold truncate">{profile?.email || 'N/A'}</p>
                        </div>

                        <div className="bg-gray-950/50 border border-gray-800/50 rounded-2xl p-5 md:p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-emerald-500/10 rounded-xl">
                                    <Calendar className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em]">Member Since</span>
                            </div>
                            <p className="text-sm md:text-base text-white font-bold">{memberSince}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="bg-gray-900/40 border border-rose-500/10 rounded-2xl md:rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-500/5 blur-[80px] rounded-full" />
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                        <div className="bg-rose-500/10 p-3 md:p-4 rounded-2xl">
                            <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-rose-400" />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter italic">Danger Zone</h3>
                            <p className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Irreversible Operations</p>
                        </div>
                    </div>

                    <div className="bg-gray-950/50 border border-rose-500/10 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold text-white mb-1">Delete Account</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                Permanently remove all data & credentials
                            </p>
                        </div>
                        <button
                            onClick={() => { setShowDeleteModal(true); setError(''); setPassword(''); }}
                            className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest active:scale-95 shrink-0"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </section>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
                    <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 id="delete-account-title" className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic">Delete Account</h3>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">This action is permanent</p>
                            </div>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl text-gray-400 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5 mb-8">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                                <div className="text-[10px] text-rose-300/80 font-bold leading-relaxed">
                                    This will permanently delete your account, all habits, sleep logs, and profile data. This action cannot be undone.
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleDeleteAccount} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] ml-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        required
                                        type="password"
                                        minLength={8}
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/30 placeholder:text-gray-700"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div role="alert" className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm flex gap-3 items-center animate-in fade-in duration-200">
                                    <ShieldAlert className="w-5 h-5 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all shadow-xl shadow-rose-600/30 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    {loading ? 'Deleting...' : 'Delete Forever'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
