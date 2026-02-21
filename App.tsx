
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { YearlyOverview } from './pages/YearlyOverview';
import { ResetPassword } from './pages/ResetPassword';
import { Profile } from './pages/Profile';
import { Layout } from './components/Layout';
import { CheckCircle2, Loader2 } from 'lucide-react';

const GlobalLoader = () => (
  <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-[9999] p-6 text-center">
    <div className="relative mb-10">
      <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full scale-150 animate-pulse" />
      <div className="relative z-10 bg-gray-900 border border-gray-800 p-8 rounded-[3rem] shadow-2xl">
        <CheckCircle2 className="w-14 h-14 text-emerald-500 loading-pulse mx-auto" />
      </div>
    </div>
    <div className="flex flex-col items-center gap-4 max-w-xs">
      <h2 className="text-2xl font-black text-white tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
        Habit Tracker
      </h2>
      <p className="text-gray-500 text-sm font-medium">Securing connection to encrypted core...</p>
      <div className="flex gap-2 mt-2">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" />
      </div>
    </div>

    <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-40">
      <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
      <span className="text-[10px] font-bold text-gray-600 tracking-[0.3em] uppercase">Engine v2.5</span>
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <GlobalLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/yearly"
            element={
              <ProtectedRoute>
                <YearlyOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
