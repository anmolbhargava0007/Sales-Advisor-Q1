import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, userRole } = useAuth();
  
  useEffect(() => {
    if (!loading) {
      // Redirect based on authentication state and user role
      if (isAuthenticated) {
        if (userRole === 1) {
          // Super Admin redirects to dashboard
          navigate('/dashboard');
        } else {
          // Other users (like Guests) redirect to workspace
          navigate('/workspace');
        }
      } else {
        // Not authenticated users redirect to signin
        navigate('/signin');
      }
    }
  }, [navigate, isAuthenticated, loading, userRole]);
  
  return (
    <div className="font-poppins min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center font-poppins">
        <h1 className="text-4xl font-bold mb-4">Loading SalesAdvisor...</h1>
      </div>
    </div>
  );
};

export default Index;
