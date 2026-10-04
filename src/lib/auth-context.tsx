'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User, Vehicle } from '@/domain/types';
import { loginAction, signupAction, logoutAction, getCurrentUserAction, updateUserAction } from '@/lib/auth/actions';

type SignupData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'rider' | 'host' | 'both';
  vehicle?: Vehicle;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise;
  refresh: () => Promise;
  switchRole: (role: 'rider' | 'host' | 'both') => Promise;
  updateProfile: (patch: Partial) => Promise;
};

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => ({ ok: false }),
  signup: async () => ({ ok: false }),
  logout: async () => {},
  refresh: async () => {},
  switchRole: async () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const u = await getCurrentUserAction();
    setUser(u as unknown as User);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await loginAction(email, password);
      if (res.ok && res.user) {
        setUser(res.user as unknown as User);
        return { ok: true };
      }
      return { ok: false, error: res.error };
    },
    []
  );

  const signup = useCallback(
    async (data: SignupData) => {
      const res = await signupAction(data);
      if (res.ok && res.user) {
        setUser(res.user as unknown as User);
        return { ok: true };
      }
      return { ok: false, error: res.error };
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutAction();
    setUser(null);
  }, []);

  const switchRole = useCallback(
    async (role: 'rider' | 'host' | 'both') => {
      if (!user) return;
      const updated = await updateUserAction({ role });
      if (updated) setUser(updated as unknown as User);
    },
    [user]
  );

  const updateProfile = useCallback(
    async (patch: Partial) => {
      if (!user) return;
      // Fixed type mismatch for createdAt
      const updated = await updateUserAction(patch as any);
      if (updated) setUser(updated as unknown as User);
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, refresh, switchRole, updateProfile }),
    [user, loading, login, signup, logout, refresh, switchRole, updateProfile]
  );

  return {children};
}

export function useAuth() {
  return useContext(AuthContext);
}