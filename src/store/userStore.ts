/**
 * User Profile Store — Zustand with localStorage persistence
 * 
 * Manages user profile, TDEE calculation, calorie/macro targets,
 * dietary restrictions, and onboarding state.
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  UserProfile,
  MacroTargets,
  Goal,
  calculateCalorieTarget,
  calculateMacroTargets,
  calculateTDEE,
  calculateBMR,
} from '@/lib/nutrition';

interface UserState {
  // Profile data
  profile: UserProfile | null;
  onboardingComplete: boolean;

  // Calculated values
  bmr: number;
  tdee: number;
  targets: MacroTargets;

  // Theme preferences
  seedColor: string;
  isDarkMode: boolean;

  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateGoal: (goal: Goal) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setSeedColor: (color: string) => void;
  setDarkMode: (isDark: boolean) => void;
  resetProfile: () => void;
}

const DEFAULT_TARGETS: MacroTargets = {
  calories: 2000,
  protein: 125,
  carbs: 250,
  fat: 56,
  fiber: 28,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      onboardingComplete: false,
      bmr: 0,
      tdee: 0,
      targets: DEFAULT_TARGETS,
      seedColor: '#4CAF88',
      isDarkMode: false,

      setProfile: (profile: UserProfile) => {
        const bmr = calculateBMR(profile);
        const tdee = calculateTDEE(profile);
        const calories = calculateCalorieTarget(profile);
        const targets = calculateMacroTargets(calories, profile.goal);

        set({ profile, bmr, tdee, targets });
      },

      updateProfile: (updates: Partial<UserProfile>) => {
        const current = get().profile;
        if (!current) return;

        const updated = { ...current, ...updates };
        get().setProfile(updated);
      },

      updateGoal: (goal: Goal) => {
        const current = get().profile;
        if (!current) return;

        const updated = { ...current, goal };
        get().setProfile(updated);
      },

      completeOnboarding: () => {
        set({ onboardingComplete: true });
      },

      resetOnboarding: () => {
        set({ onboardingComplete: false, profile: null, bmr: 0, tdee: 0, targets: DEFAULT_TARGETS });
      },

      setSeedColor: (color: string) => {
        set({ seedColor: color });
      },

      setDarkMode: (isDark: boolean) => {
        set({ isDarkMode: isDark });
      },

      resetProfile: () => {
        set({
          profile: null,
          onboardingComplete: false,
          bmr: 0,
          tdee: 0,
          targets: DEFAULT_TARGETS,
          seedColor: '#4CAF88',
          isDarkMode: false,
        });
      },
    }),
    {
      name: 'nutrilens-user',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        // SSR fallback — noop storage
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
