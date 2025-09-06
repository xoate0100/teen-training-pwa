'use client';

import { useWeekCalculation } from '@/lib/hooks/use-week-calculation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

export function WeekCalculationDisplay() {
  const {
    weekCalculation,
    sessionRecommendation,
    isLoading,
    error,
    getNextSessionDate,
    isTrainingDay,
    getMissedSessions,
    getProgramProgress,
    isDeloadWeek,
    // getRecommendedIntensity,
    getSessionsThisWeek,
    getWeekDates,
    getCurrentWeekInfo,
  } = useWeekCalculation();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Calculating week information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weekCalculation) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No week calculation available
          </div>
        </CardContent>
      </Card>
    );
  }

  const weekInfo = getCurrentWeekInfo();
  const weekDates = getWeekDates();
  const sessionsThisWeek = getSessionsThisWeek();
  const nextSessionDate = getNextSessionDate();
  const missedSessions = getMissedSessions();
  const programProgress = getProgramProgress();
  const isDeload = isDeloadWeek();
  const isTraining = isTrainingDay();

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getIntensityIcon = (intensity: string) => {
    switch (intensity) {
      case 'low': return <Activity className="w-4 h-4" />;
      case 'moderate': return <Target className="w-4 h-4" />;
      case 'high': return <Zap className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Week Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Week {weekInfo.week} - Day {weekInfo.day}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {weekInfo.week}
              </div>
              <div className="text-sm text-muted-foreground">Current Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {sessionsThisWeek.length}
              </div>
              <div className="text-sm text-muted-foreground">Sessions This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {missedSessions}
              </div>
              <div className="text-sm text-muted-foreground">Missed Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(programProgress)}%
              </div>
              <div className="text-sm text-muted-foreground">Program Progress</div>
            </div>
          </div>

          {/* Program Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Program Progress</span>
              <span>{Math.round(programProgress)}%</span>
            </div>
            <Progress value={programProgress} className="h-2" />
          </div>

          {/* Week Status Badges */}
          <div className="flex flex-wrap gap-2">
            {isDeload && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Activity className="w-3 h-3 mr-1" />
                Deload Week
              </Badge>
            )}
            {isTraining && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Training Day
              </Badge>
            )}
            {!isTraining && !weekCalculation.isRestDay && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                <Clock className="w-3 h-3 mr-1" />
                Rest Recommended
              </Badge>
            )}
            {weekCalculation.isRestDay && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                <Clock className="w-3 h-3 mr-1" />
                Scheduled Rest Day
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Recommendation */}
      {sessionRecommendation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Today's Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">Session Type:</span>
                <Badge variant="outline">
                  {sessionRecommendation.recommendedType.charAt(0).toUpperCase() + 
                   sessionRecommendation.recommendedType.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Intensity:</span>
                <Badge className={getIntensityColor(sessionRecommendation.intensity)}>
                  {getIntensityIcon(sessionRecommendation.intensity)}
                  <span className="ml-1 capitalize">{sessionRecommendation.intensity}</span>
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Duration:</span>
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {sessionRecommendation.duration} minutes
              </Badge>
            </div>

            <div>
              <span className="font-medium">Focus Areas:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {sessionRecommendation.focus.map((focus, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {focus}
                  </Badge>
                ))}
              </div>
            </div>

            {sessionRecommendation.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-800">Warnings:</div>
                    <ul className="text-sm text-yellow-700 mt-1">
                      {sessionRecommendation.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm">
                <span className="font-medium">Reason: </span>
                {sessionRecommendation.reason}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Week Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Week Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Week Start:</span>
              <span>{format(new Date(weekDates.startDate), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Week End:</span>
              <span>{format(new Date(weekDates.endDate), 'MMM dd, yyyy')}</span>
            </div>
            {nextSessionDate && (
              <div className="flex justify-between text-sm">
                <span>Next Session:</span>
                <span>{format(new Date(nextSessionDate), 'MMM dd, yyyy')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {sessionsThisWeek.filter(s => s.completed).length}
            </div>
            <div className="text-sm text-muted-foreground">Completed This Week</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {3 - sessionsThisWeek.length}
            </div>
            <div className="text-sm text-muted-foreground">Sessions Remaining</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(programProgress)}%
            </div>
            <div className="text-sm text-muted-foreground">Program Complete</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
