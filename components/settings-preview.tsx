'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Eye,
  Undo2,
  Check,
  AlertCircle,
  Palette,
  Bell,
  Activity,
  User,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsPreviewProps {
  settings: any;
  onSettingChange: (category: string, key: string, value: any) => void;
  onReset: () => void;
  className?: string;
}

export function SettingsPreview({
  settings,
  onSettingChange,
  onReset,
  className,
}: SettingsPreviewProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState(settings);

  useEffect(() => {
    setOriginalSettings(settings);
  }, [settings]);

  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(hasChanges);
  }, [settings, originalSettings]);

  const handleSettingChange = (category: string, key: string, value: any) => {
    onSettingChange(category, key, value);
  };

  const handleReset = () => {
    onReset();
    setHasChanges(false);
  };

  const handleSave = () => {
    // Save settings logic would go here
    setHasChanges(false);
    setOriginalSettings(settings);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Preview Controls */}
      <Card>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Eye className='h-5 w-5' />
              Live Preview
            </CardTitle>
            <div className='flex items-center gap-2'>
              <Switch
                checked={previewMode}
                onCheckedChange={setPreviewMode}
                className='data-[state=checked]:bg-primary'
              />
              <span className='text-sm text-muted-foreground'>Preview Mode</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Change Indicator */}
          {hasChanges && (
            <div className='flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
              <AlertCircle className='h-4 w-4 text-yellow-600' />
              <span className='text-sm text-yellow-800'>You have unsaved changes</span>
              <div className='ml-auto flex gap-2'>
                <Button variant='outline' size='sm' onClick={handleReset}>
                  <Undo2 className='h-3 w-3 mr-1' />
                  Reset
                </Button>
                <Button size='sm' onClick={handleSave}>
                  <Check className='h-3 w-3 mr-1' />
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Preview Toggles */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Theme</label>
              <Select
                value={settings.preferences?.theme || 'auto'}
                onValueChange={value => handleSettingChange('preferences', 'theme', value)}
              >
                <SelectTrigger className='h-8'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='light'>Light</SelectItem>
                  <SelectItem value='dark'>Dark</SelectItem>
                  <SelectItem value='auto'>Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Font Size</label>
              <div className='space-y-1'>
                <Slider
                  value={[settings.accessibility?.fontSize || 16]}
                  onValueChange={([value]) => handleSettingChange('accessibility', 'fontSize', value)}
                  min={12}
                  max={24}
                  step={1}
                  className='w-full'
                />
                <div className='text-xs text-muted-foreground text-center'>
                  {settings.accessibility?.fontSize || 16}px
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Notifications</label>
              <div className='flex items-center space-x-2'>
                <Switch
                  checked={settings.notifications?.push || false}
                  onCheckedChange={checked => handleSettingChange('notifications', 'push', checked)}
                />
                <span className='text-xs text-muted-foreground'>
                  {settings.notifications?.push ? 'On' : 'Off'}
                </span>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>High Contrast</label>
              <div className='flex items-center space-x-2'>
                <Switch
                  checked={settings.accessibility?.highContrast || false}
                  onCheckedChange={checked => handleSettingChange('accessibility', 'highContrast', checked)}
                />
                <span className='text-xs text-muted-foreground'>
                  {settings.accessibility?.highContrast ? 'On' : 'Off'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Content */}
      {previewMode && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Preview</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Theme Preview */}
            <div className='space-y-2'>
              <h4 className='text-sm font-medium'>Theme Preview</h4>
              <div className='p-4 border rounded-lg bg-background'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold'>
                    U
                  </div>
                  <div>
                    <div className='font-medium'>User Name</div>
                    <div className='text-sm text-muted-foreground'>Online</div>
                  </div>
                </div>
                <div className='space-y-2'>
                  <Button size='sm' className='w-full'>
                    Start Session
                  </Button>
                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm' className='flex-1'>
                      Progress
                    </Button>
                    <Button variant='outline' size='sm' className='flex-1'>
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Preview */}
            <div className='space-y-2'>
              <h4 className='text-sm font-medium'>Typography Preview</h4>
              <div className='p-4 border rounded-lg'>
                <h1 className='text-2xl font-bold mb-2'>Heading 1</h1>
                <h2 className='text-xl font-semibold mb-2'>Heading 2</h2>
                <h3 className='text-lg font-medium mb-2'>Heading 3</h3>
                <p className='text-base mb-2'>
                  This is a paragraph with regular text. It should be readable and comfortable to read.
                </p>
                <p className='text-sm text-muted-foreground'>
                  This is smaller text for captions and secondary information.
                </p>
              </div>
            </div>

            {/* Component Preview */}
            <div className='space-y-2'>
              <h4 className='text-sm font-medium'>Component Preview</h4>
              <div className='p-4 border rounded-lg space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Push Notifications</span>
                  <Switch
                    checked={settings.notifications?.push || false}
                    onCheckedChange={checked => handleSettingChange('notifications', 'push', checked)}
                  />
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Email Notifications</span>
                  <Switch
                    checked={settings.notifications?.email || false}
                    onCheckedChange={checked => handleSettingChange('notifications', 'email', checked)}
                  />
                </div>
                <Separator />
                <div className='space-y-2'>
                  <label className='text-sm'>Training Intensity</label>
                  <Select
                    value={settings.training?.intensity || 'medium'}
                    onValueChange={value => handleSettingChange('training', 'intensity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='low'>Low</SelectItem>
                      <SelectItem value='medium'>Medium</SelectItem>
                      <SelectItem value='high'>High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
