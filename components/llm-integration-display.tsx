'use client';

import { useState, useEffect } from 'react';
import { useLLMIntegration } from '@/lib/hooks/use-llm-integration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageCircle,
  Brain,
  Target,
  Lightbulb,
  Trophy,
  RefreshCw,
  Send,
  AlertTriangle,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface LLMIntegrationDisplayProps {
  sessions: any[];
  checkIns: any[];
  progressMetrics: any[];
  behaviorInsights: any;
  performanceForecast: any;
  userId?: string;
  currentPhase?: string;
}

export function LLMIntegrationDisplay({
  sessions = [],
  checkIns = [],
  progressMetrics = [],
  behaviorInsights = null,
  performanceForecast = null,
  userId = 'default-user',
  currentPhase = 'build',
}: LLMIntegrationDisplayProps) {
  const {
    conversationHistory,
    isGenerating,
    activeCoachingSession,
    realTimeFeedback,
    motivationalMessages,
    adaptiveContent,
    personalizedWorkout,
    contextualTips,
    progressCelebrations,
    isLoading,
    error,
    lastUpdated,
    sendMessage,
    generateFormFeedback,
    generateMotivationalMessage,
    generateContextualTips,
    refreshAll,
    clearError,
  } = useLLMIntegration(
    sessions,
    checkIns,
    progressMetrics,
    behaviorInsights,
    performanceForecast,
    userId,
    currentPhase
  );

  const [activeTab, setActiveTab] = useState('chat');
  const [messageInput, setMessageInput] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');

  // Auto-generate content on mount
  useEffect(() => {
    if (sessions.length > 0) {
      generateContextualTips(
        {
          userId,
          currentPhase,
          recentSessions: sessions.slice(0, 5),
          recentCheckIns: checkIns.slice(0, 3),
          behaviorInsights,
          performanceForecast,
          conversationHistory: [],
          userPreferences: {
            communicationStyle: 'encouraging',
            detailLevel: 'moderate',
            focusAreas: ['form', 'safety', 'progress'],
          },
        },
        currentPhase,
        'strength'
      );
    }
  }, [
    sessions.length,
    generateContextualTips,
    userId,
    currentPhase,
    sessions,
    checkIns,
    behaviorInsights,
    performanceForecast,
  ]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const context = {
      userId,
      currentPhase,
      recentSessions: sessions.slice(0, 5),
      recentCheckIns: checkIns.slice(0, 3),
      behaviorInsights,
      performanceForecast,
      conversationHistory,
      userPreferences: {
        communicationStyle: 'encouraging',
        detailLevel: 'moderate',
        focusAreas: ['form', 'safety', 'progress'],
      },
    };

    try {
      await sendMessage(messageInput, context);
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleGenerateFormFeedback = async () => {
    if (!selectedExercise) return;

    const context = {
      userId,
      currentPhase,
      recentSessions: sessions.slice(0, 5),
      recentCheckIns: checkIns.slice(0, 3),
      behaviorInsights,
      performanceForecast,
      conversationHistory: [],
      userPreferences: {
        communicationStyle: 'encouraging',
        detailLevel: 'moderate',
        focusAreas: ['form', 'safety', 'progress'],
      },
    };

    try {
      await generateFormFeedback(selectedExercise, context, []);
    } catch (error) {
      console.error('Error generating form feedback:', error);
    }
  };

  const handleGenerateMotivationalMessage = async () => {
    const context = {
      userId,
      currentPhase,
      recentSessions: sessions.slice(0, 5),
      recentCheckIns: checkIns.slice(0, 3),
      behaviorInsights,
      performanceForecast,
      conversationHistory: [],
      userPreferences: {
        communicationStyle: 'encouraging',
        detailLevel: 'moderate',
        focusAreas: ['form', 'safety', 'progress'],
      },
    };

    try {
      await generateMotivationalMessage(context, 'encouragement', 'moderate');
    } catch (error) {
      console.error('Error generating motivational message:', error);
    }
  };

  if (isLoading && !conversationHistory.length && !adaptiveContent) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center space-x-2'>
            <RefreshCw className='h-4 w-4 animate-spin' />
            <span>Initializing AI coaching assistant...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center space-x-2 text-red-600'>
            <AlertTriangle className='h-4 w-4' />
            <span>Error: {error}</span>
          </div>
          <Button onClick={clearError} className='mt-4' size='sm'>
            Clear Error
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Brain className='h-6 w-6 text-primary' />
          <h2 className='text-2xl font-bold'>AI Coaching Assistant</h2>
        </div>
        <div className='flex items-center space-x-2'>
          {lastUpdated && (
            <span className='text-sm text-muted-foreground'>
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
          <Button onClick={refreshAll} size='sm' disabled={isLoading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-5'>
          <TabsTrigger value='chat'>Chat</TabsTrigger>
          <TabsTrigger value='coaching'>Coaching</TabsTrigger>
          <TabsTrigger value='content'>Content</TabsTrigger>
          <TabsTrigger value='tips'>Tips</TabsTrigger>
          <TabsTrigger value='celebrations'>Celebrations</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value='chat' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <MessageCircle className='h-5 w-5 mr-2' />
                AI Chat Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Conversation History */}
              <div className='space-y-4 max-h-96 overflow-y-auto'>
                {conversationHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className='text-sm'>{message.content}</p>
                      <p className='text-xs opacity-70 mt-1'>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className='flex justify-start'>
                    <div className='bg-muted p-3 rounded-lg'>
                      <div className='flex items-center space-x-2'>
                        <RefreshCw className='h-4 w-4 animate-spin' />
                        <span className='text-sm'>AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className='flex space-x-2'>
                <Textarea
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  placeholder='Ask me anything about your training...'
                  className='flex-1'
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isGenerating}
                >
                  <Send className='h-4 w-4' />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coaching Tab */}
        <TabsContent value='coaching' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            {/* Form Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Target className='h-5 w-5 mr-2' />
                  Form Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Select Exercise</label>
                  <select
                    value={selectedExercise}
                    onChange={e => setSelectedExercise(e.target.value)}
                    className='w-full p-2 border rounded-md'
                  >
                    <option value=''>Choose an exercise...</option>
                    <option value='squat'>Squat</option>
                    <option value='push-up'>Push-up</option>
                    <option value='plank'>Plank</option>
                    <option value='deadlift'>Deadlift</option>
                  </select>
                </div>
                <Button
                  onClick={handleGenerateFormFeedback}
                  disabled={!selectedExercise}
                  className='w-full'
                >
                  Get Form Feedback
                </Button>
                {realTimeFeedback && (
                  <div className='mt-4 p-3 bg-green-50 border border-green-200 rounded-md'>
                    <h4 className='font-medium text-green-800'>
                      Feedback for {realTimeFeedback.exerciseName}
                    </h4>
                    <p className='text-sm text-green-700 mt-1'>
                      {realTimeFeedback.feedback}
                    </p>
                    {realTimeFeedback.corrections.length > 0 && (
                      <div className='mt-2'>
                        <h5 className='text-sm font-medium text-green-800'>
                          Corrections:
                        </h5>
                        <ul className='text-sm text-green-700 list-disc list-inside'>
                          {realTimeFeedback.corrections.map(
                            (correction, index) => (
                              <li key={index}>{correction}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Motivational Messages */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Sparkles className='h-5 w-5 mr-2' />
                  Motivational Messages
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Button
                  onClick={handleGenerateMotivationalMessage}
                  className='w-full'
                >
                  Generate Motivational Message
                </Button>
                {motivationalMessages.length > 0 && (
                  <div className='space-y-2'>
                    {motivationalMessages.slice(-3).map((message, index) => (
                      <div
                        key={index}
                        className='p-3 bg-blue-50 border border-blue-200 rounded-md'
                      >
                        <div className='flex items-center justify-between mb-1'>
                          <Badge variant='outline' className='text-xs'>
                            {message.type}
                          </Badge>
                          <Badge variant='secondary' className='text-xs'>
                            {message.intensity}
                          </Badge>
                        </div>
                        <p className='text-sm text-blue-800'>
                          {message.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Coaching Session */}
          {activeCoachingSession && (
            <Card>
              <CardHeader>
                <CardTitle>Active Coaching Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <p>
                    <strong>Type:</strong> {activeCoachingSession.type}
                  </p>
                  <p>
                    <strong>Started:</strong>{' '}
                    {new Date(activeCoachingSession.startTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {activeCoachingSession.status}
                  </p>
                  <p>
                    <strong>Messages:</strong>{' '}
                    {activeCoachingSession.messages.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value='content' className='space-y-4'>
          {personalizedWorkout ? (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <BookOpen className='h-5 w-5 mr-2' />
                  Personalized Workout Description
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h3 className='text-lg font-semibold'>
                    {personalizedWorkout.title}
                  </h3>
                  <p className='text-muted-foreground'>
                    {personalizedWorkout.overview}
                  </p>
                </div>

                <div>
                  <h4 className='font-medium mb-2'>Instructions</h4>
                  <ul className='list-disc list-inside space-y-1'>
                    {personalizedWorkout.instructions.map(
                      (instruction, index) => (
                        <li key={index} className='text-sm'>
                          {instruction}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className='font-medium mb-2'>Tips</h4>
                  <ul className='list-disc list-inside space-y-1'>
                    {personalizedWorkout.tips.map((tip, index) => (
                      <li key={index} className='text-sm'>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='p-3 bg-yellow-50 border border-yellow-200 rounded-md'>
                  <h4 className='font-medium text-yellow-800 mb-2'>
                    Safety Notes
                  </h4>
                  <ul className='list-disc list-inside space-y-1'>
                    {personalizedWorkout.safetyNotes.map((note, index) => (
                      <li key={index} className='text-sm text-yellow-700'>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className='p-6'>
                <div className='text-center text-muted-foreground'>
                  No personalized workout content available
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value='tips' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Lightbulb className='h-5 w-5 mr-2' />
                Contextual Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contextualTips.length > 0 ? (
                <div className='space-y-4'>
                  {contextualTips.map((tip, index) => (
                    <div key={tip.id} className='p-4 border rounded-lg'>
                      <div className='flex items-start justify-between mb-2'>
                        <h4 className='font-medium'>{tip.title}</h4>
                        <div className='flex space-x-2'>
                          <Badge variant='outline' className='text-xs'>
                            {tip.category}
                          </Badge>
                          <Badge
                            variant={
                              tip.priority === 'high'
                                ? 'destructive'
                                : tip.priority === 'medium'
                                  ? 'default'
                                  : 'secondary'
                            }
                            className='text-xs'
                          >
                            {tip.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className='text-sm text-muted-foreground mb-2'>
                        {tip.content}
                      </p>
                      <div className='flex items-center justify-between text-xs text-muted-foreground'>
                        <span>
                          Relevance: {Math.round(tip.relevance * 100)}%
                        </span>
                        <span>Timing: {tip.timing}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center text-muted-foreground'>
                  No contextual tips available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Celebrations Tab */}
        <TabsContent value='celebrations' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Trophy className='h-5 w-5 mr-2' />
                Progress Celebrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {progressCelebrations.length > 0 ? (
                <div className='space-y-4'>
                  {progressCelebrations.map((celebration, index) => (
                    <div key={index} className='p-4 border rounded-lg'>
                      <div className='flex items-center space-x-2 mb-2'>
                        <span className='text-2xl'>
                          {celebration.visual.emoji}
                        </span>
                        <h4 className='font-medium'>{celebration.title}</h4>
                        <Badge variant='outline' className='text-xs'>
                          {celebration.type}
                        </Badge>
                      </div>
                      <p className='text-sm text-muted-foreground mb-2'>
                        {celebration.message}
                      </p>
                      <div className='flex items-center justify-between text-xs text-muted-foreground'>
                        <span>Color: {celebration.visual.color}</span>
                        <span>
                          Shareable: {celebration.shareable ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center text-muted-foreground'>
                  No progress celebrations available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
