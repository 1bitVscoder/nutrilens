'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useMealStore } from '@/store/mealStore';

export default function RootPage() {
  const router = useRouter();
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  const initializeMockData = useMealStore((s) => s.initializeMockData);

  useEffect(() => {
    if (onboardingComplete) {
      initializeMockData();
      router.replace('/dashboard');
    } else {
      router.replace('/onboarding');
    }
  }, [onboardingComplete, router, initializeMockData]);

  // Loading state while redirecting
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--md-sys-color-surface)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🥗</div>
        <div className="title-large" style={{ color: 'var(--md-sys-color-primary)' }}>
          NutriLens
        </div>
      </div>
    </div>
  );
}
