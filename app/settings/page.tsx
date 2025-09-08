'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Settings,
  Palette,
  Bell,
  Shield,
  Activity,
  Heart,
  Brain,
  Eye,
  Volume2,
  Search,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  History,
} from 'lucide-react';
import { useDeepPersonalization } from '@/lib/hooks/use-deep-personalization';
import { useUser } from '@/lib/contexts/user-context';
import {
  OneHandedSettings,
  useOneHandedNavigation,
} from '@/components/one-handed-navigation';
import { cn } from '@/lib/utils';
import {
  HierarchicalNavigation,
  MobileBottomNavigation,
} from '@/components/navigation/hierarchical-navigation';
import { useResponsiveNavigation } from '@/hooks/use-responsive-navigation';
import { SettingsSearch } from '@/components/settings-search';
import { SettingsPreview } from '@/components/settings-preview';
import { SettingsHelp } from '@/components/settings-help';
import { ThemeSelector } from '@/components/theme-selector';
import { PersonalizationSettings } from '@/components/personalization-settings';
import { 
  FormField, 
  ToggleSwitch, 
  SliderControl, 
  SelectField, 
  TextInput, 
  MultiSelect, 
  FormSection, 
  FormActions,
  useFormValidation 
} from '@/components/settings-form-components';
import { SettingsValidation } from '@/components/settings-validation';
import { SettingsUndoRedo } from '@/components/settings-undo-redo';

interface SettingsData {
  profile: {
    name: string;
    email: string;
    age: number;
    sport: string;
    experience: string;
    goals: string[];
  };
  preferences: {
    theme: string;
    language: string;
    timezone: string;
    units: 'metric' | 'imperial';
  };
  notifications: {
    email: boolean;
    push: boolean;
    achievements: boolean;
    reminders: boolean;
    weeklyReports: boolean;
  };
  training: {
    equipment: string[];
    schedule: {
      days: string[];
      time: string;
      duration: number;
    };
    intensity: 'low' | 'medium' | 'high';
    focus: string[];
  };
  accessibility: {
    fontSize: number;
    highContrast: boolean;
    reducedMotion: boolean;
    audioFeedback: boolean;
    voiceInstructions: boolean;
    colorBlindMode: string;
    focusIndicators: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    location: boolean;
    social: boolean;
    exportData: boolean;
  };
}

