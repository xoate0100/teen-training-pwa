'use client';

/* eslint-disable no-undef */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  DynamicThemingService,
  DynamicTheme,
  ThemeColor,
} from '@/lib/services/dynamic-theming-service';

interface ThemeContextType {
  currentTheme: DynamicTheme;
  setSessionTheme: (sessionType: DynamicTheme['session']['type']) => void;
  setPhaseTheme: (phase: DynamicTheme['phase']['phase']) => void;
  setProgressTheme: (level: number) => void;
  setMoodTheme: (mood: DynamicTheme['mood']['mood']) => void;
  setCustomTheme: (custom: Partial<ThemeColor>) => void;
  resetTheme: () => void;
  getThemeColors: () => ThemeColor;
  getThemeCSSVariables: () => Record<string, string>;
  getThemeClasses: () => string[];
  getAnimationClass: () => string;
  getIntensityClass: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: DynamicTheme;
  sessionType?: DynamicTheme['session']['type'];
  phase?: DynamicTheme['phase']['phase'];
  level?: number;
  mood?: DynamicTheme['mood']['mood'];
  custom?: Partial<ThemeColor>;
}

export function ThemeProvider({
  children,
  initialTheme,
  sessionType,
  phase,
  level,
  mood,
  custom,
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<DynamicTheme>(
    initialTheme ||
      DynamicThemingService.generateDynamicTheme({
        sessionType,
        phase,
        level,
        mood,
        custom,
      })
  );

  // Update theme when props change
  useEffect(() => {
    const newTheme = DynamicThemingService.generateDynamicTheme({
      sessionType,
      phase,
      level,
      mood,
      custom,
    });
    setCurrentTheme(newTheme);
  }, [sessionType, phase, level, mood, custom]);

  // Apply CSS variables to document root
  useEffect(() => {
    const cssVariables =
      DynamicThemingService.getThemeCSSVariables(currentTheme);
    const root =
      typeof document !== 'undefined' ? document.documentElement : null;

    if (root) {
      Object.entries(cssVariables).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
    }

    // Add theme classes to body
    const themeClasses = DynamicThemingService.getThemeClasses(currentTheme);
    const intensityClass =
      DynamicThemingService.getIntensityClass(currentTheme);
    const animationClass =
      DynamicThemingService.getAnimationClass(currentTheme);

    const allClasses = [...themeClasses, intensityClass, animationClass].filter(
      Boolean
    );

    if (root) {
      // Remove existing theme classes
      root.classList.remove(
        ...Array.from(root.classList).filter(
          cls =>
            cls.startsWith('theme-session-') ||
            cls.startsWith('theme-phase-') ||
            cls.startsWith('theme-progress-') ||
            cls.startsWith('theme-mood-') ||
            cls.startsWith('intensity-') ||
            ['animate-bounce', 'animate-pulse'].includes(cls)
        )
      );

      // Add new theme classes
      root.classList.add(...allClasses);
    }

    return () => {
      // Cleanup: remove theme classes on unmount
      if (root) {
        root.classList.remove(...allClasses);
      }
    };
  }, [currentTheme]);

  const setSessionTheme = (sessionType: DynamicTheme['session']['type']) => {
    setCurrentTheme(prev => ({
      ...prev,
      session: DynamicThemingService.getSessionTheme(sessionType),
    }));
  };

  const setPhaseTheme = (phase: DynamicTheme['phase']['phase']) => {
    setCurrentTheme(prev => ({
      ...prev,
      phase: DynamicThemingService.getPhaseTheme(phase),
    }));
  };

  const setProgressTheme = (level: number) => {
    setCurrentTheme(prev => ({
      ...prev,
      progress: DynamicThemingService.getProgressTheme(level),
    }));
  };

  const setMoodTheme = (mood: DynamicTheme['mood']['mood']) => {
    setCurrentTheme(prev => ({
      ...prev,
      mood: DynamicThemingService.getMoodTheme(mood),
    }));
  };

  const setCustomTheme = (custom: Partial<ThemeColor>) => {
    setCurrentTheme(prev => ({
      ...prev,
      custom: { ...prev.custom, ...custom },
    }));
  };

  const resetTheme = () => {
    setCurrentTheme(DynamicThemingService.generateDynamicTheme({}));
  };

  const getThemeColors = (): ThemeColor => {
    return DynamicThemingService.mergeThemeColors(currentTheme);
  };

  const getThemeCSSVariables = (): Record<string, string> => {
    return DynamicThemingService.getThemeCSSVariables(currentTheme);
  };

  const getThemeClasses = (): string[] => {
    return DynamicThemingService.getThemeClasses(currentTheme);
  };

  const getAnimationClass = (): string => {
    return DynamicThemingService.getAnimationClass(currentTheme);
  };

  const getIntensityClass = (): string => {
    return DynamicThemingService.getIntensityClass(currentTheme);
  };

  const value: ThemeContextType = {
    currentTheme,
    setSessionTheme,
    setPhaseTheme,
    setProgressTheme,
    setMoodTheme,
    setCustomTheme,
    resetTheme,
    getThemeColors,
    getThemeCSSVariables,
    getThemeClasses,
    getAnimationClass,
    getIntensityClass,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for getting theme-aware styles
export function useThemeStyles() {
  const {
    getThemeColors,
    getThemeCSSVariables,
    getThemeClasses,
    getAnimationClass,
    getIntensityClass,
  } = useTheme();

  return {
    colors: getThemeColors(),
    cssVariables: getThemeCSSVariables(),
    classes: getThemeClasses(),
    animationClass: getAnimationClass(),
    intensityClass: getIntensityClass(),
  };
}

// Higher-order component for theme-aware components
export function withTheme<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function ThemedComponent(props: P) {
    return (
      <ThemeProvider>
        <Component {...props} />
      </ThemeProvider>
    );
  };
}
