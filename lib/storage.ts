export interface SessionData {
  id: string
  date: string
  type: "strength" | "volleyball" | "conditioning"
  exercises: Array<{
    name: string
    sets: Array<{
      reps: number
      weight?: number
      rpe: number
      completed: boolean
    }>
  }>
  totalRPE: number
  duration: number
  completed: boolean
}

export interface CheckInData {
  date: string
  mood: number
  energy: number
  sleep: number
  soreness: number
}

export const StorageKeys = {
  TRAINING_SESSIONS: "trainingSessions",
  DAILY_CHECK_INS: "dailyCheckIns",
  USER_PROGRESS: "userProgress",
  CURRENT_SESSION: "currentSession",
} as const

export class TrainingStorage {
  static saveSession(session: SessionData): void {
    const sessions = this.getSessions()
    const existingIndex = sessions.findIndex((s) => s.id === session.id)

    if (existingIndex >= 0) {
      sessions[existingIndex] = session
    } else {
      sessions.push(session)
    }

    localStorage.setItem(StorageKeys.TRAINING_SESSIONS, JSON.stringify(sessions))

    // Trigger storage event for real-time updates
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: StorageKeys.TRAINING_SESSIONS,
        newValue: JSON.stringify(sessions),
      }),
    )
  }

  static getSessions(): SessionData[] {
    const data = localStorage.getItem(StorageKeys.TRAINING_SESSIONS)
    return data ? JSON.parse(data) : []
  }

  static saveCheckIn(checkIn: CheckInData): void {
    const checkIns = this.getCheckIns()
    const existingIndex = checkIns.findIndex((c) => c.date === checkIn.date)

    if (existingIndex >= 0) {
      checkIns[existingIndex] = checkIn
    } else {
      checkIns.push(checkIn)
    }

    localStorage.setItem(StorageKeys.DAILY_CHECK_INS, JSON.stringify(checkIns))

    // Trigger storage event for real-time updates
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: StorageKeys.DAILY_CHECK_INS,
        newValue: JSON.stringify(checkIns),
      }),
    )
  }

  static getCheckIns(): CheckInData[] {
    const data = localStorage.getItem(StorageKeys.DAILY_CHECK_INS)
    return data ? JSON.parse(data) : []
  }

  static getCurrentSession(): SessionData | null {
    const data = localStorage.getItem(StorageKeys.CURRENT_SESSION)
    return data ? JSON.parse(data) : null
  }

  static saveCurrentSession(session: SessionData): void {
    localStorage.setItem(StorageKeys.CURRENT_SESSION, JSON.stringify(session))
  }

  static clearCurrentSession(): void {
    localStorage.removeItem(StorageKeys.CURRENT_SESSION)
  }
}
