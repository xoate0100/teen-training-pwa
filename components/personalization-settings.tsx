'use client';

import React, { useState, useEffect } from 'react';
import {
  usePersonalization,
  usePersonalizedStyles,
  usePersonalizedContent,
  usePersonalizedInteractions,
} from '@/components/personalization-provider';
import { cn } from '@/lib/utils';

interface PersonalizationSettingsProps {
  className?: string;
  showPreview?: boolean;
}

export function PersonalizationSettings({
  className,
  showPreview = true,
}: PersonalizationSettingsProps) {
  const {
    preferences,
    learning,
    updatePreferences,
    recordInteraction,
    getRecommendations,
    applyLearnedPreferences,
    resetPersonalization,
  } = usePersonalization();

  const personalizedStyles = usePersonalizedStyles();
  const personalizedContent = usePersonalizedContent();
  const personalizedInteractions = usePersonalizedInteractions();

  const [activeTab, setActiveTab] = useState<
    | 'visual'
    | 'interaction'
    | 'content'
    | 'accessibility'
    | 'learning'
    | 'social'
  >('visual');
  const [recommendations, setRecommendations] = useState<{
    theme: string[];
    interactions: string[];
    content: string[];
    learning: string[];
  }>({ theme: [], interactions: [], content: [], learning: [] });

  useEffect(() => {
    setRecommendations(getRecommendations());
  }, [getRecommendations, learning]);

  if (!preferences) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className='animate-pulse'>
          <div className='h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4'></div>
          <div className='h-4 bg-gray-200 rounded w-1/3 mx-auto'></div>
        </div>
      </div>
    );
  }

  const handlePreferenceChange = (
    category: keyof typeof preferences,
    updates: any
  ) => {
    updatePreferences(category, updates);

    // Record the interaction
    recordInteraction({
      type: 'setting_change',
      data: { category, updates },
      context: {
        page: 'personalization-settings',
        deviceType:
          window.innerWidth < 768
            ? 'mobile'
            : window.innerWidth < 1024
              ? 'tablet'
              : 'desktop',
        timeOfDay: getTimeOfDay(),
      },
    });
  };

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  const tabs = [
    { id: 'visual', label: 'Visual', icon: '🎨' },
    { id: 'interaction', label: 'Interaction', icon: '👆' },
    { id: 'content', label: 'Content', icon: '📄' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
    { id: 'learning', label: 'Learning', icon: '🧠' },
    { id: 'social', label: 'Social', icon: '👥' },
  ] as const;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold'>Personalization Settings</h2>
        <p className='text-gray-600'>
          Customize your experience based on your preferences and behavior
          patterns
        </p>
        {learning && (
          <div className='inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm'>
            <span className='w-2 h-2 bg-blue-500 rounded-full mr-2'></span>
            Learning Confidence: {Math.round(learning.confidence * 100)}%
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className='flex flex-wrap gap-2 justify-center'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <span className='mr-2'>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className='bg-white rounded-lg border p-6'>
        {activeTab === 'visual' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold'>Visual Preferences</h3>

            {/* Color Preferences */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Preferred Colors
              </label>
              <div className='flex flex-wrap gap-2'>
                {preferences.visualTheme.preferredColors.map((color, index) => (
                  <div
                    key={index}
                    className='w-8 h-8 rounded-full border-2 border-gray-300'
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Intensity Preference */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Visual Intensity
              </label>
              <div className='flex gap-4'>
                {(['subtle', 'moderate', 'bold'] as const).map(intensity => (
                  <label key={intensity} className='flex items-center'>
                    <input
                      type='radio'
                      name='intensity'
                      value={intensity}
                      checked={
                        preferences.visualTheme.preferredIntensity === intensity
                      }
                      onChange={e =>
                        handlePreferenceChange('visualTheme', {
                          preferredIntensity: e.target.value,
                        })
                      }
                      className='mr-2'
                    />
                    <span className='capitalize'>{intensity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Animation Preference */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Animation Level
              </label>
              <div className='flex gap-4'>
                {(['minimal', 'standard', 'extensive'] as const).map(
                  animation => (
                    <label key={animation} className='flex items-center'>
                      <input
                        type='radio'
                        name='animation'
                        value={animation}
                        checked={
                          preferences.visualTheme.preferredAnimation ===
                          animation
                        }
                        onChange={e =>
                          handlePreferenceChange('visualTheme', {
                            preferredAnimation: e.target.value,
                          })
                        }
                        className='mr-2'
                      />
                      <span className='capitalize'>{animation}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Layout Preference */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Layout Density
              </label>
              <div className='flex gap-4'>
                {(['compact', 'comfortable', 'spacious'] as const).map(
                  layout => (
                    <label key={layout} className='flex items-center'>
                      <input
                        type='radio'
                        name='layout'
                        value={layout}
                        checked={
                          preferences.visualTheme.preferredLayout === layout
                        }
                        onChange={e =>
                          handlePreferenceChange('visualTheme', {
                            preferredLayout: e.target.value,
                          })
                        }
                        className='mr-2'
                      />
                      <span className='capitalize'>{layout}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Dark Mode & High Contrast */}
            <div className='space-y-3'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={preferences.visualTheme.darkMode}
                  onChange={e =>
                    handlePreferenceChange('visualTheme', {
                      darkMode: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                Dark Mode
              </label>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={preferences.visualTheme.highContrast}
                  onChange={e =>
                    handlePreferenceChange('visualTheme', {
                      highContrast: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                High Contrast
              </label>
            </div>
          </div>
        )}

        {activeTab === 'interaction' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold'>Interaction Preferences</h3>

            {/* Feedback Level */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Feedback Level
              </label>
              <div className='flex gap-4'>
                {(['subtle', 'moderate', 'intensive'] as const).map(
                  feedback => (
                    <label key={feedback} className='flex items-center'>
                      <input
                        type='radio'
                        name='feedback'
                        value={feedback}
                        checked={
                          preferences.interactionStyle.preferredFeedback ===
                          feedback
                        }
                        onChange={e =>
                          handlePreferenceChange('interactionStyle', {
                            preferredFeedback: e.target.value,
                          })
                        }
                        className='mr-2'
                      />
                      <span className='capitalize'>{feedback}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Notification Frequency */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Notification Frequency
              </label>
              <div className='flex gap-4'>
                {(['minimal', 'standard', 'frequent'] as const).map(
                  notifications => (
                    <label key={notifications} className='flex items-center'>
                      <input
                        type='radio'
                        name='notifications'
                        value={notifications}
                        checked={
                          preferences.interactionStyle
                            .preferredNotifications === notifications
                        }
                        onChange={e =>
                          handlePreferenceChange('interactionStyle', {
                            preferredNotifications: e.target.value,
                          })
                        }
                        className='mr-2'
                      />
                      <span className='capitalize'>{notifications}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Interaction Features */}
            <div className='space-y-3'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={preferences.interactionStyle.preferredHaptics}
                  onChange={e =>
                    handlePreferenceChange('interactionStyle', {
                      preferredHaptics: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                Haptic Feedback
              </label>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={preferences.interactionStyle.preferredSounds}
                  onChange={e =>
                    handlePreferenceChange('interactionStyle', {
                      preferredSounds: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                Sound Effects
              </label>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={
                    preferences.interactionStyle.preferredMicroInteractions
                  }
                  onChange={e =>
                    handlePreferenceChange('interactionStyle', {
                      preferredMicroInteractions: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                Micro-interactions
              </label>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold'>Content Preferences</h3>

            {/* Information Level */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Information Level
              </label>
              <div className='flex gap-4'>
                {(['basic', 'detailed', 'comprehensive'] as const).map(
                  level => (
                    <label key={level} className='flex items-center'>
                      <input
                        type='radio'
                        name='informationLevel'
                        value={level}
                        checked={
                          preferences.contentDensity
                            .preferredInformationLevel === level
                        }
                        onChange={e =>
                          handlePreferenceChange('contentDensity', {
                            preferredInformationLevel: e.target.value,
                          })
                        }
                        className='mr-2'
                      />
                      <span className='capitalize'>{level}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Progress Display */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Progress Display
              </label>
              <div className='flex gap-4'>
                {(['simple', 'detailed', 'analytical'] as const).map(
                  display => (
                    <label key={display} className='flex items-center'>
                      <input
                        type='radio'
                        name='progressDisplay'
                        value={display}
                        checked={
                          preferences.contentDensity
                            .preferredProgressDisplay === display
                        }
                        onChange={e =>
                          handlePreferenceChange('contentDensity', {
                            preferredProgressDisplay: e.target.value,
                          })
                        }
                        className='mr-2'
                      />
                      <span className='capitalize'>{display}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Achievement Style */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Achievement Style
              </label>
              <div className='flex gap-4'>
                {(['minimal', 'celebratory', 'gamified'] as const).map(
                  style => (
                    <label key={style} className='flex items-center'>
                      <input
                        type='radio'
                        name='achievementStyle'
                        value={style}
                        checked={
                          preferences.contentDensity
                            .preferredAchievementStyle === style
                        }
                        onChange={e =>
                          handlePreferenceChange('contentDensity', {
                            preferredAchievementStyle: e.target.value,
                          })
                        }
                        className='mr-2'
                      />
                      <span className='capitalize'>{style}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Help Level */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Help Level
              </label>
              <div className='flex gap-4'>
                {(['minimal', 'contextual', 'comprehensive'] as const).map(
                  help => (
                    <label key={help} className='flex items-center'>
                      <input
                        type='radio'
                        name='helpLevel'
                        value={help}
                        checked={
                          preferences.contentDensity.preferredHelpLevel === help
                        }
                        onChange={e =>
                          handlePreferenceChange('contentDensity', {
                            preferredHelpLevel: e.target.value,
                          })
                        }
                        className='mr-2'
                      />
                      <span className='capitalize'>{help}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold'>Accessibility Settings</h3>

            {/* Font Size */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Font Size
              </label>
              <div className='flex gap-4'>
                {(['small', 'medium', 'large', 'extra-large'] as const).map(
                  size => (
                    <label key={size} className='flex items-center'>
                      <input
                        type='radio'
                        name='fontSize'
                        value={size}
                        checked={preferences.accessibility.fontSize === size}
                        onChange={e =>
                          handlePreferenceChange('accessibility', {
                            fontSize: e.target.value,
                          })
                        }
                        className='mr-2'
                      />
                      <span className='capitalize'>
                        {size.replace('-', ' ')}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Accessibility Features */}
            <div className='space-y-3'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={preferences.accessibility.reducedMotion}
                  onChange={e =>
                    handlePreferenceChange('accessibility', {
                      reducedMotion: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                Reduced Motion
              </label>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={preferences.accessibility.screenReader}
                  onChange={e =>
                    handlePreferenceChange('accessibility', {
                      screenReader: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                Screen Reader Support
              </label>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={preferences.accessibility.keyboardNavigation}
                  onChange={e =>
                    handlePreferenceChange('accessibility', {
                      keyboardNavigation: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                Enhanced Keyboard Navigation
              </label>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={preferences.accessibility.colorBlindSupport}
                  onChange={e =>
                    handlePreferenceChange('accessibility', {
                      colorBlindSupport: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                Color Blind Support
              </label>
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold'>Learning Preferences</h3>

            {/* Session Length */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Preferred Session Length:{' '}
                {preferences.learningPatterns.preferredSessionLength} minutes
              </label>
              <input
                type='range'
                min='15'
                max='120'
                step='15'
                value={preferences.learningPatterns.preferredSessionLength}
                onChange={e =>
                  handlePreferenceChange('learningPatterns', {
                    preferredSessionLength: parseInt(e.target.value),
                  })
                }
                className='w-full'
              />
              <div className='flex justify-between text-xs text-gray-500 mt-1'>
                <span>15 min</span>
                <span>120 min</span>
              </div>
            </div>

            {/* Difficulty Progression */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Difficulty Progression
              </label>
              <div className='flex gap-4'>
                {(['gradual', 'moderate', 'aggressive'] as const).map(
                  progression => (
                    <label key={progression} className='flex items-center'>
                      <input
                        type='radio'
                        name='progression'
                        value={progression}
                        checked={
                          preferences.learningPatterns
                            .preferredDifficultyProgression === progression
                        }
                        onChange={e =>
                          handlePreferenceChange('learningPatterns', {
                            preferredDifficultyProgression: e.target.value,
                          })
                        }
                        className='mr-2'
                      />
                      <span className='capitalize'>{progression}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Motivation Style */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Motivation Style
              </label>
              <div className='flex gap-4'>
                {(['encouraging', 'challenging', 'supportive'] as const).map(
                  style => (
                    <label key={style} className='flex items-center'>
                      <input
                        type='radio'
                        name='motivation'
                        value={style}
                        checked={
                          preferences.learningPatterns
                            .preferredMotivationStyle === style
                        }
                        onChange={e =>
                          handlePreferenceChange('learningPatterns', {
                            preferredMotivationStyle: e.target.value,
                          })
                        }
                        className='mr-2'
                      />
                      <span className='capitalize'>{style}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Goal Setting */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Goal Setting Preference
              </label>
              <div className='flex gap-4'>
                {(['short-term', 'long-term', 'mixed'] as const).map(goal => (
                  <label key={goal} className='flex items-center'>
                    <input
                      type='radio'
                      name='goals'
                      value={goal}
                      checked={
                        preferences.learningPatterns.preferredGoalSetting ===
                        goal
                      }
                      onChange={e =>
                        handlePreferenceChange('learningPatterns', {
                          preferredGoalSetting: e.target.value,
                        })
                      }
                      className='mr-2'
                    />
                    <span className='capitalize'>{goal.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold'>Social Preferences</h3>

            {/* Privacy Level */}
            <div>
              <label className='block text-sm font-medium mb-3'>
                Privacy Level
              </label>
              <div className='flex gap-4'>
                {(['private', 'friends', 'public'] as const).map(privacy => (
                  <label key={privacy} className='flex items-center'>
                    <input
                      type='radio'
                      name='privacy'
                      value={privacy}
                      checked={
                        preferences.socialPreferences.preferredPrivacyLevel ===
                        privacy
                      }
                      onChange={e =>
                        handlePreferenceChange('socialPreferences', {
                          preferredPrivacyLevel: e.target.value,
                        })
                      }
                      className='mr-2'
                    />
                    <span className='capitalize'>{privacy}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Social Features */}
            <div className='space-y-3'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={preferences.socialPreferences.shareAchievements}
                  onChange={e =>
                    handlePreferenceChange('socialPreferences', {
                      shareAchievements: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                Share Achievements
              </label>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={preferences.socialPreferences.shareProgress}
                  onChange={e =>
                    handlePreferenceChange('socialPreferences', {
                      shareProgress: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                Share Progress
              </label>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={
                    preferences.socialPreferences.participateInChallenges
                  }
                  onChange={e =>
                    handlePreferenceChange('socialPreferences', {
                      participateInChallenges: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                Participate in Challenges
              </label>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={
                    preferences.socialPreferences.receiveSocialNotifications
                  }
                  onChange={e =>
                    handlePreferenceChange('socialPreferences', {
                      receiveSocialNotifications: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                Receive Social Notifications
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {(recommendations.theme.length > 0 ||
        recommendations.interactions.length > 0 ||
        recommendations.content.length > 0 ||
        recommendations.learning.length > 0) && (
        <div className='bg-blue-50 rounded-lg p-4'>
          <h3 className='text-lg font-semibold mb-3'>
            Personalized Recommendations
          </h3>
          <div className='space-y-2'>
            {recommendations.theme.map((rec, index) => (
              <div key={index} className='text-sm text-blue-800'>
                🎨 {rec}
              </div>
            ))}
            {recommendations.interactions.map((rec, index) => (
              <div key={index} className='text-sm text-blue-800'>
                👆 {rec}
              </div>
            ))}
            {recommendations.content.map((rec, index) => (
              <div key={index} className='text-sm text-blue-800'>
                📄 {rec}
              </div>
            ))}
            {recommendations.learning.map((rec, index) => (
              <div key={index} className='text-sm text-blue-800'>
                🧠 {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className='flex gap-4 justify-center'>
        <button
          onClick={applyLearnedPreferences}
          className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
        >
          Apply Learned Preferences
        </button>
        <button
          onClick={resetPersonalization}
          className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
        >
          Reset All Settings
        </button>
      </div>
    </div>
  );
}
