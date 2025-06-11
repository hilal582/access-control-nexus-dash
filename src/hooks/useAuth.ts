import { useState, useEffect } from 'react';
import { authApi, clearTokens, setTokens } from '@/lib/api';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_super_admin: boolean;
  created_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      setTokens(response.access, response.refresh);
      setUser(response.user);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signOut = () => {
    authApi.logout();
    setUser(null);
  };

  const updateProfile = async (data: { first_name?: string; last_name?: string }) => {
    try {
      const updatedUser = await authApi.updateProfile(data);
      setUser(updatedUser);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    isSuperAdmin: user?.is_super_admin || false,
  };
};