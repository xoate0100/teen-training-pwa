'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  Users,
  BarChart3,
  Send,
  Filter,
  Download,
  Eye,
  Heart,
  Zap,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackItem {
  id: string;
  type: 'rating' | 'comment' | 'bug' | 'feature' | 'survey';
  title: string;
  description: string;
  rating?: number;
  comment?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'reviewed' | 'in-progress' | 'resolved' | 'closed';
  userId: string;
  timestamp: number;
  tags: string[];
  response?: string;
  assignedTo?: string;
  votes: number;
  similarCount: number;
}

interface FeedbackSurvey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  isActive: boolean;
  responses: number;
  targetAudience: string;
  startDate: Date;
  endDate?: Date;
}

interface SurveyQuestion {
  id: string;
  type: 'rating' | 'multiple-choice' | 'text' | 'yes-no';
  question: string;
  options?: string[];
  required: boolean;
  responses: any[];
}

interface UserFeedbackProps {
  userId: string;
  className?: string;
}

export function UserFeedback({ userId, className }: UserFeedbackProps) {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [surveys, setSurveys] = useState<FeedbackSurvey[]>([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCollecting, setIsCollecting] = useState(true);

  // Mock feedback data
  const mockFeedback: FeedbackItem[] = [
    {
      id: 'feedback-1',
      type: 'rating',
      title: 'App Usability Rating',
      description: 'Overall app experience rating',
      rating: 4.5,
      category: 'usability',
      priority: 'medium',
      status: 'reviewed',
      userId: 'user_123',
      timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      tags: ['mobile', 'navigation'],
      votes: 12,
      similarCount: 3,
    },
    {
      id: 'feedback-2',
      type: 'bug',
      title: 'Settings Page Loading Issue',
      description: 'Settings page takes too long to load on mobile devices',
      category: 'performance',
      priority: 'high',
      status: 'in-progress',
      userId: 'user_456',
      timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
      tags: ['mobile', 'settings', 'loading'],
      votes: 8,
      similarCount: 5,
      assignedTo: 'dev_team',
    },
    {
      id: 'feedback-3',
      type: 'feature',
      title: 'Dark Mode Request',
      description: 'Would love to have a dark mode option for evening use',
      category: 'feature',
      priority: 'medium',
      status: 'new',
      userId: 'user_789',
      timestamp: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
      tags: ['theme', 'accessibility'],
      votes: 25,
      similarCount: 12,
    },
    {
      id: 'feedback-4',
      type: 'comment',
      title: 'Great Workout Experience',
      description: 'The workout sessions are really well designed and motivating!',
      comment: 'Love the progress tracking and the way exercises are presented. Keep up the great work!',
      category: 'positive',
      priority: 'low',
      status: 'reviewed',
      userId: 'user_321',
      timestamp: Date.now() - 8 * 60 * 60 * 1000, // 8 hours ago
      tags: ['workout', 'positive'],
      votes: 15,
      similarCount: 2,
    },
  ];

  const mockSurveys: FeedbackSurvey[] = [
    {
      id: 'survey-1',
      title: 'User Experience Survey',
      description: 'Help us improve your experience with the app',
      isActive: true,
      responses: 156,
      targetAudience: 'all_users',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      questions: [
        {
          id: 'q1',
          type: 'rating',
          question: 'How would you rate the overall app experience?',
          required: true,
          responses: [4.2],
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'What is your primary use case?',
          options: ['Fitness Training', 'Progress Tracking', 'Social Features', 'AI Coaching'],
          required: true,
          responses: ['Fitness Training', 'Progress Tracking'],
        },
        {
          id: 'q3',
          type: 'text',
          question: 'What would you like to see improved?',
          required: false,
          responses: [],
        },
      ],
    },
    {
      id: 'survey-2',
      title: 'Mobile Navigation Feedback',
      description: 'Specific feedback on mobile navigation experience',
      isActive: false,
      responses: 89,
      targetAudience: 'mobile_users',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      questions: [
        {
          id: 'q1',
          type: 'yes-no',
          question: 'Is the mobile navigation intuitive?',
          required: true,
          responses: [0.78],
        },
        {
          id: 'q2',
          type: 'rating',
          question: 'Rate the mobile navigation ease of use',
          required: true,
          responses: [3.8],
        },
      ],
    },
  ];

  // Load data
  useEffect(() => {
    setFeedback(mockFeedback);
    setSurveys(mockSurveys);
  }, []);

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rating': return <Star className='h-4 w-4' />;
      case 'comment': return <MessageSquare className='h-4 w-4' />;
      case 'bug': return <AlertCircle className='h-4 w-4' />;
      case 'feature': return <Zap className='h-4 w-4' />;
      case 'survey': return <BarChart3 className='h-4 w-4' />;
      default: return <MessageSquare className='h-4 w-4' />;
    }
  };

  // Filter feedback
  const filteredFeedback = feedback.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  // Submit feedback
  const submitFeedback = (feedbackData: Partial<FeedbackItem>) => {
    const newFeedback: FeedbackItem = {
      id: `feedback_${Date.now()}`,
      type: feedbackData.type || 'comment',
      title: feedbackData.title || 'New Feedback',
      description: feedbackData.description || '',
      category: feedbackData.category || 'general',
      priority: feedbackData.priority || 'medium',
      status: 'new',
      userId,
      timestamp: Date.now(),
      tags: feedbackData.tags || [],
      votes: 0,
      similarCount: 0,
      ...feedbackData,
    };
    
    setFeedback(prev => [newFeedback, ...prev]);
    setShowFeedbackForm(false);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <MessageSquare className='h-5 w-5' />
              User Feedback Collection
            </CardTitle>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <Switch
                  checked={isCollecting}
                  onCheckedChange={setIsCollecting}
                />
                <span className='text-sm'>Collecting</span>
              </div>
              <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Send className='h-4 w-4 mr-2' />
                    Submit Feedback
                  </Button>
                </DialogTrigger>
                <DialogContent className='max-w-2xl'>
                  <DialogHeader>
                    <DialogTitle>Submit Feedback</DialogTitle>
                    <DialogDescription>
                      Help us improve the app by sharing your thoughts and experiences
                    </DialogDescription>
                  </DialogHeader>
                  <FeedbackForm onSubmit={submitFeedback} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Collect, analyze, and act on user feedback to continuously improve the experience
          </p>
        </CardContent>
      </Card>

      {/* Feedback Summary */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <MessageSquare className='h-5 w-5 text-blue-600' />
              </div>
              <div>
                <div className='text-2xl font-bold'>{feedback.length}</div>
                <div className='text-sm text-muted-foreground'>Total Feedback</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <CheckCircle className='h-5 w-5 text-green-600' />
              </div>
              <div>
                <div className='text-2xl font-bold'>
                  {feedback.filter(f => f.status === 'resolved').length}
                </div>
                <div className='text-sm text-muted-foreground'>Resolved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-yellow-100 rounded-lg'>
                <Star className='h-5 w-5 text-yellow-600' />
              </div>
              <div>
                <div className='text-2xl font-bold'>
                  {feedback.filter(f => f.type === 'rating').reduce((acc, f) => acc + (f.rating || 0), 0) / feedback.filter(f => f.type === 'rating').length || 0}
                </div>
                <div className='text-sm text-muted-foreground'>Avg Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-purple-100 rounded-lg'>
                <Users className='h-5 w-5 text-purple-600' />
              </div>
              <div>
                <div className='text-2xl font-bold'>{surveys.length}</div>
                <div className='text-sm text-muted-foreground'>Active Surveys</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Filters */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Feedback Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4 mb-4'>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className='w-48'>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                <SelectItem value='usability'>Usability</SelectItem>
                <SelectItem value='performance'>Performance</SelectItem>
                <SelectItem value='feature'>Feature Request</SelectItem>
                <SelectItem value='bug'>Bug Report</SelectItem>
                <SelectItem value='positive'>Positive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className='w-48'>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='new'>New</SelectItem>
                <SelectItem value='reviewed'>Reviewed</SelectItem>
                <SelectItem value='in-progress'>In Progress</SelectItem>
                <SelectItem value='resolved'>Resolved</SelectItem>
                <SelectItem value='closed'>Closed</SelectItem>
              </SelectContent>
            </Select>

            <Button variant='outline' size='sm'>
              <Download className='h-4 w-4 mr-2' />
              Export
            </Button>
          </div>

          <div className='space-y-4'>
            {filteredFeedback.map(item => (
              <div key={item.id} className='p-4 border rounded-lg space-y-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-2'>
                    {getTypeIcon(item.type)}
                    <h4 className='font-medium'>{item.title}</h4>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <span>{item.votes} votes</span>
                    <span>•</span>
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className='text-sm text-muted-foreground'>{item.description}</p>

                {item.comment && (
                  <div className='p-3 bg-muted/50 rounded-lg'>
                    <p className='text-sm'>{item.comment}</p>
                  </div>
                )}

                {item.rating && (
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-muted-foreground'>Rating:</span>
                    <div className='flex items-center gap-1'>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={cn(
                            'h-4 w-4',
                            star <= item.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          )}
                        />
                      ))}
                      <span className='text-sm font-medium ml-2'>{item.rating}/5</span>
                    </div>
                  </div>
                )}

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    {item.tags.map(tag => (
                      <Badge key={tag} variant='outline' className='text-xs'>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button variant='outline' size='sm'>
                      <Eye className='h-3 w-3 mr-1' />
                      View
                    </Button>
                    <Button variant='outline' size='sm'>
                      <ThumbsUp className='h-3 w-3 mr-1' />
                      Vote
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Surveys */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='h-5 w-5' />
            Active Surveys
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {surveys.filter(survey => survey.isActive).map(survey => (
              <div key={survey.id} className='p-4 border rounded-lg space-y-3'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <h3 className='font-medium'>{survey.title}</h3>
                    <p className='text-sm text-muted-foreground'>{survey.description}</p>
                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                      <span>{survey.responses} responses</span>
                      <span>•</span>
                      <span>Target: {survey.targetAudience}</span>
                    </div>
                  </div>
                  <Button size='sm'>
                    <BarChart3 className='h-3 w-3 mr-1' />
                    View Results
                  </Button>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span>Response Rate</span>
                    <span>{Math.round((survey.responses / 1000) * 100)}%</span>
                  </div>
                  <Progress value={(survey.responses / 1000) * 100} className='h-2' />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Feedback Form Component
interface FeedbackFormProps {
  onSubmit: (data: Partial<FeedbackItem>) => void;
}

function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    type: 'comment',
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
    rating: 5,
    comment: '',
    tags: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='type'>Feedback Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='comment'>General Comment</SelectItem>
              <SelectItem value='bug'>Bug Report</SelectItem>
              <SelectItem value='feature'>Feature Request</SelectItem>
              <SelectItem value='rating'>Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='category'>Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='general'>General</SelectItem>
              <SelectItem value='usability'>Usability</SelectItem>
              <SelectItem value='performance'>Performance</SelectItem>
              <SelectItem value='feature'>Feature</SelectItem>
              <SelectItem value='bug'>Bug</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='title'>Title</Label>
        <Input
          id='title'
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder='Brief description of your feedback'
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder='Detailed description of your feedback'
          rows={3}
        />
      </div>

      {formData.type === 'rating' && (
        <div className='space-y-2'>
          <Label>Rating</Label>
          <div className='flex items-center gap-2'>
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={cn(
                  'h-6 w-6 cursor-pointer',
                  star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                )}
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
              />
            ))}
            <span className='text-sm text-muted-foreground ml-2'>{formData.rating}/5</span>
          </div>
        </div>
      )}

      <div className='space-y-2'>
        <Label htmlFor='comment'>Additional Comments</Label>
        <Textarea
          id='comment'
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
          placeholder='Any additional thoughts or suggestions'
          rows={2}
        />
      </div>

      <div className='flex justify-end gap-2'>
        <Button type='button' variant='outline'>
          Cancel
        </Button>
        <Button type='submit'>
          <Send className='h-4 w-4 mr-2' />
          Submit Feedback
        </Button>
      </div>
    </form>
  );
}
