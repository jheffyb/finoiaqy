
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import AuthPage from '@/components/auth/AuthPage.jsx';
import DashboardLayout from '@/components/layout/DashboardLayout.jsx';
import DashboardPage from '@/components/dashboard/DashboardPage.jsx';
import ClientsPage from '@/components/clients/ClientsPage.jsx';
import ClientDetailPage from '@/components/clients/ClientDetailPage.jsx';
import LoansPage from '@/components/loans/LoansPage.jsx';
import LoanDetailPage from '@/components/loans/LoanDetailPage.jsx';
import InvestmentsPage from '@/components/investments/InvestmentsPage.jsx';
import ReportsPage from '@/components/reports/ReportsPage.jsx';
import DocumentsPage from '@/components/documents/DocumentsPage.jsx';
import NotificationsPage from '@/components/notifications/NotificationsPage.jsx';
import SettingsPage from '@/components/settings/SettingsPage.jsx';
import PixSettingsPage from '@/components/settings/PixSettingsPage.jsx';
import HelpPage from '@/components/help/HelpPage.jsx';
import PartnersPage from '@/components/partners/PartnersPage.jsx';
import { useSound } from '@/hooks/useSound.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { playSound } = useSound();
  const location = useLocation();

  useEffect(() => {
    const authStatus = localStorage.getItem('fin_oiaqy_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('fin_oiaqy_auth', 'true');
      setIsAuthenticated(true);
      setIsLoading(false);
      playSound('notification-chime');
      playSound('swoosh');
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('fin_oiaqy_auth');
    setIsAuthenticated(false);
    playSound('click');
    playSound('swoosh');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animated-bg" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-400 border-t-transparent rounded-full spin" />
          <h2 className="text-2xl font-bold gradient-text mb-2">Fin Oiaqy ®</h2>
          <p className="text-gray-300">Carregando experiência cristalina...</p>
        </motion.div>
      </div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, x: location.pathname === '/auth' ? -100 : 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: location.pathname === '/auth' ? 100 : -100 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.5,
  };

  return (
    <div className="min-h-screen">
      <div className="animated-bg" />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {!isAuthenticated ? (
            <Route
              path="/auth"
              element={
                <motion.div
                  key="authPage"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AuthPage onLogin={handleLogin} />
                </motion.div>
              }
            />
          ) : (
            <Route
              path="/"
              element={
                <motion.div
                  key="dashboardLayout"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <DashboardLayout onLogout={handleLogout} />
                </motion.div>
              }
            >
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="clients/:clientId" element={<ClientDetailPage />} />
              <Route path="loans" element={<LoansPage />} /> 
              <Route path="loans/:loanId" element={<LoanDetailPage />} />
              <Route path="partners" element={<PartnersPage />} />
              <Route path="investments" element={<InvestmentsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="settings/pix" element={<PixSettingsPage />} />
              <Route path="help" element={<HelpPage />} />
            </Route>
          )}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />} />
        </Routes>
      </AnimatePresence>
      <Toaster />
    </div>
  );
}

export default App;
