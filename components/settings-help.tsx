'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  HelpCircle,
  Search,
  BookOpen,
  Lightbulb,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsHelpProps {
  className?: string;
}

interface HelpItem {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relatedSettings: string[];
}

const helpItems: HelpItem[] = [
  {
    id: 'theme-setup',
    title: 'How to change your theme',
    description: 'Learn how to customize the app appearance',
    category: 'appearance',
    content: 'To change your theme, go to Settings > Preferences > Theme. You can choose between Light, Dark, or Auto (follows system). The Auto option will automatically switch between light and dark based on your device settings.',
    tags: ['theme', 'appearance', 'dark mode', 'light mode'],
    difficulty: 'beginner',
    relatedSettings: ['theme', 'highContrast'],
  },
  {
    id: 'notifications-setup',
    title: 'Setting up notifications',
    description: 'Configure how you receive training reminders',
    category: 'notifications',
    content: 'Navigate to Settings > Notifications to configure your notification preferences. You can enable/disable push notifications, email notifications, achievement alerts, and training reminders. Each type can be customized independently.',
    tags: ['notifications', 'alerts', 'reminders', 'push'],
    difficulty: 'beginner',
    relatedSettings: ['push', 'email', 'achievements', 'reminders'],
  },
  {
    id: 'accessibility-features',
    title: 'Accessibility features',
    description: 'Make the app more accessible for your needs',
    category: 'accessibility',
    content: 'The app includes several accessibility features: Font size adjustment, high contrast mode, reduced motion, audio feedback, voice instructions, and color blind support. These can be found in Settings > Accessibility.',
    tags: ['accessibility', 'font size', 'contrast', 'motion'],
    difficulty: 'intermediate',
    relatedSettings: ['fontSize', 'highContrast', 'reducedMotion', 'colorBlindMode'],
  },
  {
    id: 'training-schedule',
    title: 'Setting up your training schedule',
    description: 'Configure when and how often you want to train',
    category: 'training',
    content: 'Go to Settings > Training to set up your training schedule. You can select training days, preferred time, session duration, intensity level, and focus areas. The app will use this information to suggest optimal workout times.',
    tags: ['schedule', 'training', 'workout', 'planning'],
    difficulty: 'intermediate',
    relatedSettings: ['schedule', 'intensity', 'focus', 'equipment'],
  },
  {
    id: 'privacy-settings',
    title: 'Privacy and data control',
    description: 'Control how your data is used and shared',
    category: 'privacy',
    content: 'In Settings > Privacy & Data, you can control data sharing, analytics, location services, and social features. You can also export your data or delete your account. All settings are clearly explained with their implications.',
    tags: ['privacy', 'data', 'sharing', 'export'],
    difficulty: 'intermediate',
    relatedSettings: ['dataSharing', 'analytics', 'location', 'social'],
  },
  {
    id: 'one-handed-mode',
    title: 'One-handed navigation mode',
    description: 'Optimize the app for one-handed use',
    category: 'accessibility',
    content: 'One-handed mode repositions UI elements within thumb reach zones and enables swipe gestures for navigation. Enable it in Settings > Accessibility > One-Handed Navigation. You can also choose your preferred hand and show thumb zone indicators.',
    tags: ['one-handed', 'mobile', 'gestures', 'accessibility'],
    difficulty: 'advanced',
    relatedSettings: ['oneHandedMode', 'preferredHand', 'showThumbZones'],
  },
];

const categories = [
  { id: 'all', label: 'All Topics', count: helpItems.length },
  { id: 'appearance', label: 'Appearance', count: helpItems.filter(item => item.category === 'appearance').length },
  { id: 'notifications', label: 'Notifications', count: helpItems.filter(item => item.category === 'notifications').length },
  { id: 'accessibility', label: 'Accessibility', count: helpItems.filter(item => item.category === 'accessibility').length },
  { id: 'training', label: 'Training', count: helpItems.filter(item => item.category === 'training').length },
  { id: 'privacy', label: 'Privacy', count: helpItems.filter(item => item.category === 'privacy').length },
];

export function SettingsHelp({ className }: SettingsHelpProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<HelpItem | null>(null);

  const filteredItems = helpItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <CheckCircle className='h-3 w-3' />;
      case 'intermediate':
        return <Info className='h-3 w-3' />;
      case 'advanced':
        return <AlertCircle className='h-3 w-3' />;
      default:
        return <HelpCircle className='h-3 w-3' />;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Help Header */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <HelpCircle className='h-5 w-5' />
            Settings Help & Guidance
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Search */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search help topics...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>

          {/* Categories */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className='grid w-full grid-cols-3 md:grid-cols-6'>
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className='text-xs'>
                  {category.label}
                  {category.count > 0 && (
                    <Badge variant='secondary' className='ml-1 h-4 text-xs'>
                      {category.count}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory} className='space-y-3 mt-4'>
              {filteredItems.map(item => (
                <Card
                  key={item.id}
                  className='cursor-pointer hover:bg-muted/50 transition-colors'
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className='p-4'>
                    <div className='flex items-start justify-between'>
                      <div className='space-y-2 flex-1'>
                        <div className='flex items-center gap-2'>
                          <h3 className='font-medium'>{item.title}</h3>
                          <Badge
                            variant='outline'
                            className={cn('text-xs', getDifficultyColor(item.difficulty))}
                          >
                            {getDifficultyIcon(item.difficulty)}
                            <span className='ml-1'>{item.difficulty}</span>
                          </Badge>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          {item.description}
                        </p>
                        <div className='flex flex-wrap gap-1'>
                          {item.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant='secondary' className='text-xs'>
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant='secondary' className='text-xs'>
                              +{item.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className='h-4 w-4 text-muted-foreground' />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Help Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <HelpCircle className='h-5 w-5' />
              {selectedItem?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.description}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            {selectedItem && (
              <>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant='outline'
                    className={cn('text-xs', getDifficultyColor(selectedItem.difficulty))}
                  >
                    {getDifficultyIcon(selectedItem.difficulty)}
                    <span className='ml-1'>{selectedItem.difficulty}</span>
                  </Badge>
                  <span className='text-sm text-muted-foreground'>
                    {selectedItem.category}
                  </span>
                </div>
                
                <div className='prose prose-sm max-w-none'>
                  <p>{selectedItem.content}</p>
                </div>

                <div className='space-y-2'>
                  <h4 className='text-sm font-medium'>Related Settings</h4>
                  <div className='flex flex-wrap gap-1'>
                    {selectedItem.relatedSettings.map(setting => (
                      <Badge key={setting} variant='outline' className='text-xs'>
                        {setting}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className='space-y-2'>
                  <h4 className='text-sm font-medium'>Tags</h4>
                  <div className='flex flex-wrap gap-1'>
                    {selectedItem.tags.map(tag => (
                      <Badge key={tag} variant='secondary' className='text-xs'>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className='flex gap-2 pt-4'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      // Scroll to related setting
                      const element = document.getElementById(selectedItem.relatedSettings[0]);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setSelectedItem(null);
                      }
                    }}
                  >
                    <ExternalLink className='h-3 w-3 mr-1' />
                    Go to Setting
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setSelectedItem(null)}
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
