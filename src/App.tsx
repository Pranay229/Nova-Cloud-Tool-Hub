import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Layout/Header';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginModal } from './components/Auth/LoginModal';
import { SignupModal } from './components/Auth/SignupModal';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ToolContainer } from './components/Tools/ToolContainer';
import { ProfileView } from './components/Profile/ProfileView';
import { sessionService } from './services/sessionService';

function AppContent() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const { user, loading } = useAuth();

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      // When browser back/forward is used, reset to dashboard
      if (selectedTool) {
        setSelectedTool(null);
      }
      if (showProfile) {
        setShowProfile(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedTool, showProfile]);

  useEffect(() => {
    if (user) {
      sessionService.startSession();

      const handleBeforeUnload = () => {
        sessionService.endSession();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        sessionService.endSession();
      };
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
        onProfileClick={() => {
          setShowProfile(true);
          setSelectedTool(null);
          // Update browser history
          window.history.pushState({ page: 'profile' }, '', window.location.pathname);
        }}
      />

      {user ? (
        showProfile ? (
          <div className="min-h-screen bg-gray-900 pt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <button
                onClick={() => {
                  setShowProfile(false);
                  setSelectedTool(null);
                  // Update browser history
                  window.history.pushState({ page: 'dashboard' }, '', window.location.pathname);
                }}
                className="flex items-center gap-2 mb-6 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-2 py-1"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
              <ProfileView />
            </div>
          </div>
        ) : selectedTool ? (
          <ToolContainer
            toolId={selectedTool}
            onBack={() => {
              setSelectedTool(null);
              // Update browser history
              window.history.pushState({ page: 'dashboard' }, '', window.location.pathname);
            }}
          />
        ) : (
          <Dashboard onSelectTool={(toolId) => {
            setSelectedTool(toolId);
            // Update browser history when navigating to a tool
            window.history.pushState({ page: 'tool', toolId }, '', window.location.pathname);
          }} />
        )
      ) : (
        <LandingPage onGetStarted={() => setShowSignup(true)} />
      )}

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />

      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
