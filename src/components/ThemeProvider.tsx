'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { applyTheme, onSystemDarkModeChange, DEFAULT_SEED_COLOR } from '@/lib/theme';
import { useUserStore } from '@/store/userStore';

interface ThemeContextValue {
  seedColor: string;
  isDark: boolean;
  setSeedColor: (color: string) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  seedColor: DEFAULT_SEED_COLOR,
  isDark: false,
  setSeedColor: () => {},
  toggleDarkMode: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const seedColor = useUserStore((s) => s.seedColor);
  const isDarkMode = useUserStore((s) => s.isDarkMode);
  const setSeedColor = useUserStore((s) => s.setSeedColor);
  const setDarkMode = useUserStore((s) => s.setDarkMode);
  const [mounted, setMounted] = useState(false);

  // Apply theme on mount and when preferences change
  useEffect(() => {
    applyTheme(seedColor || DEFAULT_SEED_COLOR, isDarkMode);
    setMounted(true);
  }, [seedColor, isDarkMode]);

  // Listen for system dark mode changes
  useEffect(() => {
    const cleanup = onSystemDarkModeChange((systemDark) => {
      // Only auto-sync if user hasn't explicitly set a preference
      const stored = localStorage.getItem('nutrilens-user');
      if (!stored) {
        setDarkMode(systemDark);
      }
    });
    return cleanup;
  }, [setDarkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  const contextValue: ThemeContextValue = {
    seedColor: seedColor || DEFAULT_SEED_COLOR,
    isDark: isDarkMode,
    setSeedColor,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.2s ease' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
