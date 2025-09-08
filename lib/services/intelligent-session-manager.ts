'use client';

import { DatabaseService, SessionData } from './database-service';
import {
  SessionSchedulingService,
  AutomaticSchedule,
  ConflictResolution,
  MissedSessionRecovery,
} from './session-scheduling-service';
import {
  sessionProgramIntegration,
  SessionProgram,
} from './session-program-integration';

export interface IntelligentSessionManager {
  // Automatic session scheduling

  generateWeeklySchedule(
    userId: string,
    weekStart: string,
    userPreferences?: any
  ): Promise<AutomaticSchedule>;

  // Conflict resolution

  resolveScheduleConflicts(
    schedule: AutomaticSchedule,
    userId: string
  ): Promise<ConflictResolution[]>;

  // Missed session recovery

  handleMissedSessions(
    userId: string,
    missedSessionIds: string[]
  ): Promise<MissedSessionRecovery[]>;

  // Optimal timing recommendations

  getOptimalTimingRecommendations(userId: string): Promise<any>;

  // Session program integration

  generateSessionProgramsForSchedule(
    schedule: AutomaticSchedule,
    userId: string
  ): Promise<SessionProgram[]>;
}

export class IntelligentSessionManagerService
  implements IntelligentSessionManager
{
  private databaseService = new DatabaseService();

  // Generate automatic weekly schedule

  async generateWeeklySchedule(
    userId: string,

    weekStart: string,

    userPreferences: any = {}
  ): Promise<AutomaticSchedule> {
    try {
      // Fetch user data
      const [sessions, checkIns] = await Promise.all([
        this.databaseService.getSessions(userId),
        this.databaseService.getCheckIns(userId),
      ]);

      // Default user preferences
      const defaultPreferences = {
        preferredTimes: ['18:00', '19:00', '20:00'],
        availableDays: [1, 2, 3, 4, 5], // Monday to Friday
        maxSessionsPerWeek: 3,
        preferredSessionTypes: ['strength', 'volleyball', 'conditioning'],
        ...userPreferences,
      };

      // Generate automatic schedule
      const schedule = SessionSchedulingService.generateAutomaticSchedule(
        weekStart,
        sessions,
        checkIns,
        defaultPreferences
      );

      return schedule;
    } catch (error) {
      console.error('Error generating weekly schedule:', error);
      throw new Error('Failed to generate weekly schedule');
    }
  }

  // Resolve schedule conflicts

  async resolveScheduleConflicts(
    schedule: AutomaticSchedule,

    userId: string
  ): Promise<ConflictResolution[]> {
    try {
      // Fetch user data for conflict resolution
      const [sessions, checkIns] = await Promise.all([
        this.databaseService.getSessions(userId),
        this.databaseService.getCheckIns(userId),
      ]);

      // Resolve conflicts
      const resolutions = SessionSchedulingService.resolveConflicts(
        schedule,
        sessions,
        checkIns
      );

      return resolutions;
    } catch (error) {
      console.error('Error resolving schedule conflicts:', error);
      throw new Error('Failed to resolve schedule conflicts');
    }
  }

  // Handle missed sessions

  async handleMissedSessions(
    userId: string,

    missedSessionIds: string[]
  ): Promise<MissedSessionRecovery[]> {
    try {
      // Fetch user data
      const [sessions, checkIns] = await Promise.all([
        this.databaseService.getSessions(userId),
        this.databaseService.getCheckIns(userId),
      ]);

      const recoveries: MissedSessionRecovery[] = [];

      for (const sessionId of missedSessionIds) {
        // Find the missed session
        const missedSession = sessions.find(s => s.id === sessionId);
        if (!missedSession) continue;

        // Generate recovery plan
        const recovery = SessionSchedulingService.generateMissedSessionRecovery(
          sessionId,
          missedSession.date,
          sessions,
          checkIns
        );

        if (recovery) {
          recoveries.push(recovery);
        }
      }

      return recoveries;
    } catch (error) {
      console.error('Error handling missed sessions:', error);
      throw new Error('Failed to handle missed sessions');
    }
  }

  // Get optimal timing recommendations

  async getOptimalTimingRecommendations(userId: string): Promise<any> {
    try {
      // Fetch user data
      const [sessions, checkIns] = await Promise.all([
        this.databaseService.getSessions(userId),
        this.databaseService.getCheckIns(userId),
      ]);

      // Generate recommendations
      const recommendations =
        SessionSchedulingService.generateOptimalTimingRecommendations(
          userId,
          sessions,
          checkIns
        );

      return recommendations;
    } catch (error) {
      console.error('Error getting optimal timing recommendations:', error);
      throw new Error('Failed to get optimal timing recommendations');
    }
  }

  // Generate session programs for schedule

  async generateSessionProgramsForSchedule(
    schedule: AutomaticSchedule,

    userId: string
  ): Promise<SessionProgram[]> {
    try {
      const sessionPrograms: SessionProgram[] = [];

      for (const session of schedule.sessions) {
        // Generate program for each scheduled session
        const program = await sessionProgramIntegration.generateSessionProgram(
          userId,
          session.type,
          {
            scheduledDate: session.date,
            scheduledTime: session.time,
            intensity: session.intensity,
            duration: session.duration,
          }
        );

        sessionPrograms.push(program);
      }

      return sessionPrograms;
    } catch (error) {
      console.error('Error generating session programs for schedule:', error);
      throw new Error('Failed to generate session programs for schedule');
    }
  }

  // Get comprehensive session management dashboard data

  async getSessionManagementDashboard(userId: string): Promise<{
    currentWeekSchedule: AutomaticSchedule;
    nextWeekSchedule: AutomaticSchedule;
    missedSessions: MissedSessionRecovery[];
    timingRecommendations: any;
    conflicts: ConflictResolution[];
  }> {
    try {
      const today = new Date();
      const currentWeekStart = this.getWeekStart(today);
      const nextWeekStart = new Date(today);
      nextWeekStart.setDate(today.getDate() + 7);
      const nextWeekStartStr = this.getWeekStart(nextWeekStart);

      // Generate schedules
      const [currentWeekSchedule, nextWeekSchedule] = await Promise.all([
        this.generateWeeklySchedule(userId, currentWeekStart),
        this.generateWeeklySchedule(userId, nextWeekStartStr),
      ]);

      // Get missed sessions
      const sessions = await this.databaseService.getSessions(userId);
      const missedSessions = sessions
        .filter(s => !s.completed && new Date(s.date) < today)
        .map(s => s.id);

      const missedSessionRecoveries = await this.handleMissedSessions(
        userId,
        missedSessions
      );

      // Get timing recommendations
      const timingRecommendations =
        await this.getOptimalTimingRecommendations(userId);

      // Resolve conflicts
      const conflicts = await this.resolveScheduleConflicts(
        currentWeekSchedule,
        userId
      );

      return {
        currentWeekSchedule,
        nextWeekSchedule,
        missedSessions: missedSessionRecoveries,
        timingRecommendations,
        conflicts,
      };
    } catch (error) {
      console.error('Error getting session management dashboard:', error);
      throw new Error('Failed to get session management dashboard');
    }
  }

  // Helper method to get week start (Monday)
  private getWeekStart(date: Date): string {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().split('T')[0];
  }

  // Apply conflict resolutions to schedule
  async applyConflictResolutions(
    schedule: AutomaticSchedule,
    resolutions: ConflictResolution[]
  ): Promise<AutomaticSchedule> {
    const updatedSchedule = { ...schedule };
    const updatedSessions = [...schedule.sessions];

    for (const resolution of resolutions) {
      const sessionIndex = updatedSessions.findIndex(
        s => s.id === resolution.conflictId.split('_')[0]
      );

      if (sessionIndex === -1) continue;

      const session = updatedSessions[sessionIndex];

      switch (resolution.resolution) {
        case 'reschedule':
          if (resolution.newDate) {
            session.date = resolution.newDate;
            session.reason += ` (Rescheduled due to ${resolution.reason})`;
          }
          break;

        case 'adjust_time':
          if (resolution.newTime) {
            session.time = resolution.newTime;
            session.reason += ` (Time adjusted due to ${resolution.reason})`;
          }
          break;

        case 'reduce_intensity':
          if (resolution.newIntensity) {
            session.intensity = resolution.newIntensity;
            session.reason += ` (Intensity reduced due to ${resolution.reason})`;
          }
          break;

        case 'postpone':
          if (resolution.newDate) {
            session.date = resolution.newDate;
            session.priority = 'low';
            session.reason += ` (Postponed due to ${resolution.reason})`;
          }
          break;

        case 'skip':
          // Remove session from schedule
          updatedSessions.splice(sessionIndex, 1);
          break;
      }
    }

    updatedSchedule.sessions = updatedSessions;
    updatedSchedule.conflicts = []; // Clear conflicts after resolution
    updatedSchedule.optimal = true; // Mark as optimal after resolution

    return updatedSchedule;
  }

  // Save resolved schedule to database

  async saveResolvedSchedule(
    schedule: AutomaticSchedule,

    userId: string
  ): Promise<void> {
    try {
      for (const session of schedule.sessions) {
        // Create session data for database
        const sessionData: Partial<SessionData> = {
          date: session.date,
          type: session.type,
          status: 'planned',
          week_number: this.getWeekNumber(session.date),
          day_number: new Date(session.date).getDay(),
          totalRPE: 0,
          completed: false,
          exercises: [],
          notes: session.reason,
        };

        // Save to database
        await this.databaseService.saveSession(sessionData);
      }
    } catch (error) {
      console.error('Error saving resolved schedule:', error);
      throw new Error('Failed to save resolved schedule');
    }
  }

  // Helper method to get week number
  private getWeekNumber(date: string): number {
    const dateObj = new Date(date);
    const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
    const days = Math.floor(
      (dateObj.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  }
}

// Export singleton instance
export const intelligentSessionManager = new IntelligentSessionManagerService();
