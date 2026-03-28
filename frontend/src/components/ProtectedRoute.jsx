import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-flipkart-light flex justify-center items-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#e0e0e0] border-top-flipkart-blue animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
