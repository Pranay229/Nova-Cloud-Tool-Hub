import { useState } from 'react';
import { Menu, X, Sparkles, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onProfileClick?: () => void;
}

export function Header({ onLoginClick, onSignupClick, onProfileClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed w-full bg-gray-900/90 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img 
                src="/icoh
                n.svg" 
                alt="Nova Logo" 
                className="w-10 h-10 rounded-lg"
              />
            </div>
            <span className="text-xl font-bold text-gray-100">Nova Cloud stack Tool's</span>
          </div>

          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-gray-400">{user.email}</span>
              {onProfileClick && (
                <button
                  onClick={onProfileClick}
                  className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-400 hover:text-gray-200 transition-colors">Features</a>
                <a href="#pricing" className="text-gray-400 hover:text-gray-200 transition-colors">Pricing</a>
                <a href="#about" className="text-gray-400 hover:text-gray-200 transition-colors">About</a>
                <a href="#contact" className="text-gray-400 hover:text-gray-200 transition-colors">Contact</a>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={onLoginClick}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onSignupClick}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-400"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900">
          <div className="px-4 py-6 space-y-4">
            {user ? (
              <>
                <div className="text-gray-200 font-medium">{user.email}</div>
                {onProfileClick && (
                  <button
                    onClick={onProfileClick}
                    className="block w-full text-left text-gray-400 hover:text-gray-200"
                  >
                    Profile
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-gray-400 hover:text-gray-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a href="#features" className="block text-gray-400 hover:text-gray-200">Features</a>
                <a href="#pricing" className="block text-gray-400 hover:text-gray-200">Pricing</a>
                <a href="#about" className="block text-gray-400 hover:text-gray-200">About</a>
                <a href="#contact" className="block text-gray-400 hover:text-gray-200">Contact</a>
                <div className="pt-4 space-y-2">
                  <button
                    onClick={onLoginClick}
                    className="w-full text-gray-400 hover:text-gray-200 py-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={onSignupClick}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg"
                  >
                    Get Started
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
