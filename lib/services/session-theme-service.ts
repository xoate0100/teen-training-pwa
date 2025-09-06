'use client';

export interface SessionTheme {
  id: string;
  name: string;
  type: 'strength' | 'volleyball' | 'plyometric' | 'recovery';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    background: string;
  };
  icons: {
    main: string;
    secondary: string;
    background: string;
  };
  animations: {
    entrance: string;
    hover: string;
    focus: string;
  };
  typography: {
    heading: string;
    subheading: string;
    body: string;
    caption: string;
  };
  spacing: {
    padding: string;
    margin: string;
    gap: string;
  };
  effects: {
    shadow: string;
    border: string;
    glow: string;
  };
}

export class SessionThemeService {
  // Strength Training Theme
  static readonly STRENGTH_THEME: SessionTheme = {
    id: 'strength',
    name: 'Strength Training',
    type: 'strength',
    colors: {
      primary: '#dc2626', // Red-600
      secondary: '#fca5a5', // Red-300
      accent: '#fef2f2', // Red-50
      background: '#1f2937', // Gray-800
      text: '#ffffff',
      textSecondary: '#d1d5db', // Gray-300
    },
    gradients: {
      primary: 'from-red-600 to-red-800',
      secondary: 'from-red-500 to-red-700',
      background: 'from-gray-900 via-red-900 to-gray-900',
    },
    icons: {
      main: '💪',
      secondary: '🏋️',
      background: '⚡',
    },
    animations: {
      entrance: 'animate-fade-in-up',
      hover: 'hover:scale-105 hover:shadow-lg',
      focus: 'focus:ring-2 focus:ring-red-500',
    },
    typography: {
      heading: 'text-3xl font-bold text-white',
      subheading: 'text-xl font-semibold text-red-300',
      body: 'text-base text-gray-200',
      caption: 'text-sm text-gray-400',
    },
    spacing: {
      padding: 'p-6',
      margin: 'm-4',
      gap: 'gap-4',
    },
    effects: {
      shadow: 'shadow-2xl shadow-red-500/20',
      border: 'border-2 border-red-500/30',
      glow: 'shadow-red-500/50',
    },
  };

  // Volleyball Skills Theme
  static readonly VOLLEYBALL_THEME: SessionTheme = {
    id: 'volleyball',
    name: 'Volleyball Skills',
    type: 'volleyball',
    colors: {
      primary: '#2563eb', // Blue-600
      secondary: '#93c5fd', // Blue-300
      accent: '#eff6ff', // Blue-50
      background: '#1e3a8a', // Blue-900
      text: '#ffffff',
      textSecondary: '#bfdbfe', // Blue-200
    },
    gradients: {
      primary: 'from-blue-600 to-blue-800',
      secondary: 'from-blue-500 to-blue-700',
      background: 'from-blue-900 via-blue-800 to-blue-900',
    },
    icons: {
      main: '🏐',
      secondary: '🎯',
      background: '⚡',
    },
    animations: {
      entrance: 'animate-bounce-in',
      hover: 'hover:scale-105 hover:shadow-lg',
      focus: 'focus:ring-2 focus:ring-blue-500',
    },
    typography: {
      heading: 'text-3xl font-bold text-white',
      subheading: 'text-xl font-semibold text-blue-300',
      body: 'text-base text-blue-100',
      caption: 'text-sm text-blue-300',
    },
    spacing: {
      padding: 'p-6',
      margin: 'm-4',
      gap: 'gap-4',
    },
    effects: {
      shadow: 'shadow-2xl shadow-blue-500/20',
      border: 'border-2 border-blue-500/30',
      glow: 'shadow-blue-500/50',
    },
  };

  // Plyometric Training Theme
  static readonly PLYOMETRIC_THEME: SessionTheme = {
    id: 'plyometric',
    name: 'Plyometric Training',
    type: 'plyometric',
    colors: {
      primary: '#16a34a', // Green-600
      secondary: '#86efac', // Green-300
      accent: '#f0fdf4', // Green-50
      background: '#14532d', // Green-900
      text: '#ffffff',
      textSecondary: '#bbf7d0', // Green-200
    },
    gradients: {
      primary: 'from-green-600 to-green-800',
      secondary: 'from-green-500 to-green-700',
      background: 'from-green-900 via-green-800 to-green-900',
    },
    icons: {
      main: '🚀',
      secondary: '⚡',
      background: '💨',
    },
    animations: {
      entrance: 'animate-jump-in',
      hover: 'hover:scale-110 hover:shadow-xl',
      focus: 'focus:ring-2 focus:ring-green-500',
    },
    typography: {
      heading: 'text-3xl font-bold text-white',
      subheading: 'text-xl font-semibold text-green-300',
      body: 'text-base text-green-100',
      caption: 'text-sm text-green-300',
    },
    spacing: {
      padding: 'p-6',
      margin: 'm-4',
      gap: 'gap-4',
    },
    effects: {
      shadow: 'shadow-2xl shadow-green-500/20',
      border: 'border-2 border-green-500/30',
      glow: 'shadow-green-500/50',
    },
  };

