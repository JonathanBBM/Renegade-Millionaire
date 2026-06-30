import { Session, User } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { env } from '@/src/lib/env';
import { supabase } from '@/src/lib/supabase';

type Profile = {
  avatar_url: string | null;
  course_start_date: string | null;
  created_at: string;
  full_name: string | null;
  id: string;
  warrior_creed: string | null;
};

type AuthContextValue = {
  isLoading: boolean;
  profile: Profile | null;
  resetPassword: (email: string) => ReturnType<typeof supabase.auth.resetPasswordForEmail>;
  session: Session | null;
  signIn: (email: string, password: string) => ReturnType<typeof supabase.auth.signInWithPassword>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => ReturnType<typeof supabase.auth.signUp>;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      setIsLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!session?.user) {
        setProfile(null);
        return;
      }

      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();

      if (isMounted) {
        setProfile((data as Profile | null) ?? null);
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [session?.user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      profile,
      resetPassword: (email) =>
        supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${env.siteUrl}/(auth)/reset-password`,
        }),
      session,
      signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
      signOut: async () => {
        await supabase.auth.signOut();
      },
      signUp: (email, password, fullName) =>
        supabase.auth.signUp({
          email,
          options: {
            data: {
              full_name: fullName,
            },
          },
          password,
        }),
      user: session?.user ?? null,
    }),
    [isLoading, profile, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
