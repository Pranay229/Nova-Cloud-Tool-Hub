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
        }}
      />

      {user ? (
        showProfile ? (
          <div className="min-h-screen bg-gray-900 pt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <button
                onClick={() => setShowProfile(false)}
                className="mb-6 text-gray-400 hover:text-gray-200 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <ProfileView />
            </div>
          </div>
        ) : selectedTool ? (
          <ToolContainer
            toolId={selectedTool}
            onBack={() => setSelectedTool(null)}
          />
        ) : (
          <Dashboard onSelectTool={setSelectedTool} />
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
