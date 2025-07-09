import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RootRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't navigate while still loading
    if (isLoading) return;

    // If user is authenticated, redirect to main app
    if (user) {
      navigate('/app', { replace: true });
    } else {
      // If user is not authenticated, redirect to landing page
      navigate('/landing', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // This should not render for long as useEffect will redirect
  return null;
};

export default RootRoute;
