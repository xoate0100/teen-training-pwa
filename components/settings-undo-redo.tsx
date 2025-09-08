'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Undo2,
  Redo2,
  History,
  RotateCcw,
  Save,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsState {
  id: string;
  timestamp: number;
  settings: Record<string, any>;
  description: string;
}

interface SettingsUndoRedoProps {
  currentSettings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
  onSave?: () => void;
  maxHistorySize?: number;
  className?: string;
}

export function SettingsUndoRedo({
  currentSettings,
  onSettingsChange,
  onSave,
  maxHistorySize = 50,
  className,
}: SettingsUndoRedoProps) {
  const [history, setHistory] = useState<SettingsState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedState, setLastSavedState] = useState<SettingsState | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with current settings
  React.useEffect(() => {
    if (history.length === 0) {
      const initialState: SettingsState = {
        id: `state_${Date.now()}`,
        timestamp: Date.now(),
        settings: JSON.parse(JSON.stringify(currentSettings)),
        description: 'Initial state',
      };
      setHistory([initialState]);
      setCurrentIndex(0);
      setLastSavedState(initialState);
    }
  }, [currentSettings, history.length]);

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (isDirty && onSave) {
        onSave();
        setIsDirty(false);
        setLastSavedState(history[currentIndex]);
      }
    }, 2000); // Auto-save after 2 seconds of inactivity
  }, [isDirty, onSave, history, currentIndex]);

  // Add new state to history
  const addToHistory = useCallback((settings: Record<string, any>, description: string) => {
    const newState: SettingsState = {
      id: `state_${Date.now()}`,
      timestamp: Date.now(),
      settings: JSON.parse(JSON.stringify(settings)),
      description,
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    
    setCurrentIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
    setIsDirty(true);
    autoSave();
  }, [currentIndex, maxHistorySize, autoSave]);

  // Undo functionality
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const stateToRestore = history[newIndex];
      setCurrentIndex(newIndex);
      onSettingsChange(stateToRestore.settings);
      setIsDirty(true);
    }
  }, [currentIndex, history, onSettingsChange]);

  // Redo functionality
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      const stateToRestore = history[newIndex];
      setCurrentIndex(newIndex);
      onSettingsChange(stateToRestore.settings);
      setIsDirty(true);
    }
  }, [currentIndex, history, onSettingsChange]);

  // Reset to last saved state
  const resetToLastSaved = useCallback(() => {
    if (lastSavedState) {
      onSettingsChange(lastSavedState.settings);
      setIsDirty(false);
    }
  }, [lastSavedState, onSettingsChange]);

  // Manual save
  const save = useCallback(() => {
    if (onSave) {
      onSave();
      setIsDirty(false);
      setLastSavedState(history[currentIndex]);
    }
  }, [onSave, history, currentIndex]);

  // Check if current state is different from last saved
  const hasUnsavedChanges = isDirty && lastSavedState && 
    JSON.stringify(currentSettings) !== JSON.stringify(lastSavedState.settings);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return (
    <Card className={cn('space-y-4', className)}>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg flex items-center gap-2'>
          <History className='h-5 w-5' />
          Settings History
        </CardTitle>
      </CardHeader>
      
      <CardContent className='space-y-4'>
        {/* Action Buttons */}
        <div className='flex items-center gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={undo}
                  disabled={!canUndo}
                  className='flex items-center gap-2'
                >
                  <Undo2 className='h-4 w-4' />
                  Undo
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo last change</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={redo}
                  disabled={!canRedo}
                  className='flex items-center gap-2'
                >
                  <Redo2 className='h-4 w-4' />
                  Redo
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo last undone change</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={resetToLastSaved}
                  disabled={!hasUnsavedChanges}
                  className='flex items-center gap-2'
                >
                  <RotateCcw className='h-4 w-4' />
                  Reset
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset to last saved state</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className='flex-1' />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size='sm'
                  onClick={save}
                  disabled={!hasUnsavedChanges}
                  className='flex items-center gap-2'
                >
                  <Save className='h-4 w-4' />
                  Save
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save current changes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Status Indicators */}
        <div className='flex items-center gap-4'>
          {hasUnsavedChanges ? (
            <div className='flex items-center gap-2 text-amber-600'>
              <AlertCircle className='h-4 w-4' />
              <span className='text-sm font-medium'>Unsaved changes</span>
            </div>
          ) : (
            <div className='flex items-center gap-2 text-green-600'>
              <CheckCircle className='h-4 w-4' />
              <span className='text-sm font-medium'>All changes saved</span>
            </div>
          )}

          <Badge variant='outline' className='text-xs'>
            {currentIndex + 1} of {history.length} states
          </Badge>
        </div>

        {/* History Timeline */}
        {history.length > 1 && (
          <div className='space-y-2'>
            <h4 className='text-sm font-medium text-muted-foreground'>Recent Changes</h4>
            <div className='space-y-1 max-h-32 overflow-y-auto'>
              {history.slice(-5).reverse().map((state, index) => {
                const actualIndex = history.length - 1 - index;
                const isCurrent = actualIndex === currentIndex;
                const isLastSaved = lastSavedState?.id === state.id;
                
                return (
                  <div
                    key={state.id}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded text-xs cursor-pointer transition-colors',
                      isCurrent 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50',
                      isLastSaved && 'bg-green-50 border border-green-200'
                    )}
                    onClick={() => {
                      setCurrentIndex(actualIndex);
                      onSettingsChange(state.settings);
                      setIsDirty(true);
                    }}
                  >
                    <div className='w-2 h-2 rounded-full bg-muted-foreground' />
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium truncate'>{state.description}</div>
                      <div className='text-muted-foreground'>
                        {new Date(state.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    {isLastSaved && (
                      <CheckCircle className='h-3 w-3 text-green-600' />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Hook for managing settings history
export function useSettingsHistory(
  initialSettings: Record<string, any>,
  onSettingsChange: (settings: Record<string, any>) => void,
  maxHistorySize: number = 50
) {
  const [history, setHistory] = useState<SettingsState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addToHistory = useCallback((settings: Record<string, any>, description: string) => {
    const newState: SettingsState = {
      id: `state_${Date.now()}`,
      timestamp: Date.now(),
      settings: JSON.parse(JSON.stringify(settings)),
      description,
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newState);
      
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    
    setCurrentIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
  }, [currentIndex, maxHistorySize]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const stateToRestore = history[newIndex];
      setCurrentIndex(newIndex);
      onSettingsChange(stateToRestore.settings);
    }
  }, [currentIndex, history, onSettingsChange]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      const stateToRestore = history[newIndex];
      setCurrentIndex(newIndex);
      onSettingsChange(stateToRestore.settings);
    }
  }, [currentIndex, history, onSettingsChange]);

  return {
    history,
    currentIndex,
    addToHistory,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
}
