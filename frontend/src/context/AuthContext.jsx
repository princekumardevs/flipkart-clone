import { createContext, useContext, useState, useEffect } from 'react';
import  api  from '../lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(localStorage.getItem('guestMode') === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
          setIsGuest(false);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
          setIsGuest(localStorage.getItem('guestMode') === 'true');
        }
      } else {
        setUser(null);
        setIsGuest(localStorage.getItem('guestMode') === 'true');
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const data = res.data;
      localStorage.setItem('token', data.token);
      localStorage.removeItem('guestMode');
      setUser(data);
      setIsGuest(false);
      toast.success('Logged in successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const signup = async (firstName, lastName, email, password) => {
    try {
      const res = await api.post('/api/auth/register', { firstName, lastName, email, password });
      const data = res.data;
      localStorage.setItem('token', data.token);
      localStorage.removeItem('guestMode');
      setUser(data);
      setIsGuest(false);
      toast.success('Account created successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('guestMode');
    setUser(null);
    setIsGuest(false);
    toast.success('Logged out');
  };

  const continueAsGuest = () => {
    localStorage.removeItem('token');
    localStorage.setItem('guestMode', 'true');
    setUser(null);
    setIsGuest(true);
    toast.success('Continuing as Guest');
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, login, signup, logout, continueAsGuest, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
