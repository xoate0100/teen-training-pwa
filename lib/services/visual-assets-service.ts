'use client';

export interface VisualAsset {
  id: string;
  name: string;
  path: string;
  alt: string;
  dimensions: {
    width: number;
    height: number;
  };
  category: 'hero' | 'session' | 'achievement' | 'texture' | 'icon';
  description: string;
}

export class VisualAssetsService {
  // Hero Backgrounds
  static readonly HERO_ASSETS: VisualAsset[] = [
    {
      id: 'dashboard-hero',
      name: 'Main Dashboard Hero',
      path: '/images/hero/dashboard-hero.jpg',
      alt: 'Diverse teen athletes in modern gym setting',
      dimensions: { width: 1920, height: 600 },
      category: 'hero',
      description:
        'Wide panoramic shot of diverse 11-12 year old athletes in a modern gym setting, mix of volleyball and strength training activities',
    },
    {
      id: 'session-launch-hero',
      name: 'Session Launch Hero',
      path: '/images/hero/session-launch-hero.jpg',
      alt: 'Teen athlete mid-volleyball spike with intense focus',
      dimensions: { width: 1200, height: 800 },
      category: 'hero',
      description:
        'Close-up action shot of teen athlete mid-volleyball spike with intense focus expression',
    },
    {
      id: 'progress-hero',
      name: 'Progress Section Hero',
      path: '/images/hero/progress-hero.jpg',
      alt: 'Group celebration shot of teen volleyball team',
      dimensions: { width: 1000, height: 400 },
      category: 'hero',
      description:
        'Group celebration shot of teen volleyball team after successful play',
    },
  ];

  // Session Type Backgrounds
  static readonly SESSION_ASSETS: VisualAsset[] = [
    {
      id: 'strength-training',
      name: 'Strength Training Background',
      path: '/images/sessions/strength-training.jpg',
      alt: 'Teen using proper form with light dumbbells',
      dimensions: { width: 800, height: 500 },
      category: 'session',
      description:
        'Teen using proper form with light dumbbells in clean gym environment',
    },
    {
      id: 'volleyball-skills',
      name: 'Volleyball Skills Background',
      path: '/images/sessions/volleyball-skills.jpg',
      alt: 'Teen practicing volleyball serve technique',
      dimensions: { width: 800, height: 500 },
      category: 'session',
      description: 'Teen practicing volleyball serve technique on indoor court',
    },
    {
      id: 'plyometric-training',
      name: 'Plyometric Training Background',
      path: '/images/sessions/plyometric-training.jpg',
      alt: 'Teen performing box jump exercise',
      dimensions: { width: 800, height: 500 },
      category: 'session',
      description: 'Teen performing box jump or lateral bound exercise',
    },
    {
      id: 'recovery-session',
      name: 'Recovery Session Background',
      path: '/images/sessions/recovery-session.jpg',
      alt: 'Teen doing stretching in calm gym environment',
      dimensions: { width: 800, height: 500 },
      category: 'session',
      description:
        'Teen doing stretching or foam rolling in calm gym environment',
    },
  ];

  // Achievement Visuals (placeholder for now)
  static readonly ACHIEVEMENT_ASSETS: VisualAsset[] = [
    {
      id: 'strength-warrior',
      name: 'Strength Warrior Badge',
      path: '/images/achievements/strength-warrior.svg',
      alt: 'Strength training achievement badge',
      dimensions: { width: 64, height: 64 },
      category: 'achievement',
      description:
        'Blue circular badge with dumbbell icon for strength training achievements',
    },
    {
      id: 'volleyball-champion',
      name: 'Volleyball Champion Badge',
      path: '/images/achievements/volleyball-champion.svg',
      alt: 'Volleyball achievement badge',
      dimensions: { width: 64, height: 64 },
      category: 'achievement',
      description:
        'Red circular badge with volleyball icon for volleyball achievements',
    },
    {
      id: 'explosive-power',
      name: 'Explosive Power Badge',
      path: '/images/achievements/explosive-power.svg',
      alt: 'Plyometric training achievement badge',
      dimensions: { width: 64, height: 64 },
      category: 'achievement',
      description:
        'Green circular badge with lightning bolt icon for plyometric achievements',
    },
    {
      id: 'fire-streak',
      name: 'Fire Streak Badge',
      path: '/images/achievements/fire-streak.svg',
      alt: 'Streak achievement badge',
      dimensions: { width: 64, height: 64 },
      category: 'achievement',
      description:
        'Orange circular badge with fire icon for streak achievements',
    },
  ];

