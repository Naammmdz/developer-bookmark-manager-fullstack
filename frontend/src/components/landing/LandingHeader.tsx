import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { cn } from '../../lib/utils';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import { useAuth } from '../../context/AuthContext';
import { useRoleAccess } from '../../hooks/useRoleAccess';

const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useRoleAccess();
  const navigate = useNavigate();

  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
    return isAdmin ? '/app/admin' : '/app';
  };

  // Handle successful login - redirect to main app
  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    navigate('/app');
  };

  // Handle successful registration - redirect to main app
  const handleRegisterSuccess = () => {
    setIsRegisterModalOpen(false);
    navigate('/app');
  };

  const menuItems = [
    { id: 1, label: 'Features', href: '#features' },
    { id: 2, label: 'Pricing', href: '#pricing' },
    { id: 3, label: 'About', href: '#about' },
    { id: 4, label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full -translate-y-4 animate-fade-in border-b border-white/10 bg-background/80 backdrop-blur-md opacity-0">
        <div className="container flex h-14 items-center justify-between px-8">
          <Link className="text-md flex items-center font-bold text-white ml-80" to="/landing">
            Dev Bookmarks
          </Link>

          <div className="hidden md:flex ml-auto h-full items-center space-x-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link className="text-sm text-white/80 hover:text-white transition-colors" to={getDashboardUrl()}>
                    Admin Dashboard
                  </Link>
                )}
                <Link 
                  to="/app" 
                  className="rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors"
                >
                  Go to App
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-white/10"
                >
                  <LogIn size={16} />
                  Login
                </button>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors"
                >
                  <UserPlus size={16} />
                  Register
                </button>
              </>
            )}
          </div>

          <button 
            className="md:hidden text-white/80 hover:text-white" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="fixed left-0 top-0 z-40 h-screen w-full overflow-auto bg-background/90 backdrop-blur-md md:hidden">
          <div className="container flex h-14 items-center justify-between px-6">
            <Link className="text-md flex items-center font-bold text-white" to="/landing">
              Dev Bookmarks
            </Link>
            <button 
              className="text-white/80 hover:text-white" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <ul className="flex flex-col space-y-4 px-6 py-8">
            {menuItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="block py-2 text-lg text-white/80 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  {isAdmin && (
                    <Link 
                      to={getDashboardUrl()}
                      className="block w-full rounded-lg border border-white/20 hover:bg-white/5 px-4 py-3 text-center font-medium text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link 
                    to="/app" 
                    className="block w-full rounded-lg bg-primary hover:bg-primary/90 px-4 py-3 text-center font-medium text-primary-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Go to App
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 w-full rounded-lg border border-white/20 hover:bg-white/5 px-4 py-3 text-white font-medium transition-colors"
                  >
                    <LogIn size={16} />
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsRegisterModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary hover:bg-primary/90 px-4 py-3 text-primary-foreground font-medium transition-colors"
                  >
                    <UserPlus size={16} />
                    Register
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        openRegisterModal={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        openLoginModal={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
        onRegisterSuccess={handleRegisterSuccess}
      />
    </>
  );
};

export default LandingHeader;
