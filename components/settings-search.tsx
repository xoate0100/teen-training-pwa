'use client';

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  Filter,
  X,
  Clock,
  Star,
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Activity,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsSearchProps {
  onSearch: (query: string) => void;
  onFilter: (category: string) => void;
  onClear: () => void;
  searchQuery: string;
  activeCategory: string;
  className?: string;
}

interface SettingItem {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  recentlyUsed?: boolean;
  recommended?: boolean;
}

const settingsCategories = [
  { id: 'all', label: 'All Settings', icon: SettingsIcon, count: 0 },
  { id: 'profile', label: 'Profile & Goals', icon: User, count: 0 },
  { id: 'preferences', label: 'Preferences', icon: Palette, count: 0 },
  { id: 'theming', label: 'Theming', icon: Palette, count: 0 },
  { id: 'notifications', label: 'Notifications', icon: Bell, count: 0 },
  { id: 'training', label: 'Training', icon: Activity, count: 0 },
  { id: 'accessibility', label: 'Accessibility', icon: Eye, count: 0 },
  { id: 'privacy', label: 'Privacy & Data', icon: Shield, count: 0 },
];

const sampleSettings: SettingItem[] = [
  {
    id: 'name',
    title: 'Name',
    description: 'Your display name',
    category: 'profile',
    keywords: ['name', 'display', 'identity', 'profile'],
    recentlyUsed: true,
  },
  {
    id: 'theme',
    title: 'Theme',
    description: 'App appearance theme',
    category: 'preferences',
    keywords: ['theme', 'appearance', 'dark', 'light', 'color'],
    recommended: true,
  },
  {
    id: 'notifications',
    title: 'Push Notifications',
    description: 'Receive notifications on your device',
    category: 'notifications',
    keywords: ['notifications', 'push', 'alerts', 'reminders'],
    recentlyUsed: true,
  },
  {
    id: 'equipment',
    title: 'Available Equipment',
    description: 'Equipment you have access to',
    category: 'training',
    keywords: ['equipment', 'gear', 'tools', 'workout'],
  },
  {
    id: 'fontSize',
    title: 'Font Size',
    description: 'Text size for better readability',
    category: 'accessibility',
    keywords: ['font', 'size', 'text', 'readability', 'accessibility'],
  },
  {
    id: 'dataSharing',
    title: 'Data Sharing',
    description: 'Control how your data is shared',
    category: 'privacy',
    keywords: ['data', 'sharing', 'privacy', 'analytics'],
  },
  {
    id: 'sessionThemes',
    title: 'Session Themes',
    description: 'Customize themes for different session types',
    category: 'theming',
    keywords: ['session', 'themes', 'customization', 'appearance'],
    recommended: true,
  },
  {
    id: 'moodThemes',
    title: 'Mood Themes',
    description: 'Themes that adapt to your current mood',
    category: 'theming',
    keywords: ['mood', 'themes', 'adaptive', 'emotion'],
  },
  {
    id: 'personalization',
    title: 'Personalization',
    description: 'AI-powered personalization settings',
    category: 'theming',
    keywords: ['personalization', 'ai', 'adaptive', 'learning'],
  },
];

export function SettingsSearch({
  onSearch,
  onFilter,
  onClear,
  searchQuery,
  activeCategory,
  className,
}: SettingsSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const filteredSettings = useMemo(() => {
    let filtered = sampleSettings;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(setting => setting.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        setting =>
          setting.title.toLowerCase().includes(query) ||
          setting.description.toLowerCase().includes(query) ||
          setting.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [activeCategory, searchQuery]);

  const handleSearch = (query: string) => {
    onSearch(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const handleClear = () => {
    onClear();
    setShowFilters(false);
  };

  const handleRecentSearch = (query: string) => {
    onSearch(query);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search settings...'
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className='pl-10 pr-20'
        />
        <div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setShowFilters(!showFilters)}
            className='h-6 px-2'
          >
            <Filter className='h-3 w-3' />
          </Button>
          {searchQuery && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleClear}
              className='h-6 px-2'
            >
              <X className='h-3 w-3' />
            </Button>
          )}
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && !searchQuery && (
        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Clock className='h-3 w-3' />
            Recent searches
          </div>
          <div className='flex flex-wrap gap-1'>
            {recentSearches.map((search, index) => (
              <Button
                key={index}
                variant='outline'
                size='sm'
                onClick={() => handleRecentSearch(search)}
                className='h-6 text-xs'
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Category Filters */}
      {showFilters && (
        <Card>
          <CardContent className='p-4'>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-medium'>Filter by Category</h3>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowFilters(false)}
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                {settingsCategories.map(category => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => onFilter(category.id)}
                      className='justify-start h-8'
                    >
                      <Icon className='h-3 w-3 mr-2' />
                      {category.label}
                      {category.count > 0 && (
                        <Badge variant='secondary' className='ml-1 h-4 text-xs'>
                          {category.count}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-muted-foreground'>
              {filteredSettings.length} setting{filteredSettings.length !== 1 ? 's' : ''} found
            </div>
            <Button variant='ghost' size='sm' onClick={handleClear}>
              Clear search
            </Button>
          </div>
          <div className='space-y-1'>
            {filteredSettings.map(setting => (
              <Card
                key={setting.id}
                className='p-3 cursor-pointer hover:bg-muted/50 transition-colors'
                onClick={() => {
                  // Scroll to setting in main content
                  const element = document.getElementById(setting.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
              >
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <h4 className='text-sm font-medium'>{setting.title}</h4>
                      {setting.recentlyUsed && (
                        <Badge variant='outline' className='h-4 text-xs'>
                          <Clock className='h-2 w-2 mr-1' />
                          Recent
                        </Badge>
                      )}
                      {setting.recommended && (
                        <Badge variant='default' className='h-4 text-xs'>
                          <Star className='h-2 w-2 mr-1' />
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      {setting.description}
                    </p>
                  </div>
                  <Badge variant='secondary' className='text-xs'>
                    {settingsCategories.find(c => c.id === setting.category)?.label}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