export default function SettingsPage() {
  const { currentUser } = useUser();
  const { isMobile, currentTab, handleTabChange } = useResponsiveNavigation();
  
  // Mock personalization preferences for now
  const preferences = {
    theme: 'auto',
    language: 'en',
    timezone: 'UTC',
    units: 'metric'
  };
  
  const updatePreferences = async (category: string, data: any) => {
    console.log('Updating preferences:', category, data);
    // TODO: Implement actual preference updating
  };

  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showHelp, setShowHelp] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      age: currentUser?.age || 16,
      sport: currentUser?.sport || 'volleyball',
      experience: currentUser?.experience || 'beginner',
      goals: currentUser?.goals || [],
    },
    preferences: {
      theme: 'auto',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      units: 'metric',
    },
    notifications: {
      email: true,
      push: true,
      achievements: true,
      reminders: true,
      weeklyReports: false,
    },
    training: {
      equipment: ['bodyweight'],
      schedule: {
        days: ['monday', 'wednesday', 'friday'],
        time: '18:00',
        duration: 60,
      },
      intensity: 'medium',
      focus: ['strength', 'endurance'],
    },
    accessibility: {
      fontSize: 16,
      highContrast: false,
      reducedMotion: false,
      audioFeedback: true,
      voiceInstructions: false,
      colorBlindMode: 'none',
      focusIndicators: true,
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      location: false,
      social: false,
      exportData: true,
    },
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const { validation, validateField, clearError, clearAllErrors } = useFormValidation();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (hasChanges) {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      setHasChanges(false);
    }
  }, [settings, hasChanges]);

  const updateSetting = (
    category: keyof SettingsData,
    key: string,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const updateNestedSetting = (
    category: keyof SettingsData,
    subKey: string,
    key: string,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subKey]: {
          ...(prev[category] as any)[subKey],
          [key]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update personalization preferences
      if (preferences) {
        await updatePreferences('visual', {
          theme: settings.preferences.theme,
          fontSize: settings.accessibility.fontSize,
          highContrast: settings.accessibility.highContrast,
        });
      }

      // Apply accessibility settings to document
      document.documentElement.style.fontSize = `${settings.accessibility.fontSize}px`;
      document.documentElement.classList.toggle(
        'high-contrast',
        settings.accessibility.highContrast
      );
      document.documentElement.classList.toggle(
        'reduced-motion',
        settings.accessibility.reducedMotion
      );
      document.documentElement.classList.toggle(
        'focus-indicators',
        settings.accessibility.focusIndicators
      );

      // Save to localStorage
      localStorage.setItem('appSettings', JSON.stringify(settings));
      setHasChanges(false);

      // Show success feedback
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        profile: {
          name: currentUser?.name || '',
          email: currentUser?.email || '',
          age: currentUser?.age || 16,
          sport: currentUser?.sport || 'volleyball',
          experience: currentUser?.experience || 'beginner',
          goals: currentUser?.goals || [],
        },
        preferences: {
          theme: 'auto',
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          units: 'metric',
        },
        notifications: {
          email: true,
          push: true,
          achievements: true,
          reminders: true,
          weeklyReports: false,
        },
        training: {
          equipment: ['bodyweight'],
          schedule: {
            days: ['monday', 'wednesday', 'friday'],
            time: '18:00',
            duration: 60,
          },
          intensity: 'medium',
          focus: ['strength', 'endurance'],
        },
        accessibility: {
          fontSize: 16,
          highContrast: false,
          reducedMotion: false,
          audioFeedback: true,
          voiceInstructions: false,
          colorBlindMode: 'none',
          focusIndicators: true,
        },
        privacy: {
          dataSharing: false,
          analytics: true,
          location: false,
          social: false,
          exportData: true,
        },
      });
      setHasChanges(true);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'teen-training-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings(prev => ({ ...prev, ...imported }));
          setHasChanges(true);
        } catch (error) {
          alert('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filter tabs based on search query
    if (query) {
      const matchingTabs = ['profile', 'preferences', 'theming', 'notifications', 'training', 'accessibility', 'privacy'].filter(tab => 
        tab.toLowerCase().includes(query.toLowerCase())
      );
      if (matchingTabs.length > 0) {
        setActiveTab(matchingTabs[0]);
      }
    }
  };

  const handleFilter = (category: string) => {
    setActiveCategory(category);
    if (category !== 'all') {
      setActiveTab(category);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  return (
    <div className='min-h-screen bg-background p-4 pb-20'>
      {/* Navigation */}
      {isMobile ? (
        <MobileBottomNavigation
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />
      ) : (
        <HierarchicalNavigation
          currentTab={currentTab}
          onTabChange={handleTabChange}
          className='mb-6'
        />
      )}
      
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <div className='flex items-center justify-center gap-2'>
            <h1 className='text-3xl font-bold flex items-center gap-2'>
              <Settings className='h-8 w-8' />
              Settings
            </h1>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowValidation(!showValidation)}
                className={showValidation ? 'bg-primary text-primary-foreground' : ''}
              >
                <CheckCircle className='h-4 w-4 mr-1' />
                Validation
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowHistory(!showHistory)}
                className={showHistory ? 'bg-primary text-primary-foreground' : ''}
              >
                <History className='h-4 w-4 mr-1' />
                History
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowHelp(!showHelp)}
                className={showHelp ? 'bg-primary text-primary-foreground' : ''}
              >
                <HelpCircle className='h-4 w-4 mr-1' />
                Help
              </Button>
            </div>
          </div>
          <p className='text-muted-foreground'>
            Customize your Teen Training experience
          </p>
          {hasChanges && (
            <Badge
              variant='outline'
              className='bg-yellow-50 text-yellow-700 border-yellow-200'
            >
              <AlertCircle className='h-3 w-3 mr-1' />
              Unsaved changes
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap gap-2 justify-center'>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            <Check className='h-4 w-4 mr-2' />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant='outline' onClick={handleReset}>
            <RotateCcw className='h-4 w-4 mr-2' />
            Reset to Default
          </Button>
          <Button variant='outline' onClick={handleExport}>
            <Download className='h-4 w-4 mr-2' />
            Export Settings
          </Button>
          <label className='cursor-pointer'>
            <Button variant='outline' asChild>
              <span>
                <Upload className='h-4 w-4 mr-2' />
                Import Settings
              </span>
            </Button>
            <input
              type='file'
              accept='.json'
              onChange={handleImport}
              className='hidden'
            />
          </label>
        </div>

        {/* Search and Help */}
        <div className='space-y-4'>
          <SettingsSearch
            onSearch={handleSearch}
            onFilter={handleFilter}
            onClear={handleClear}
            searchQuery={searchQuery}
            activeCategory={activeCategory}
          />
          
          {showHelp && (
            <SettingsHelp />
          )}
        </div>

        {/* Settings Preview */}
        <SettingsPreview
          settings={settings}
          onSettingChange={updateSetting}
          onReset={handleReset}
        />

        {/* Settings Validation */}
        {showValidation && (
          <SettingsValidation
            settings={settings}
            onValidationChange={(isValid, results) => {
              console.log('Validation results:', { isValid, results });
            }}
          />
        )}

        {/* Settings History */}
        {showHistory && (
          <SettingsUndoRedo
            currentSettings={settings}
            onSettingsChange={(newSettings) => {
              setSettings(newSettings);
              setHasChanges(true);
            }}
            onSave={handleSave}
          />
        )}

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-7'>
            <TabsTrigger value='profile' className='flex items-center gap-2'>
              <User className='h-4 w-4' />
              <span className='hidden sm:inline'>Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value='preferences'
              className='flex items-center gap-2'
            >
              <Palette className='h-4 w-4' />
              <span className='hidden sm:inline'>Preferences</span>
            </TabsTrigger>
            <TabsTrigger
              value='theming'
              className='flex items-center gap-2'
            >
              <Palette className='h-4 w-4' />
              <span className='hidden sm:inline'>Theming</span>
            </TabsTrigger>
            <TabsTrigger
              value='notifications'
              className='flex items-center gap-2'
            >
              <Bell className='h-4 w-4' />
              <span className='hidden sm:inline'>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value='training' className='flex items-center gap-2'>
              <Activity className='h-4 w-4' />
              <span className='hidden sm:inline'>Training</span>
            </TabsTrigger>
            <TabsTrigger
              value='accessibility'
              className='flex items-center gap-2'
            >
              <Eye className='h-4 w-4' />
              <span className='hidden sm:inline'>Accessibility</span>
            </TabsTrigger>
            <TabsTrigger value='privacy' className='flex items-center gap-2'>
              <Shield className='h-4 w-4' />
              <span className='hidden sm:inline'>Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value='profile' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Manage your personal information and training goals
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Name</Label>
                    <Input
                      id='name'
                      value={settings.profile.name}
                      onChange={e =>
                        updateSetting('profile', 'name', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      value={settings.profile.email}
                      onChange={e =>
                        updateSetting('profile', 'email', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='age'>Age</Label>
                    <Input
                      id='age'
                      type='number'
                      min='13'
                      max='19'
                      value={settings.profile.age}
                      onChange={e =>
                        updateSetting(
                          'profile',
                          'age',
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='sport'>Primary Sport</Label>
                    <Select
                      value={settings.profile.sport}
                      onValueChange={value =>
                        updateSetting('profile', 'sport', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='volleyball'>Volleyball</SelectItem>
                        <SelectItem value='basketball'>Basketball</SelectItem>
                        <SelectItem value='soccer'>Soccer</SelectItem>
                        <SelectItem value='track'>Track & Field</SelectItem>
                        <SelectItem value='swimming'>Swimming</SelectItem>
                        <SelectItem value='tennis'>Tennis</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='experience'>Experience Level</Label>
                    <Select
                      value={settings.profile.experience}
                      onValueChange={value =>
                        updateSetting('profile', 'experience', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='beginner'>Beginner</SelectItem>
                        <SelectItem value='intermediate'>
                          Intermediate
                        </SelectItem>
                        <SelectItem value='advanced'>Advanced</SelectItem>
                        <SelectItem value='elite'>Elite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Settings */}
          <TabsContent value='preferences' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Palette className='h-5 w-5' />
                  Appearance & Preferences
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your app
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='theme'>Theme</Label>
                    <Select
                      value={settings.preferences.theme}
                      onValueChange={value =>
                        updateSetting('preferences', 'theme', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='light'>Light</SelectItem>
                        <SelectItem value='dark'>Dark</SelectItem>
                        <SelectItem value='auto'>Auto (System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='language'>Language</Label>
                    <Select
                      value={settings.preferences.language}
                      onValueChange={value =>
                        updateSetting('preferences', 'language', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='en'>English</SelectItem>
                        <SelectItem value='es'>Spanish</SelectItem>
                        <SelectItem value='fr'>French</SelectItem>
                        <SelectItem value='de'>German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='timezone'>Timezone</Label>
                    <Input
                      id='timezone'
                      value={settings.preferences.timezone}
                      onChange={e =>
                        updateSetting('preferences', 'timezone', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='units'>Units</Label>
                    <Select
                      value={settings.preferences.units}
                      onValueChange={value =>
                        updateSetting('preferences', 'units', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='metric'>Metric (kg, cm)</SelectItem>
                        <SelectItem value='imperial'>
                          Imperial (lbs, ft)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Theming Settings */}
          <TabsContent value='theming' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Palette className='h-5 w-5' />
                  Advanced Theming
                </CardTitle>
                <CardDescription>
                  Customize themes based on session type, training phase, progress level, and mood
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeSelector showPreview={true} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Brain className='h-5 w-5' />
                  Personalization Settings
                </CardTitle>
                <CardDescription>
                  Advanced personalization based on your usage patterns and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PersonalizationSettings showPreview={true} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value='notifications' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Bell className='h-5 w-5' />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about your training
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-4'>
                  {Object.entries(settings.notifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className='flex items-center justify-between'
                      >
                        <div className='space-y-1'>
                          <Label htmlFor={key} className='text-sm font-medium'>
                            {key.charAt(0).toUpperCase() +
                              key.slice(1).replace(/([A-Z])/g, ' $1')}
                          </Label>
                          <p className='text-sm text-muted-foreground'>
                            {key === 'email' &&
                              'Receive notifications via email'}
                            {key === 'push' &&
                              'Receive push notifications on your device'}
                            {key === 'achievements' &&
                              'Get notified when you earn achievements'}
                            {key === 'reminders' &&
                              'Receive training reminders'}
                            {key === 'weeklyReports' &&
                              'Get weekly progress reports'}
                          </p>
                        </div>
                        <Switch
                          id={key}
                          checked={value as boolean}
                          onCheckedChange={checked =>
                            updateSetting('notifications', key, checked)
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Settings */}
          <TabsContent value='training' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Activity className='h-5 w-5' />
                  Training Preferences
                </CardTitle>
                <CardDescription>
                  Configure your training schedule and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Available Equipment</Label>
                    <div className='flex flex-wrap gap-2'>
                      {[
                        'bodyweight',
                        'dumbbells',
                        'barbell',
                        'resistance_bands',
                        'kettlebell',
                        'pull_up_bar',
                      ].map(equipment => (
                        <Button
                          key={equipment}
                          variant={
                            settings.training.equipment.includes(equipment)
                              ? 'default'
                              : 'outline'
                          }
                          size='sm'
                          onClick={() => {
                            const newEquipment =
                              settings.training.equipment.includes(equipment)
                                ? settings.training.equipment.filter(
                                    e => e !== equipment
                                  )
                                : [...settings.training.equipment, equipment];
                            updateSetting(
                              'training',
                              'equipment',
                              newEquipment
                            );
                          }}
                        >
                          {equipment.replace('_', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label>Training Days</Label>
                      <div className='flex flex-wrap gap-2'>
                        {[
                          'monday',
                          'tuesday',
                          'wednesday',
                          'thursday',
                          'friday',
                          'saturday',
                          'sunday',
                        ].map(day => (
                          <Button
                            key={day}
                            variant={
                              settings.training.schedule.days.includes(day)
                                ? 'default'
                                : 'outline'
                            }
                            size='sm'
                            onClick={() => {
                              const newDays =
                                settings.training.schedule.days.includes(day)
                                  ? settings.training.schedule.days.filter(
                                      d => d !== day
                                    )
                                  : [...settings.training.schedule.days, day];
                              updateNestedSetting(
                                'training',
                                'schedule',
                                'days',
                                newDays
                              );
                            }}
                          >
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='time'>Preferred Time</Label>
                        <Input
                          id='time'
                          type='time'
                          value={settings.training.schedule.time}
                          onChange={e =>
                            updateNestedSetting(
                              'training',
                              'schedule',
                              'time',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='duration'>
                          Session Duration (minutes)
                        </Label>
                        <Input
                          id='duration'
                          type='number'
                          min='15'
                          max='180'
                          value={settings.training.schedule.duration}
                          onChange={e =>
                            updateNestedSetting(
                              'training',
                              'schedule',
                              'duration',
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='intensity'>Training Intensity</Label>
                      <Select
                        value={settings.training.intensity}
                        onValueChange={value =>
                          updateSetting('training', 'intensity', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='low'>
                            Low - Light training
                          </SelectItem>
                          <SelectItem value='medium'>
                            Medium - Moderate training
                          </SelectItem>
                          <SelectItem value='high'>
                            High - Intense training
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label>Training Focus Areas</Label>
                      <div className='flex flex-wrap gap-2'>
                        {[
                          'strength',
                          'endurance',
                          'speed',
                          'agility',
                          'flexibility',
                          'power',
                        ].map(focus => (
                          <Button
                            key={focus}
                            variant={
                              settings.training.focus.includes(focus)
                                ? 'default'
                                : 'outline'
                            }
                            size='sm'
                            onClick={() => {
                              const newFocus = settings.training.focus.includes(
                                focus
                              )
                                ? settings.training.focus.filter(
                                    f => f !== focus
                                  )
                                : [...settings.training.focus, focus];
                              updateSetting('training', 'focus', newFocus);
                            }}
                          >
                            {focus.charAt(0).toUpperCase() + focus.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accessibility Settings */}
          <TabsContent value='accessibility' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Eye className='h-5 w-5' />
                  Accessibility Options
                </CardTitle>
                <CardDescription>
                  Customize the app to meet your accessibility needs
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='fontSize'>
                      Font Size: {settings.accessibility.fontSize}px
                    </Label>
                    <Slider
                      id='fontSize'
                      min={12}
                      max={24}
                      step={1}
                      value={[settings.accessibility.fontSize]}
                      onValueChange={([value]) =>
                        updateSetting('accessibility', 'fontSize', value)
                      }
                      className='w-full'
                    />
                  </div>

                  <Separator />

                  {/* One-Handed Navigation Settings */}
                  <OneHandedSettings
                    isEnabled={settings.accessibility.oneHandedMode || false}
                    onToggle={enabled =>
                      updateSetting('accessibility', 'oneHandedMode', enabled)
                    }
                    currentHand={settings.accessibility.preferredHand || 'auto'}
                    onHandChange={hand =>
                      updateSetting('accessibility', 'preferredHand', hand)
                    }
                    showThumbZones={
                      settings.accessibility.showThumbZones || false
                    }
                    onToggleThumbZones={show =>
                      updateSetting('accessibility', 'showThumbZones', show)
                    }
                  />

                  <Separator />

                  <div className='space-y-4'>
                    {Object.entries(settings.accessibility)
                      .filter(
                        ([key]) =>
                          ![
                            'fontSize',
                            'oneHandedMode',
                            'preferredHand',
                            'showThumbZones',
                          ].includes(key)
                      )
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className='flex items-center justify-between'
                        >
                          <div className='space-y-1'>
                            <Label
                              htmlFor={key}
                              className='text-sm font-medium'
                            >
                              {key.charAt(0).toUpperCase() +
                                key.slice(1).replace(/([A-Z])/g, ' $1')}
                            </Label>
                            <p className='text-sm text-muted-foreground'>
                              {key === 'highContrast' &&
                                'Increase contrast for better visibility'}
                              {key === 'reducedMotion' &&
                                'Reduce animations and transitions'}
                              {key === 'audioFeedback' &&
                                'Provide audio feedback for actions'}
                              {key === 'voiceInstructions' &&
                                'Enable voice-guided instructions'}
                              {key === 'focusIndicators' &&
                                'Show focus indicators for keyboard navigation'}
                            </p>
                          </div>
                          {key === 'colorBlindMode' ? (
                            <Select
                              value={value as string}
                              onValueChange={newValue =>
                                updateSetting('accessibility', key, newValue)
                              }
                            >
                              <SelectTrigger className='w-32'>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='none'>None</SelectItem>
                                <SelectItem value='protanopia'>
                                  Protanopia
                                </SelectItem>
                                <SelectItem value='deuteranopia'>
                                  Deuteranopia
                                </SelectItem>
                                <SelectItem value='tritanopia'>
                                  Tritanopia
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Switch
                              id={key}
                              checked={value as boolean}
                              onCheckedChange={checked =>
                                updateSetting('accessibility', key, checked)
                              }
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value='privacy' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Privacy & Data
                </CardTitle>
                <CardDescription>
                  Control how your data is used and shared
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-4'>
                  {Object.entries(settings.privacy).map(([key, value]) => (
                    <div
                      key={key}
                      className='flex items-center justify-between'
                    >
                      <div className='space-y-1'>
                        <Label htmlFor={key} className='text-sm font-medium'>
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </Label>
                        <p className='text-sm text-muted-foreground'>
                          {key === 'dataSharing' &&
                            'Allow sharing of anonymized data for research'}
                          {key === 'analytics' &&
                            'Help improve the app by sharing usage analytics'}
                          {key === 'location' &&
                            'Use location data for weather-aware training'}
                          {key === 'social' &&
                            'Enable social features and sharing'}
                          {key === 'exportData' &&
                            'Allow exporting your personal data'}
                        </p>
                      </div>
                      <Switch
                        id={key}
                        checked={value as boolean}
                        onCheckedChange={checked =>
                          updateSetting('privacy', key, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