  // Recovery Session Theme
  static readonly RECOVERY_THEME: SessionTheme = {
    id: 'recovery',
    name: 'Recovery Session',
    type: 'recovery',
    colors: {
      primary: '#7c3aed', // Violet-600
      secondary: '#c4b5fd', // Violet-300
      accent: '#f5f3ff', // Violet-50
      background: '#4c1d95', // Violet-900
      text: '#ffffff',
      textSecondary: '#ddd6fe', // Violet-200
    },
    gradients: {
      primary: 'from-violet-600 to-violet-800',
      secondary: 'from-violet-500 to-violet-700',
      background: 'from-violet-900 via-purple-900 to-violet-900',
    },
    icons: {
      main: '🧘',
      secondary: '🌸',
      background: '✨',
    },
    animations: {
      entrance: 'animate-fade-in',
      hover: 'hover:scale-102 hover:shadow-md',
      focus: 'focus:ring-2 focus:ring-violet-500',
    },
    typography: {
      heading: 'text-3xl font-bold text-white',
      subheading: 'text-xl font-semibold text-violet-300',
      body: 'text-base text-violet-100',
      caption: 'text-sm text-violet-300',
    },
    spacing: {
      padding: 'p-6',
      margin: 'm-4',
      gap: 'gap-4',
    },
    effects: {
      shadow: 'shadow-2xl shadow-violet-500/20',
      border: 'border-2 border-violet-500/30',
      glow: 'shadow-violet-500/50',
    },
  };

  // Get theme by type
  static getTheme(type: SessionTheme['type']): SessionTheme {
    const themes = {
      strength: this.STRENGTH_THEME,
      volleyball: this.VOLLEYBALL_THEME,
      plyometric: this.PLYOMETRIC_THEME,
      recovery: this.RECOVERY_THEME,
    };
    return themes[type];
  }

  // Get all themes
  static getAllThemes(): SessionTheme[] {
    return [
      this.STRENGTH_THEME,
      this.VOLLEYBALL_THEME,
      this.PLYOMETRIC_THEME,
      this.RECOVERY_THEME,
    ];
  }

  // Generate CSS classes for a theme
  static generateThemeClasses(
    theme: SessionTheme,
    element: 'card' | 'button' | 'text' | 'background'
  ): string {
    const baseClasses = 'transition-all duration-300';

    switch (element) {
      case 'card':
        return `${baseClasses} ${theme.spacing.padding} ${theme.effects.shadow} ${theme.effects.border} bg-gradient-to-br ${theme.gradients.background}`;

      case 'button':
        return `${baseClasses} ${theme.animations.hover} ${theme.animations.focus} bg-gradient-to-r ${theme.gradients.primary} text-white font-semibold px-6 py-3 rounded-lg ${theme.effects.shadow}`;

      case 'text':
        return `${theme.typography.body}`;

      case 'background':
        return `bg-gradient-to-br ${theme.gradients.background}`;

      default:
        return baseClasses;
    }
  }

  // Generate custom CSS variables for a theme
  static generateCSSVariables(theme: SessionTheme): Record<string, string> {
    return {
      '--theme-primary': theme.colors.primary,
      '--theme-secondary': theme.colors.secondary,
      '--theme-accent': theme.colors.accent,
      '--theme-background': theme.colors.background,
      '--theme-text': theme.colors.text,
      '--theme-text-secondary': theme.colors.textSecondary,
    };
  }

  // Get theme-specific animations
  static getThemeAnimations(theme: SessionTheme): string[] {
    return [
      theme.animations.entrance,
      theme.animations.hover,
      theme.animations.focus,
    ];
  }

  // Check if theme is valid
  static isValidTheme(theme: any): theme is SessionTheme {
    return (
      theme &&
      typeof theme.id === 'string' &&
      typeof theme.name === 'string' &&
      typeof theme.type === 'string' &&
      theme.colors &&
      theme.gradients &&
      theme.icons &&
      theme.animations &&
      theme.typography &&
      theme.spacing &&
      theme.effects
    );
  }

  // Get theme by ID
  static getThemeById(id: string): SessionTheme | undefined {
    return this.getAllThemes().find(theme => theme.id === id);
  }

  // Get themes by category
  static getThemesByCategory(
    category: 'strength' | 'skills' | 'cardio' | 'recovery'
  ): SessionTheme[] {
    const categoryMap = {
      strength: ['strength'],
      skills: ['volleyball'],
      cardio: ['plyometric'],
      recovery: ['recovery'],
    };

    return this.getAllThemes().filter(theme =>
      categoryMap[category].includes(theme.type)
    );
  }
}
