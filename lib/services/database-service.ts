'use client';

import { createSupabaseClient } from '@/lib/supabase/client';

// Types matching the existing storage interface
export interface SessionData {
  id: string;
  user_id: string;
  date: string;
  type: 'strength' | 'volleyball' | 'conditioning';
  exercises: Array<{
    name: string;
    sets: Array<{
      reps: number;
      weight?: number;
      rpe: number;
      completed: boolean;
    }>;
  }>;
  totalRPE: number;
  duration: number;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CheckInData {
  id?: string;
  user_id: string;
  date: string;
  mood: number;
  energy: number;
  sleep: number;
  soreness: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProgressMetrics {
  id?: string;
  user_id: string;
  date: string;
  metric_type: 'strength' | 'endurance' | 'flexibility' | 'coordination';
  value: number;
  unit: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export class DatabaseService {
  private supabase = createSupabaseClient();

  // Session Management
  async saveSession(
    session: Omit<SessionData, 'user_id'>
  ): Promise<SessionData> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const sessionData = {
      ...session,
      user_id: user.id,
    };

    const { data, error } = await this.supabase
      .from('sessions')
      .upsert(sessionData, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getSessions(userId?: string): Promise<SessionData[]> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('sessions')
      .select('*')
      .eq('user_id', targetUserId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    return data;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;
  }

  // Check-in Management
  async saveCheckIn(
    checkIn: Omit<CheckInData, 'user_id'>
  ): Promise<CheckInData> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const checkInData = {
      ...checkIn,
      user_id: user.id,
    };

    const { data, error } = await this.supabase
      .from('daily_check_ins')
      .upsert(checkInData, { onConflict: 'user_id,date' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getCheckIns(userId?: string): Promise<CheckInData[]> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('daily_check_ins')
      .select('*')
      .eq('user_id', targetUserId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getCheckIn(date: string, userId?: string): Promise<CheckInData | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('daily_check_ins')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('date', date)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    return data;
  }

  // Progress Metrics Management
  async saveProgressMetric(
    metric: Omit<ProgressMetrics, 'user_id'>
  ): Promise<ProgressMetrics> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const metricData = {
      ...metric,
      user_id: user.id,
    };

    const { data, error } = await this.supabase
      .from('progress_metrics')
      .upsert(metricData, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProgressMetrics(userId?: string): Promise<ProgressMetrics[]> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('progress_metrics')
      .select('*')
      .eq('user_id', targetUserId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Real-time subscriptions
  subscribeToSessions(
    // eslint-disable-next-line no-unused-vars
    callback: (_sessions: SessionData[]) => void,
    userId?: string
  ) {
    const {
      data: { user },
    } = this.supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) return null;

    return this.supabase
      .channel('sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
          filter: `user_id=eq.${targetUserId}`,
        },
        async () => {
          const updatedSessions = await this.getSessions(targetUserId);
          callback(updatedSessions);
        }
      )
      .subscribe();
  }

  subscribeToCheckIns(
    // eslint-disable-next-line no-unused-vars
    callback: (_checkIns: CheckInData[]) => void,
    userId?: string
  ) {
    const {
      data: { user },
    } = this.supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) return null;

    return this.supabase
      .channel('check_ins_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_check_ins',
          filter: `user_id=eq.${targetUserId}`,
        },
        async () => {
          const updatedCheckIns = await this.getCheckIns(targetUserId);
          callback(updatedCheckIns);
        }
      )
      .subscribe();
  }

  // Data migration from localStorage
  async migrateFromLocalStorage(): Promise<void> {
    try {
      // Migrate sessions
      const sessionsData = localStorage.getItem('trainingSessions');
      if (sessionsData) {
        const sessionsToMigrate: SessionData[] = JSON.parse(sessionsData);
        for (const session of sessionsToMigrate) {
          await this.saveSession(session);
        }
        localStorage.removeItem('trainingSessions');
      }

      // Migrate check-ins
      const checkInsData = localStorage.getItem('dailyCheckIns');
      if (checkInsData) {
        const checkInsToMigrate: CheckInData[] = JSON.parse(checkInsData);
        for (const checkIn of checkInsToMigrate) {
          await this.saveCheckIn(checkIn);
        }
        localStorage.removeItem('dailyCheckIns');
      }

      // Clear other localStorage items
      localStorage.removeItem('currentSession');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('onboardingComplete');
    } catch (error) {
      console.error('Error migrating data from localStorage:', error);
      throw error;
    }
  }

  // Offline support
  async getOfflineData(): Promise<{
    sessions: SessionData[];
    checkIns: CheckInData[];
  }> {
    try {
      const sessionsData = await this.getSessions();
      const checkInsData = await this.getCheckIns();
      return { sessions: sessionsData, checkIns: checkInsData };
    } catch (error) {
      console.error('Error fetching offline data:', error);
      // Fallback to localStorage if available
      const sessionsData = localStorage.getItem('trainingSessions');
      const checkInsData = localStorage.getItem('dailyCheckIns');

      return {
        sessions: sessionsData ? JSON.parse(sessionsData) : [],
        checkIns: checkInsData ? JSON.parse(checkInsData) : [],
      };
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
