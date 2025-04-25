import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import * as auth from '../utils/auth';

export interface UserProfile {
  id: string;
  phone_number?: string | null;
  name?: string | null;
  email?: string | null;
  balance: number;
  data_balance: number;
  has_4g?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (phoneNumber: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    try {
      const { user: currentUser, error } = await auth.getCurrentUser();
      if (error) throw error;
      setUser(currentUser);
    } catch (err) {
      console.error('Error loading user:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (phoneNumber: string, password: string) => {
    try {
      const { user: signedInUser, error } = await auth.signInWithPhone(phoneNumber, password);
      if (error) throw error;
      setUser(signedInUser);
    } catch (err) {
      console.error('Error signing in:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUser();
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, refreshUser: loadUser }}>
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