'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Settings,
  Zap,
  Target,
  Brain
} from 'lucide-react';
import { useIntelligentScheduling } from '@/lib/hooks/use-intelligent-scheduling';

interface SessionManagementDashboardProps {
  userId: string;
}

export function SessionManagementDashboard({ userId }: SessionManagementDashboardProps) {
  const {
    currentWeekSchedule,
    nextWeekSchedule,
    missedSessions,
    timingRecommendations,
    conflicts,
    isLoading,
    isGeneratingSchedule,
    isResolvingConflicts,
    error,
    generateWeeklySchedule,
    resolveConflicts,
    applyResolutions,
    saveSchedule,
    refreshDashboard,
  } = useIntelligentScheduling(userId);

  const [selectedWeek, setSelectedWeek] = useState<'current' | 'next'>('current');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading session management dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const selectedSchedule = selectedWeek === 'current' ? currentWeekSchedule : nextWeekSchedule;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Intelligent Session Management</h1>
          <p className="text-muted-foreground">
            AI-powered scheduling, conflict resolution, and optimal timing recommendations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refreshDashboard}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => generateWeeklySchedule(new Date().toISOString().split('T')[0])}
            disabled={isGeneratingSchedule}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Generate Schedule
          </Button>
        </div>
      </div>

      {/* Week Selector */}
      <div className="flex gap-2">
        <Button
          variant={selectedWeek === 'current' ? 'default' : 'outline'}
          onClick={() => setSelectedWeek('current')}
        >
          Current Week
        </Button>
        <Button
          variant={selectedWeek === 'next' ? 'default' : 'outline'}
          onClick={() => setSelectedWeek('next')}
        >
          Next Week
        </Button>
      </div>

      {/* Schedule Overview */}
      {selectedSchedule && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedSchedule.sessions.length}</div>
              <p className="text-xs text-muted-foreground">
                {selectedSchedule.optimal ? 'Optimal schedule' : 'Conflicts detected'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recovery Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedSchedule.recoveryDays.length}</div>
              <p className="text-xs text-muted-foreground">
                Planned rest days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{conflicts.length}</div>
              <p className="text-xs text-muted-foreground">
                Need resolution
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule Details */}
      {selectedSchedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {selectedWeek === 'current' ? 'Current Week' : 'Next Week'} Schedule
              <Badge variant={selectedSchedule.optimal ? 'default' : 'destructive'}>
                {selectedSchedule.optimal ? 'Optimal' : 'Conflicts'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedSchedule.sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{session.type}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{session.time}</span>
                    </div>
                    <Badge variant="outline">{session.intensity}</Badge>
                    <Badge variant="outline">{session.duration}min</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.conflicts.length > 0 && (
                      <Badge variant="destructive">
                        {session.conflicts.length} conflicts
                      </Badge>
                    )}
                    <Badge variant={session.optimal ? 'default' : 'secondary'}>
                      {session.priority}
                    </Badge>
                  </div>
                </div>
              ))}

              {selectedSchedule.sessions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No sessions scheduled for this week
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conflicts Resolution */}
      {conflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Schedule Conflicts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conflicts.map((conflict) => (
                <div
                  key={conflict.conflictId}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{conflict.reason}</div>
                    <div className="text-sm text-muted-foreground">
                      Resolution: {conflict.resolution}
                    </div>
                    {conflict.newDate && (
                      <div className="text-sm text-muted-foreground">
                        New date: {new Date(conflict.newDate).toLocaleDateString()}
                      </div>
                    )}
                    {conflict.newTime && (
                      <div className="text-sm text-muted-foreground">
                        New time: {conflict.newTime}
                      </div>
                    )}
                  </div>
                  <Badge variant={conflict.impact === 'high' ? 'destructive' : 'secondary'}>
                    {conflict.impact} impact
                  </Badge>
                </div>
              ))}
              <div className="flex gap-2">
                <Button
                  onClick={applyResolutions}
                  disabled={isResolvingConflicts}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Apply Resolutions
                </Button>
                <Button
                  variant="outline"
                  onClick={resolveConflicts}
                  disabled={isResolvingConflicts}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-resolve
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Missed Sessions */}
      {missedSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              Missed Sessions Recovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missedSessions.map((recovery) => (
                <div
                  key={recovery.missedSessionId}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">Recovery Session</div>
                    <div className="text-sm text-muted-foreground">
                      Original: {new Date(recovery.originalDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Recovery: {new Date(recovery.recoveryDate).toLocaleDateString()} at {recovery.recoveryTime}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {recovery.reason}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{recovery.adjustedIntensity}</Badge>
                    <Badge variant={recovery.optimal ? 'default' : 'destructive'}>
                      {recovery.optimal ? 'Optimal' : 'Conflicts'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timing Recommendations */}
      {timingRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Optimal Timing Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Best Times */}
              <div>
                <h4 className="font-medium mb-3">Best Training Times</h4>
                <div className="space-y-2">
                  {timingRecommendations.bestTimes?.slice(0, 3).map((time: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{time.time}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={time.confidence} className="w-20" />
                        <span className="text-xs text-muted-foreground">{time.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Patterns */}
              <div>
                <h4 className="font-medium mb-3">Weekly Patterns</h4>
                <div className="space-y-2">
                  {timingRecommendations.weeklyPattern?.slice(0, 3).map((pattern: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{pattern.day}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{pattern.avgTime}</span>
                        <Badge variant="outline">{pattern.success}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={saveSchedule}
          disabled={!selectedSchedule || conflicts.length > 0}
        >
          <Settings className="h-4 w-4 mr-2" />
          Save Schedule
        </Button>
        <Button
          variant="outline"
          onClick={() => generateWeeklySchedule(new Date().toISOString().split('T')[0])}
          disabled={isGeneratingSchedule}
        >
          <Zap className="h-4 w-4 mr-2" />
          Regenerate Schedule
        </Button>
      </div>
    </div>
  );
}
