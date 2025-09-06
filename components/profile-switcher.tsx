'use client';

import React, { useState } from 'react';
import { useUser } from '@/lib/contexts/user-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { User, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function ProfileSwitcher() {
  const { currentUser, users, switchUser, createUser, isLoading } = useUser();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    full_name: '',
    age: 16,
    sport: '',
    experience_level: 'beginner' as const,
    profile_data: {
      height: 0,
      weight: 0,
      goals: [] as string[],
      preferences: {
        workout_duration: 45,
        preferred_times: [] as string[],
        equipment_available: [] as string[],
      },
    },
  });

  const handleSwitchUser = async (userId: string) => {
    try {
      await switchUser(userId);
      toast.success('User switched successfully');
    } catch {
      toast.error('Failed to switch user');
    }
  };

  const handleCreateUser = async () => {
    try {
      setIsCreating(true);
      await createUser(newUserData);
      setIsCreateDialogOpen(false);
      setNewUserData({
        email: '',
        full_name: '',
        age: 16,
        sport: '',
        experience_level: 'beginner',
        profile_data: {
          height: 0,
          weight: 0,
          goals: [],
          preferences: {
            workout_duration: 45,
            preferred_times: [],
            equipment_available: [],
          },
        },
      });
      toast.success('User created successfully');
    } catch {
      toast.error('Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCurrentWeek = (user: any) => {
    // This will be replaced with smart week calculation later
    return user.current_week || 1;
  };

  if (isLoading) {
    return (
      <div className='flex items-center gap-2'>
        <div className='w-8 h-8 bg-muted animate-pulse rounded-full' />
        <div className='w-20 h-4 bg-muted animate-pulse rounded' />
      </div>
    );
  }

  return (
    <div className='flex items-center gap-4'>
      {/* Current User Display */}
      {currentUser && (
        <Card className='border-primary/20 bg-primary/5'>
          <CardContent className='p-3'>
            <div className='flex items-center gap-3'>
              <Avatar className='w-10 h-10'>
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className='bg-primary text-primary-foreground'>
                  {getInitials(currentUser.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-sm truncate'>
                  {currentUser.full_name}
                </p>
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary' className='text-xs'>
                    Week {getCurrentWeek(currentUser)}/11
                  </Badge>
                  <Badge variant='outline' className='text-xs'>
                    {currentUser.sport}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Switcher Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <User className='w-4 h-4' />
            Switch User
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-64' align='end'>
          <DropdownMenuLabel>Beta Test Users</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {users.map(user => (
            <DropdownMenuItem
              key={user.id}
              onClick={() => handleSwitchUser(user.id)}
              className='flex items-center gap-3 p-3'
            >
              <Avatar className='w-8 h-8'>
                <AvatarImage src={user.avatar} />
                <AvatarFallback className='bg-primary text-primary-foreground text-xs'>
                  {getInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <p className='font-medium text-sm truncate'>{user.full_name}</p>
                <p className='text-xs text-muted-foreground truncate'>
                  {user.sport} • {user.experience_level}
                </p>
              </div>
              {currentUser?.id === user.id && (
                <Badge variant='default' className='text-xs'>
                  Current
                </Badge>
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                <Plus className='w-4 h-4 mr-2' />
                Add New User
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className='max-w-md'>
              <DialogHeader>
                <DialogTitle>Add New Beta Tester</DialogTitle>
                <DialogDescription>
                  Create a new user profile for beta testing.
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      value={newUserData.email}
                      onChange={e =>
                        setNewUserData(prev => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder='user@example.com'
                    />
                  </div>
                  <div>
                    <Label htmlFor='full_name'>Full Name</Label>
                    <Input
                      id='full_name'
                      value={newUserData.full_name}
                      onChange={e =>
                        setNewUserData(prev => ({
                          ...prev,
                          full_name: e.target.value,
                        }))
                      }
                      placeholder='John Doe'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='age'>Age</Label>
                    <Input
                      id='age'
                      type='number'
                      min='13'
                      max='19'
                      value={newUserData.age}
                      onChange={e =>
                        setNewUserData(prev => ({
                          ...prev,
                          age: parseInt(e.target.value) || 16,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='sport'>Sport</Label>
                    <Input
                      id='sport'
                      value={newUserData.sport}
                      onChange={e =>
                        setNewUserData(prev => ({
                          ...prev,
                          sport: e.target.value,
                        }))
                      }
                      placeholder='Volleyball'
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='experience_level'>Experience Level</Label>
                  <Select
                    value={newUserData.experience_level}
                    onValueChange={(
                      value: 'beginner' | 'intermediate' | 'advanced'
                    ) =>
                      setNewUserData(prev => ({
                        ...prev,
                        experience_level: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='beginner'>Beginner</SelectItem>
                      <SelectItem value='intermediate'>Intermediate</SelectItem>
                      <SelectItem value='advanced'>Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='height'>Height (cm)</Label>
                    <Input
                      id='height'
                      type='number'
                      value={newUserData.profile_data.height}
                      onChange={e =>
                        setNewUserData(prev => ({
                          ...prev,
                          profile_data: {
                            ...prev.profile_data,
                            height: parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='weight'>Weight (kg)</Label>
                    <Input
                      id='weight'
                      type='number'
                      value={newUserData.profile_data.weight}
                      onChange={e =>
                        setNewUserData(prev => ({
                          ...prev,
                          profile_data: {
                            ...prev.profile_data,
                            weight: parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateUser}
                  disabled={
                    isCreating || !newUserData.email || !newUserData.full_name
                  }
                >
                  {isCreating ? 'Creating...' : 'Create User'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
