
import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

export default function RootIndex() {
  const { session, profile, loading } = useAuth();

  console.log('RootIndex - Session:', !!session, 'Profile:', !!profile, 'Loading:', loading);
  console.log('Profile onboarding completed:', profile?.onboarding_completed);

  // Show loading spinner while checking auth state
  if (loading) {
    return <LoadingScreen message="Verificando sesión..." />;
  }

  // Cold start with no session → Auth (never Home)
  if (!session) {
    console.log('No session, redirecting to auth/login');
    return <Redirect href="/auth/login" />;
  }

  // With session but no profile → Something went wrong, go to auth
  if (!profile) {
    console.log('Session exists but no profile, redirecting to auth/login');
    return <Redirect href="/auth/login" />;
  }

  // With session but onboardingCompleted=false → OnboardingWizard appears every time until done
  if (!profile.onboarding_completed) {
    console.log('Profile exists but onboarding not completed, redirecting to onboarding/wizard');
    return <Redirect href="/onboarding/wizard" />;
  }

  // Session exists and onboarding completed → Home
  console.log('Session and profile exist, onboarding completed, redirecting to home');
  return <Redirect href="/(tabs)/(home)/" />;
}
