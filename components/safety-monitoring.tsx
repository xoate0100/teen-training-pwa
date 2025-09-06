'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  Heart,
  Activity,
  Phone,
  Shield,
  Thermometer,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface SafetyMetrics {
  fatigueLevel: number;
  heartRateZone: 'rest' | 'moderate' | 'vigorous' | 'maximum';
  hydrationReminder: boolean;
  injuryRisk: 'low' | 'moderate' | 'high';
  sessionDuration: number;
  lastBreak: number;
}

export function FatigueMonitor() {
  const [metrics, setMetrics] = useState<SafetyMetrics>({
    fatigueLevel: 35,
    heartRateZone: 'moderate',
    hydrationReminder: false,
    injuryRisk: 'low',
    sessionDuration: 25,
    lastBreak: 8,
  });

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Simulate real-time monitoring
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        sessionDuration: prev.sessionDuration + 1,
        lastBreak: prev.lastBreak + 1,
        fatigueLevel: Math.min(100, prev.fatigueLevel + Math.random() * 2),
        hydrationReminder:
          prev.sessionDuration > 20 && prev.sessionDuration % 15 === 0,
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (metrics.fatigueLevel > 70 || metrics.lastBreak > 15) {
      setShowAlert(true);
    }
  }, [metrics]);

  const getFatigueColor = (level: number) => {
    if (level < 40) return 'bg-green-500';
    if (level < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getHeartRateColor = (zone: string) => {
    switch (zone) {
      case 'rest':
        return 'bg-blue-500';
      case 'moderate':
        return 'bg-green-500';
      case 'vigorous':
        return 'bg-yellow-500';
      case 'maximum':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className='space-y-4'>
      {showAlert && (
        <Alert className='border-red-200 bg-red-50'>
          <AlertTriangle className='h-4 w-4 text-red-600' />
          <AlertDescription className='text-red-800'>
            High fatigue detected. Consider taking a break or reducing
            intensity.
          </AlertDescription>
          <Button
            size='sm'
            className='mt-2'
            onClick={() => setShowAlert(false)}
          >
            Take Break
          </Button>
        </Alert>
      )}

      <div className='grid grid-cols-2 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm flex items-center gap-2'>
              <Activity className='h-4 w-4' />
              Fatigue Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <Progress value={metrics.fatigueLevel} className='h-2' />
              <div className='flex justify-between text-xs text-muted-foreground'>
                <span>Fresh</span>
                <span className='font-medium'>{metrics.fatigueLevel}%</span>
                <span>Exhausted</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm flex items-center gap-2'>
              <Heart className='h-4 w-4' />
              Heart Rate Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={`${getHeartRateColor(metrics.heartRateZone)} text-white capitalize`}
            >
              {metrics.heartRateZone}
            </Badge>
            <p className='text-xs text-muted-foreground mt-1'>
              Target: Moderate-Vigorous
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm flex items-center gap-2'>
              <Clock className='h-4 w-4' />
              Session Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-lg font-semibold'>
              {metrics.sessionDuration} min
            </p>
            <p className='text-xs text-muted-foreground'>
              Last break: {metrics.lastBreak} min ago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm flex items-center gap-2'>
              <Shield className='h-4 w-4' />
              Injury Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={metrics.injuryRisk === 'low' ? 'default' : 'destructive'}
            >
              {metrics.injuryRisk}
            </Badge>
            <p className='text-xs text-muted-foreground mt-1'>
              Based on fatigue & form
            </p>
          </CardContent>
        </Card>
      </div>

      {metrics.hydrationReminder && (
        <Alert className='border-blue-200 bg-blue-50'>
          <Thermometer className='h-4 w-4 text-blue-600' />
          <AlertDescription className='text-blue-800'>
            Time for a hydration break! Drink some water to stay energized.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export function InjuryPreventionAlerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'form',
      message: 'Knee alignment during squats - keep knees tracking over toes',
      severity: 'medium',
      exercise: 'Goblet Squat',
    },
    {
      id: 2,
      type: 'fatigue',
      message: 'RPE consistently above 8 - consider reducing weight',
      severity: 'high',
      exercise: 'Dumbbell Row',
    },
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'high':
        return 'border-red-200 bg-red-50 text-red-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className='space-y-3'>
      <h3 className='font-semibold text-sm flex items-center gap-2'>
        <Shield className='h-4 w-4' />
        Safety Alerts
      </h3>

      {alerts.length === 0 ? (
        <div className='text-center py-6 text-muted-foreground'>
          <CheckCircle className='h-8 w-8 mx-auto mb-2 text-green-500' />
          <p className='text-sm'>All clear! No safety concerns detected.</p>
        </div>
      ) : (
        alerts.map(alert => (
          <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              <div className='space-y-1'>
                <p className='font-medium'>{alert.exercise}</p>
                <p className='text-sm'>{alert.message}</p>
              </div>
            </AlertDescription>
            <Button
              size='sm'
              variant='outline'
              className='mt-2 bg-transparent'
              onClick={() =>
                setAlerts(prev => prev.filter(a => a.id !== alert.id))
              }
            >
              Got it
            </Button>
          </Alert>
        ))
      )}
    </div>
  );
}

export function EmergencyContacts() {
  const contacts = [
    { name: 'Coach Sarah', phone: '(555) 123-4567', role: 'Head Coach' },
    {
      name: 'Parent/Guardian',
      phone: '(555) 987-6543',
      role: 'Emergency Contact',
    },
    {
      name: 'Athletic Trainer',
      phone: '(555) 456-7890',
      role: 'Medical Support',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm flex items-center gap-2'>
          <Phone className='h-4 w-4' />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {contacts.map((contact, index) => (
          <div
            key={index}
            className='flex items-center justify-between p-2 rounded-lg bg-muted/50'
          >
            <div>
              <p className='font-medium text-sm'>{contact.name}</p>
              <p className='text-xs text-muted-foreground'>{contact.role}</p>
            </div>
            <Button
              size='sm'
              variant='outline'
              className='text-xs bg-transparent'
            >
              <Phone className='h-3 w-3 mr-1' />
              Call
            </Button>
          </div>
        ))}

        <Button className='w-full bg-red-600 hover:bg-red-700 text-white'>
          <Phone className='h-4 w-4 mr-2' />
          Emergency: 911
        </Button>
      </CardContent>
    </Card>
  );
}

export function SafetyChecklist() {
  const [checklist, setChecklist] = useState([
    { id: 1, item: 'Proper warm-up completed', checked: true },
    { id: 2, item: 'Equipment inspected for safety', checked: true },
    { id: 3, item: 'Clear workout space established', checked: false },
    { id: 4, item: 'Water bottle accessible', checked: true },
    { id: 5, item: 'Emergency contacts available', checked: true },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const completedItems = checklist.filter(item => item.checked).length;
  const totalItems = checklist.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm flex items-center gap-2'>
          <CheckCircle className='h-4 w-4' />
          Safety Checklist
        </CardTitle>
        <Progress value={(completedItems / totalItems) * 100} className='h-2' />
        <p className='text-xs text-muted-foreground'>
          {completedItems}/{totalItems} items completed
        </p>
      </CardHeader>
      <CardContent className='space-y-2'>
        {checklist.map(item => (
          <div key={item.id} className='flex items-center gap-3'>
            <input
              type='checkbox'
              checked={item.checked}
              onChange={() => toggleCheck(item.id)}
              className='rounded border-gray-300'
            />
            <span
              className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}
            >
              {item.item}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
