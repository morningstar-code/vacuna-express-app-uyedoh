
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, Profile } from '@/lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        console.log('Profile fetched:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      console.log('Signing up user:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { error };
      }

      if (data.user) {
        console.log('User created, creating profile...');
        // Create profile with onboarding_completed set to true since business_name is provided
        const profileData = {
          user_id: data.user.id,
          email: email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          business_name: userData.business_name || '',
          rnc: userData.rnc || '',
          cedula: userData.cedula || '',
          address: userData.address || '',
          phone: userData.phone || '',
          role: 'doctor' as const,
          onboarding_completed: userData.business_name ? true : false, // Set to true if business_name is provided
        };

        console.log('Creating profile with data:', profileData);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { error: profileError };
        }

        console.log('Profile created successfully');
      }

      return { error: null };
    } catch (error) {
      console.error('Signup exception:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
      }

      return { error };
    } catch (error) {
      console.error('Signin exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error);
      }
    } catch (error) {
      console.error('Signout exception:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      console.log('Updating profile:', updates);
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        return { error };
      }

      // Refresh profile
      await fetchProfile(user.id);
      return { error: null };
    } catch (error) {
      console.error('Profile update exception:', error);
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
