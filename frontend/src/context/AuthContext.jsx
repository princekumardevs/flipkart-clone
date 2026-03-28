import { createContext, useContext, useState, useEffect } from 'react';
import  api  from '../lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Temporarily attach token to this request if api doesn't auto do it
          // In lib/api.js we should ideally have an interceptor, but we'll manually fetch here if needed
          const res = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error(err);
        }
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
      setUser(data);
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
      setUser(data);
      toast.success('Account created successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
