import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import confetti from 'canvas-confetti';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const session = authService.getSession();
    return session ? session.user : null;
  });
  const [session, setSession] = useState(() => authService.getSession());
  const [loading, setLoading] = useState(false);
  const isRemoteBackend = authService.isRemoteBackend();

  // Listen to remote Supabase auth state changes if configured
  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
        if (s?.user) {
          const user = {
            id: s.user.id,
            name: s.user.user_metadata?.full_name || s.user.email?.split('@')[0],
            email: s.user.email,
            mobile: s.user.phone || '',
            role: 'Citizen'
          };
          setCurrentUser(user);
          setSession({ user, token: s.access_token });
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setSession(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const loginWithPassword = async ({ identifier, password, rememberMe = true }) => {
    setLoading(true);
    const result = await authService.signInWithPassword({ identifier, password, rememberMe });
    setLoading(false);

    if (result.success) {
      setCurrentUser(result.user);
      setSession(authService.getSession());
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    }
    return result;
  };

  const loginWithOtp = async ({ identifier, otp }) => {
    setLoading(true);
    const result = await authService.signInWithOTP(identifier, otp);
    setLoading(false);

    if (result.success) {
      setCurrentUser(result.user);
      setSession(authService.getSession());
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    }
    return result;
  };

  const signup = async (userData) => {
    setLoading(true);
    const result = await authService.signUp(userData);
    setLoading(false);

    if (result.success) {
      setCurrentUser(result.user);
      setSession(authService.getSession());
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
    return result;
  };

  const requestOtp = async (identifier) => {
    return authService.requestOTP(identifier);
  };

  const verifyOtp = async (identifier, code) => {
    return authService.verifyOTP(identifier, code);
  };

  const resetPassword = async (data) => {
    setLoading(true);
    const result = await authService.resetPassword(data);
    setLoading(false);
    return result;
  };

  const changePassword = async ({ oldPassword, newPassword }) => {
    if (!currentUser) return { success: false, error: 'Not authenticated.' };
    return authService.changePassword(currentUser.id, oldPassword, newPassword);
  };

  const quickLogin = async (userId) => {
    const users = await authService.getUsers();
    const user = users.find(u => u.id === userId) || users[0];
    if (user) {
      return loginWithPassword({ identifier: user.email, password: 'demo1234', rememberMe: true });
    }
  };

  const logout = () => {
    authService.clearSession();
    setCurrentUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        session,
        isAuthenticated: Boolean(currentUser),
        isRemoteBackend,
        loading,
        loginWithPassword,
        loginWithOtp,
        signup,
        requestOtp,
        verifyOtp,
        resetPassword,
        changePassword,
        quickLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
