'use client';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category:
    | 'strength'
    | 'volleyball'
    | 'plyometric'
    | 'recovery'
    | 'streak'
    | 'milestone'
    | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirements: {
    type:
      | 'sessions_completed'
      | 'streak_days'
      | 'total_time'
      | 'specific_exercise'
      | 'weekly_goal'
      | 'monthly_goal';
    value: number;
    description: string;
  };
  unlockedAt?: Date;
  progress?: number;
  isUnlocked: boolean;
  animation?: {
    type: 'bounce' | 'glow' | 'sparkle' | 'fire' | 'level_up';
    duration: number;
    color?: string;
  };
}

export interface UserProgress {
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeMinutes: number;
  weeklySessions: number;
  monthlySessions: number;
  lastSessionDate?: Date;
  achievements: Achievement[];
  level: number;
  experience: number;
  nextLevelExp: number;
}

export class AchievementService {
  static readonly ACHIEVEMENTS: Achievement[] = [
    // Strength Training Achievements
    {
      id: 'first_strength_session',
      name: 'First Steps',
      description: 'Complete your first strength training session',
      icon: '💪',
      category: 'strength',
      rarity: 'common',
      points: 10,
      requirements: {
        type: 'sessions_completed',
        value: 1,
        description: 'Complete 1 strength training session',
      },
      isUnlocked: false,
      animation: { type: 'bounce', duration: 1000, color: '#3b82f6' },
    },
    {
      id: 'strength_warrior',
      name: 'Strength Warrior',
      description: 'Complete 10 strength training sessions',
      icon: '⚔️',
      category: 'strength',
      rarity: 'uncommon',
      points: 50,
      requirements: {
        type: 'sessions_completed',
        value: 10,
        description: 'Complete 10 strength training sessions',
      },
      isUnlocked: false,
      animation: { type: 'glow', duration: 1500, color: '#8b5cf6' },
    },
    {
      id: 'strength_master',
      name: 'Strength Master',
      description: 'Complete 50 strength training sessions',
      icon: '🏆',
      category: 'strength',
      rarity: 'rare',
      points: 200,
      requirements: {
        type: 'sessions_completed',
        value: 50,
        description: 'Complete 50 strength training sessions',
      },
      isUnlocked: false,
      animation: { type: 'sparkle', duration: 2000, color: '#f59e0b' },
    },

    // Volleyball Achievements
    {
      id: 'volleyball_rookie',
      name: 'Volleyball Rookie',
      description: 'Complete your first volleyball skills session',
      icon: '🏐',
      category: 'volleyball',
      rarity: 'common',
      points: 10,
      requirements: {
        type: 'sessions_completed',
        value: 1,
        description: 'Complete 1 volleyball skills session',
      },
      isUnlocked: false,
      animation: { type: 'bounce', duration: 1000, color: '#ef4444' },
    },
    {
      id: 'volleyball_champion',
      name: 'Volleyball Champion',
      description: 'Complete 25 volleyball skills sessions',
      icon: '🥇',
      category: 'volleyball',
      rarity: 'uncommon',
      points: 100,
      requirements: {
        type: 'sessions_completed',
        value: 25,
        description: 'Complete 25 volleyball skills sessions',
      },
      isUnlocked: false,
      animation: { type: 'glow', duration: 1500, color: '#f97316' },
    },

    // Plyometric Achievements
    {
      id: 'plyometric_starter',
      name: 'Plyometric Starter',
      description: 'Complete your first plyometric training session',
      icon: '⚡',
      category: 'plyometric',
      rarity: 'common',
      points: 10,
      requirements: {
        type: 'sessions_completed',
        value: 1,
        description: 'Complete 1 plyometric training session',
      },
      isUnlocked: false,
      animation: { type: 'bounce', duration: 1000, color: '#10b981' },
    },
    {
      id: 'explosive_power',
      name: 'Explosive Power',
      description: 'Complete 20 plyometric training sessions',
      icon: '💥',
      category: 'plyometric',
      rarity: 'uncommon',
      points: 75,
      requirements: {
        type: 'sessions_completed',
        value: 20,
        description: 'Complete 20 plyometric training sessions',
      },
      isUnlocked: false,
      animation: { type: 'fire', duration: 1800, color: '#f59e0b' },
    },

    // Recovery Achievements
    {
      id: 'recovery_expert',
      name: 'Recovery Expert',
      description: 'Complete 15 recovery sessions',
      icon: '🧘',
      category: 'recovery',
      rarity: 'uncommon',
      points: 60,
      requirements: {
        type: 'sessions_completed',
        value: 15,
        description: 'Complete 15 recovery sessions',
      },
      isUnlocked: false,
      animation: { type: 'glow', duration: 1200, color: '#8b5cf6' },
    },

    // Streak Achievements
    {
      id: 'week_warrior',
      name: 'Week Warrior',
      description: 'Maintain a 7-day training streak',
      icon: '🔥',
      category: 'streak',
      rarity: 'uncommon',
      points: 100,
      requirements: {
        type: 'streak_days',
        value: 7,
        description: 'Maintain a 7-day training streak',
      },
      isUnlocked: false,
      animation: { type: 'fire', duration: 2000, color: '#ef4444' },
    },
    {
      id: 'month_master',
      name: 'Month Master',
      description: 'Maintain a 30-day training streak',
      icon: '🔥🔥',
      category: 'streak',
      rarity: 'rare',
      points: 300,
      requirements: {
        type: 'streak_days',
        value: 30,
        description: 'Maintain a 30-day training streak',
      },
      isUnlocked: false,
      animation: { type: 'fire', duration: 2500, color: '#dc2626' },
    },

    // Milestone Achievements
    {
      id: 'time_investor',
      name: 'Time Investor',
      description: 'Log 100 hours of training time',
      icon: '⏰',
      category: 'milestone',
      rarity: 'rare',
      points: 250,
      requirements: {
        type: 'total_time',
        value: 6000, // 100 hours in minutes
        description: 'Log 100 hours of training time',
      },
      isUnlocked: false,
      animation: { type: 'sparkle', duration: 2000, color: '#06b6d4' },
    },
    {
      id: 'dedication_legend',
      name: 'Dedication Legend',
      description: 'Complete 100 total training sessions',
      icon: '👑',
      category: 'milestone',
      rarity: 'epic',
      points: 500,
      requirements: {
        type: 'sessions_completed',
        value: 100,
        description: 'Complete 100 total training sessions',
      },
      isUnlocked: false,
      animation: { type: 'level_up', duration: 3000, color: '#f59e0b' },
    },

    // Special Achievements
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Complete 5 morning training sessions',
      icon: '🌅',
      category: 'special',
      rarity: 'uncommon',
      points: 75,
      requirements: {
        type: 'sessions_completed',
        value: 5,
        description: 'Complete 5 morning training sessions (before 8 AM)',
      },
      isUnlocked: false,
      animation: { type: 'glow', duration: 1500, color: '#fbbf24' },
    },
    {
      id: 'weekend_warrior',
      name: 'Weekend Warrior',
      description: 'Complete 10 weekend training sessions',
      icon: '🏃‍♂️',
      category: 'special',
      rarity: 'uncommon',
      points: 80,
      requirements: {
        type: 'sessions_completed',
        value: 10,
        description: 'Complete 10 weekend training sessions',
      },
      isUnlocked: false,
      animation: { type: 'bounce', duration: 1200, color: '#10b981' },
    },
  ];

  static calculateUserProgress(sessions: any[], checkIns: any[]): UserProgress {
    const totalSessions = sessions.length;
    const currentStreak = this.calculateCurrentStreak(sessions);
    const longestStreak = this.calculateLongestStreak(sessions);
    const totalTimeMinutes = sessions.reduce(
      (total, session) => total + (session.duration || 0),
      0
    );
    const weeklySessions = this.calculateWeeklySessions(sessions);
    const monthlySessions = this.calculateMonthlySessions(sessions);
    const lastSessionDate =
      sessions.length > 0
        ? new Date(sessions[sessions.length - 1].completedAt)
        : undefined;

    // Note: checkIns parameter is reserved for future wellness-based achievements
    // Currently using only session data for achievement calculations
    // Suppress unused parameter warning
    void checkIns;

    const achievements = this.checkAchievements({
      totalSessions,
      currentStreak,
      longestStreak,
      totalTimeMinutes,
      weeklySessions,
      monthlySessions,
      lastSessionDate,
    });

    const experience = achievements.reduce(
      (exp, achievement) =>
        exp + (achievement.isUnlocked ? achievement.points : 0),
      0
    );
    const level = Math.floor(experience / 100) + 1;
    const nextLevelExp = level * 100;

    return {
      totalSessions,
      currentStreak,
      longestStreak,
      totalTimeMinutes,
      weeklySessions,
      monthlySessions,
      lastSessionDate,
      achievements,
      level,
      experience: experience % 100,
      nextLevelExp,
    };
  }

  static checkAchievements(progress: Partial<UserProgress>): Achievement[] {
    return this.ACHIEVEMENTS.map(achievement => {
      const isUnlocked = this.isAchievementUnlocked(achievement, progress);
      const progressValue = this.calculateAchievementProgress(
        achievement,
        progress
      );

      return {
        ...achievement,
        isUnlocked,
        progress: progressValue,
        unlockedAt:
          isUnlocked && !achievement.unlockedAt
            ? new Date()
            : achievement.unlockedAt,
      };
    });
  }

  static isAchievementUnlocked(
    achievement: Achievement,
    progress: Partial<UserProgress>
  ): boolean {
    switch (achievement.requirements.type) {
      case 'sessions_completed':
        return (progress.totalSessions || 0) >= achievement.requirements.value;
      case 'streak_days':
        return (progress.currentStreak || 0) >= achievement.requirements.value;
      case 'total_time':
        return (
          (progress.totalTimeMinutes || 0) >= achievement.requirements.value
        );
      case 'weekly_goal':
        return (progress.weeklySessions || 0) >= achievement.requirements.value;
      case 'monthly_goal':
        return (
          (progress.monthlySessions || 0) >= achievement.requirements.value
        );
      default:
        return false;
    }
  }

  static calculateAchievementProgress(
    achievement: Achievement,
    progress: Partial<UserProgress>
  ): number {
    const current = this.getCurrentValue(
      achievement.requirements.type,
      progress
    );
    return Math.min((current / achievement.requirements.value) * 100, 100);
  }

  static getCurrentValue(
    type: string,
    progress: Partial<UserProgress>
  ): number {
    switch (type) {
      case 'sessions_completed':
        return progress.totalSessions || 0;
      case 'streak_days':
        return progress.currentStreak || 0;
      case 'total_time':
        return progress.totalTimeMinutes || 0;
      case 'weekly_goal':
        return progress.weeklySessions || 0;
      case 'monthly_goal':
        return progress.monthlySessions || 0;
      default:
        return 0;
    }
  }

  static calculateCurrentStreak(sessions: any[]): number {
    if (sessions.length === 0) return 0;

    const sortedSessions = sessions
      .filter(s => s.completedAt)
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.completedAt);
      sessionDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === streak) {
        streak++;
        currentDate = new Date(sessionDate);
      } else if (diffDays > streak) {
        break;
      }
    }

    return streak;
  }

  static calculateLongestStreak(sessions: any[]): number {
    if (sessions.length === 0) return 0;

    const sortedSessions = sessions
      .filter(s => s.completedAt)
      .sort(
        (a, b) =>
          new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
      );

    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < sortedSessions.length; i++) {
      const prevDate = new Date(sortedSessions[i - 1].completedAt);
      const currDate = new Date(sortedSessions[i].completedAt);

      const diffDays = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }

    return Math.max(longestStreak, currentStreak);
  }

  static calculateWeeklySessions(sessions: any[]): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return sessions.filter(session => {
      const sessionDate = new Date(session.completedAt);
      return sessionDate >= oneWeekAgo;
    }).length;
  }

  static calculateMonthlySessions(sessions: any[]): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return sessions.filter(session => {
      const sessionDate = new Date(session.completedAt);
      return sessionDate >= oneMonthAgo;
    }).length;
  }

  static getAchievementsByCategory(
    category: Achievement['category']
  ): Achievement[] {
    return this.ACHIEVEMENTS.filter(
      achievement => achievement.category === category
    );
  }

  static getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
    return this.ACHIEVEMENTS.filter(
      achievement => achievement.rarity === rarity
    );
  }

  static getUnlockedAchievements(achievements: Achievement[]): Achievement[] {
    return achievements.filter(achievement => achievement.isUnlocked);
  }

  static getLockedAchievements(achievements: Achievement[]): Achievement[] {
    return achievements.filter(achievement => !achievement.isUnlocked);
  }

  static getRecentlyUnlockedAchievements(
    achievements: Achievement[]
  ): Achievement[] {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    return achievements.filter(
      achievement =>
        achievement.isUnlocked &&
        achievement.unlockedAt &&
        new Date(achievement.unlockedAt) >= oneDayAgo
    );
  }
}
