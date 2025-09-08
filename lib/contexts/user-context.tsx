'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

// Types
export interface BetaUser {
  id: string;
  email: string;
  full_name: string;
  age: number;
  sport: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  profile_data?: {
    height?: number;
    weight?: number;
    goals?: string[];
    preferences?: {
      workout_duration?: number;
      preferred_times?: string[];
      equipment_available?: string[];
    };
  };
  current_week?: number;
  last_session_date?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  full_name: string;
  age: number;
  sport: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  profile_data?: {
    height?: number;
    weight?: number;
    goals?: string[];
    preferences?: {
      workout_duration?: number;
      preferred_times?: string[];
      equipment_available?: string[];
    };
  };
}

interface UserContextType {
  currentUser: BetaUser | null;
  users: BetaUser[];
  isLoading: boolean;
  error: string | null;

  switchUser: (userId: string) => Promise<void>;

  createUser: (userData: CreateUserRequest) => Promise<void>;

  updateUser: (userId: string, updates: Partial<BetaUser>) => Promise<void>;

  deleteUser: (userId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [currentUser, setCurrentUser] = useState<BetaUser | null>(null);
  const [users, setUsers] = useState<BetaUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load current user from localStorage
  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId && users.length > 0) {
      const user = users.find(u => u.id === savedUserId);
      if (user) {
        setCurrentUser(user);
      }
    }
  }, [users]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setUsers(data || []);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      setCurrentUser(user);
      localStorage.setItem('currentUserId', userId);
    } catch (err) {
      console.error('Error switching user:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch user');
    }
  };

  const createUser = async (userData: CreateUserRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setUsers(prev => [...prev, data]);
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: Partial<BetaUser>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setUsers(prev => prev.map(user => (user.id === userId ? data : user)));

      if (currentUser?.id === userId) {
        setCurrentUser(data);
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (deleteError) {
        throw deleteError;
      }

      setUsers(prev => prev.filter(user => user.id !== userId));

      if (currentUser?.id === userId) {
        setCurrentUser(null);
        localStorage.removeItem('currentUserId');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUsers = async () => {
    await loadUsers();
  };

  const value: UserContextType = {
    currentUser,
    users,
    isLoading,
    error,
    switchUser,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
