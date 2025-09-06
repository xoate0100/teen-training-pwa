'use client';

export interface ThemeColor {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface SessionTheme {
  id: string;
  name: string;
  type: 'strength' | 'volleyball' | 'plyometric' | 'recovery';
  colors: ThemeColor;
  icon: string;
  description: string;
}

export interface PhaseTheme {
  id: string;
  name: string;
  phase: 'foundation' | 'build' | 'peak' | 'deload';
  colors: ThemeColor;
  intensity: 'low' | 'medium' | 'high' | 'very_high';
  description: string;
}

export interface ProgressTheme {
  level: number;
  colors: ThemeColor;
  intensity: 'low' | 'medium' | 'high' | 'very_high';
  description: string;
}

export interface MoodTheme {
  mood: 'excited' | 'motivated' | 'focused' | 'calm' | 'tired' | 'stressed';
  colors: ThemeColor;
  animation: 'bounce' | 'pulse' | 'glow' | 'subtle' | 'none';
  description: string;
}

export interface DynamicTheme {
  session?: SessionTheme;
  phase?: PhaseTheme;
  progress?: ProgressTheme;
  mood?: MoodTheme;
  custom?: Partial<ThemeColor>;
}

export class DynamicThemingService {
  static readonly SESSION_THEMES: SessionTheme[] = [
    {
      id: 'strength-theme',
      name: 'Strength Training',
      type: 'strength',
      colors: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#f59e0b',
        background: '#f8fafc',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      icon: '💪',
      description: 'Bold blue theme for strength training sessions',
    },
    {
      id: 'volleyball-theme',
      name: 'Volleyball Skills',
      type: 'volleyball',
      colors: {
        primary: '#ef4444',
        secondary: '#dc2626',
        accent: '#f97316',
        background: '#fef2f2',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#fecaca',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      icon: '🏐',
      description: 'Dynamic red theme for volleyball skills training',
    },
    {
      id: 'plyometric-theme',
      name: 'Plyometric Training',
      type: 'plyometric',
      colors: {
        primary: '#10b981',
        secondary: '#059669',
        accent: '#f59e0b',
        background: '#f0fdf4',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#bbf7d0',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      icon: '⚡',
      description: 'Energetic green theme for plyometric training',
    },
    {
      id: 'recovery-theme',
      name: 'Recovery Session',
      type: 'recovery',
      colors: {
        primary: '#8b5cf6',
        secondary: '#7c3aed',
        accent: '#06b6d4',
        background: '#faf5ff',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e9d5ff',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      icon: '🧘',
      description: 'Calming purple theme for recovery sessions',
    },
  ];

  static readonly PHASE_THEMES: PhaseTheme[] = [
    {
      id: 'foundation-phase',
      name: 'Foundation Phase',
      phase: 'foundation',
      colors: {
        primary: '#6b7280',
        secondary: '#4b5563',
        accent: '#10b981',
        background: '#f9fafb',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      intensity: 'low',
      description: 'Stable gray theme for foundation building phase',
    },
    {
      id: 'build-phase',
      name: 'Build Phase',
      phase: 'build',
      colors: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#f59e0b',
        background: '#eff6ff',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#bfdbfe',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      intensity: 'medium',
      description: 'Progressive blue theme for building phase',
    },
    {
      id: 'peak-phase',
      name: 'Peak Phase',
      phase: 'peak',
      colors: {
        primary: '#dc2626',
        secondary: '#b91c1c',
        accent: '#f59e0b',
        background: '#fef2f2',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#fecaca',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      intensity: 'very_high',
      description: 'Intense red theme for peak performance phase',
    },
    {
      id: 'deload-phase',
      name: 'Deload Phase',
      phase: 'deload',
      colors: {
        primary: '#8b5cf6',
        secondary: '#7c3aed',
        accent: '#06b6d4',
        background: '#faf5ff',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e9d5ff',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      intensity: 'low',
      description: 'Recovery purple theme for deload phase',
    },
  ];

  static readonly PROGRESS_THEMES: ProgressTheme[] = [
    {
      level: 1,
      colors: {
        primary: '#6b7280',
        secondary: '#4b5563',
        accent: '#10b981',
        background: '#f9fafb',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      intensity: 'low',
      description: 'Beginner level theme',
    },
    {
      level: 5,
      colors: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#f59e0b',
        background: '#eff6ff',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#bfdbfe',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      intensity: 'medium',
      description: 'Intermediate level theme',
    },
    {
      level: 10,
      colors: {
        primary: '#dc2626',
        secondary: '#b91c1c',
        accent: '#f59e0b',
        background: '#fef2f2',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#fecaca',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      intensity: 'high',
      description: 'Advanced level theme',
    },
    {
      level: 15,
      colors: {
        primary: '#7c2d12',
        secondary: '#92400e',
        accent: '#f59e0b',
        background: '#fef3c7',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#fde68a',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      intensity: 'very_high',
      description: 'Elite level theme',
    },
  ];

  static readonly MOOD_THEMES: MoodTheme[] = [
    {
      mood: 'excited',
      colors: {
        primary: '#f59e0b',
        secondary: '#d97706',
        accent: '#ef4444',
        background: '#fffbeb',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#fed7aa',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      animation: 'bounce',
      description: 'Energetic orange theme for excited mood',
    },
    {
      mood: 'motivated',
      colors: {
        primary: '#10b981',
        secondary: '#059669',
        accent: '#3b82f6',
        background: '#f0fdf4',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#bbf7d0',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      animation: 'pulse',
      description: 'Motivating green theme for motivated mood',
    },
    {
      mood: 'focused',
      colors: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#8b5cf6',
        background: '#eff6ff',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#bfdbfe',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      animation: 'glow',
      description: 'Concentrated blue theme for focused mood',
    },
    {
      mood: 'calm',
      colors: {
        primary: '#8b5cf6',
        secondary: '#7c3aed',
        accent: '#06b6d4',
        background: '#faf5ff',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e9d5ff',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      animation: 'subtle',
      description: 'Peaceful purple theme for calm mood',
    },
    {
      mood: 'tired',
      colors: {
        primary: '#6b7280',
        secondary: '#4b5563',
        accent: '#10b981',
        background: '#f9fafb',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      animation: 'none',
      description: 'Gentle gray theme for tired mood',
    },
    {
      mood: 'stressed',
      colors: {
        primary: '#ef4444',
        secondary: '#dc2626',
        accent: '#f59e0b',
        background: '#fef2f2',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#fecaca',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      animation: 'pulse',
      description: 'Alerting red theme for stressed mood',
    },
  ];

  static getSessionTheme(
    sessionType: SessionTheme['type']
  ): SessionTheme | undefined {
    return this.SESSION_THEMES.find(theme => theme.type === sessionType);
  }

  static getPhaseTheme(phase: PhaseTheme['phase']): PhaseTheme | undefined {
    return this.PHASE_THEMES.find(theme => theme.phase === phase);
  }

  static getProgressTheme(level: number): ProgressTheme {
    // Find the highest theme level that's less than or equal to the current level
    const themes = this.PROGRESS_THEMES.filter(theme => theme.level <= level);
    return themes[themes.length - 1] || this.PROGRESS_THEMES[0];
  }

  static getMoodTheme(mood: MoodTheme['mood']): MoodTheme | undefined {
    return this.MOOD_THEMES.find(theme => theme.mood === mood);
  }

  static generateDynamicTheme(context: {
    sessionType?: SessionTheme['type'];
    phase?: PhaseTheme['phase'];
    level?: number;
    mood?: MoodTheme['mood'];
    custom?: Partial<ThemeColor>;
  }): DynamicTheme {
    const theme: DynamicTheme = {};

    if (context.sessionType) {
      theme.session = this.getSessionTheme(context.sessionType);
    }

    if (context.phase) {
      theme.phase = this.getPhaseTheme(context.phase);
    }

    if (context.level !== undefined) {
      theme.progress = this.getProgressTheme(context.level);
    }

    if (context.mood) {
      theme.mood = this.getMoodTheme(context.mood);
    }

    if (context.custom) {
      theme.custom = context.custom;
    }

    return theme;
  }

  static mergeThemeColors(theme: DynamicTheme): ThemeColor {
    const defaultColors: ThemeColor = {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#f59e0b',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    };

    // Priority order: custom > mood > progress > phase > session > default
    const sources = [
      theme.custom,
      theme.mood?.colors,
      theme.progress?.colors,
      theme.phase?.colors,
      theme.session?.colors,
    ].filter(Boolean);

    return sources.reduce((merged, source) => {
      return { ...merged, ...source };
    }, defaultColors);
  }

  static getThemeCSSVariables(theme: DynamicTheme): Record<string, string> {
    const colors = this.mergeThemeColors(theme);

    return {
      '--color-primary': colors.primary,
      '--color-secondary': colors.secondary,
      '--color-accent': colors.accent,
      '--color-background': colors.background,
      '--color-surface': colors.surface,
      '--color-text': colors.text,
      '--color-text-secondary': colors.textSecondary,
      '--color-border': colors.border,
      '--color-success': colors.success,
      '--color-warning': colors.warning,
      '--color-error': colors.error,
      '--color-info': colors.info,
    };
  }

  static getThemeClasses(theme: DynamicTheme): string[] {
    const classes: string[] = [];

    if (theme.session) {
      classes.push(`theme-session-${theme.session.type}`);
    }

    if (theme.phase) {
      classes.push(`theme-phase-${theme.phase.phase}`);
    }

    if (theme.progress) {
      classes.push(`theme-progress-level-${theme.progress.level}`);
    }

    if (theme.mood) {
      classes.push(`theme-mood-${theme.mood.mood}`);
    }

    return classes;
  }

  static getAnimationClass(theme: DynamicTheme): string {
    if (theme.mood?.animation) {
      switch (theme.mood.animation) {
        case 'bounce':
          return 'animate-bounce';
        case 'pulse':
          return 'animate-pulse';
        case 'glow':
          return 'animate-pulse';
        case 'subtle':
          return 'animate-pulse';
        case 'none':
        default:
          return '';
      }
    }

    return '';
  }

  static getIntensityClass(theme: DynamicTheme): string {
    const intensity =
      theme.phase?.intensity || theme.progress?.intensity || 'medium';

    switch (intensity) {
      case 'low':
        return 'intensity-low';
      case 'medium':
        return 'intensity-medium';
      case 'high':
        return 'intensity-high';
      case 'very_high':
        return 'intensity-very-high';
      default:
        return 'intensity-medium';
    }
  }
}
