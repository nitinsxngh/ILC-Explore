'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  ssoChecked: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ssoChecked, setSsoChecked] = useState(false);

  useEffect(() => {
    let attemptedSso = false;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setUser(user);
      
      if (!user && !attemptedSso) {
        attemptedSso = true;
        try {
          const res = await fetch('/api/auth/customToken', {
            method: 'POST',
            credentials: 'include'
          });
          const data = await res.json();
          if (res.ok && data?.customToken) {
            await signInWithCustomToken(auth, data.customToken);
            return;
          }
        } catch {
          // ignore
        }
      }

      setLoading(false);
      setSsoChecked(true);
      
      // Store user data in localStorage for persistence
      if (user) {
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          photoURL: user.photoURL
        }));
      } else {
        localStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Starting user registration with:', { email, name });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', result.user.uid);
      
      // Update the user's display name using the updateProfile function
      await updateProfile(result.user, { displayName: name });
      console.log('Display name updated successfully');
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout...');
      await signOut(auth);
      console.log('Logout successful');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message);
    }
  };

  const value = {
    user,
    loading,
    ssoChecked,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