  // Get all assets by category
  static getAssetsByCategory(category: VisualAsset['category']): VisualAsset[] {
    return [
      ...this.HERO_ASSETS,
      ...this.SESSION_ASSETS,
      ...this.ACHIEVEMENT_ASSETS,
    ].filter(asset => asset.category === category);
  }

  // Get asset by ID
  static getAssetById(id: string): VisualAsset | undefined {
    return [
      ...this.HERO_ASSETS,
      ...this.SESSION_ASSETS,
      ...this.ACHIEVEMENT_ASSETS,
    ].find(asset => asset.id === id);
  }

  // Get hero background for specific context
  static getHeroBackground(
    context: 'dashboard' | 'session' | 'progress'
  ): VisualAsset | undefined {
    const heroMap = {
      dashboard: 'dashboard-hero',
      session: 'session-launch-hero',
      progress: 'progress-hero',
    };

    return this.getAssetById(heroMap[context]);
  }

  // Get session background by type
  static getSessionBackground(
    sessionType: 'strength' | 'volleyball' | 'plyometric' | 'recovery'
  ): VisualAsset | undefined {
    const sessionMap = {
      strength: 'strength-training',
      volleyball: 'volleyball-skills',
      plyometric: 'plyometric-training',
      recovery: 'recovery-session',
    };

    return this.getAssetById(sessionMap[sessionType]);
  }

  // Generate CSS background styles
  static getBackgroundStyle(
    asset: VisualAsset,
    options?: {
      overlay?: boolean;
      overlayOpacity?: number;
      position?: string;
      size?: string;
    }
  ): Record<string, any> {
    const {
      overlay = false,
      overlayOpacity = 0.4,
      position = 'center',
      size = 'cover',
    } = options || {};

    const baseStyle: Record<string, any> = {
      backgroundImage: `url(${asset.path})`,
      backgroundPosition: position,
      backgroundSize: size,
      backgroundRepeat: 'no-repeat',
    };

    if (overlay) {
      return {
        ...baseStyle,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          zIndex: 1,
        },
      };
    }

    return baseStyle;
  }

  // Get responsive image dimensions
  static getResponsiveDimensions(
    asset: VisualAsset,
    maxWidth: number
  ): { width: number; height: number } {
    const aspectRatio = asset.dimensions.width / asset.dimensions.height;
    const width = Math.min(maxWidth, asset.dimensions.width);
    const height = width / aspectRatio;

    return { width: Math.round(width), height: Math.round(height) };
  }

  // Check if asset exists (placeholder implementation)
  static async assetExists(asset: VisualAsset): Promise<boolean> {
    try {
      const response = await fetch(asset.path, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Get fallback asset for missing images
  static getFallbackAsset(category: VisualAsset['category']): VisualAsset {
    const fallbacks = {
      hero: this.HERO_ASSETS[0],
      session: this.SESSION_ASSETS[0],
      achievement: this.ACHIEVEMENT_ASSETS[0],
      texture: this.ACHIEVEMENT_ASSETS[0], // Use achievement as fallback
      icon: this.ACHIEVEMENT_ASSETS[0], // Use achievement as fallback
    };

    return fallbacks[category] || this.HERO_ASSETS[0];
  }
}
