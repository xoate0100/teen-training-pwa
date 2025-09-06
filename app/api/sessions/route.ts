import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/client';
import {
  CreateSessionRequest,
  Session,
  ApiResponse,
} from '@/lib/types/database';

// GET /api/sessions - Get all sessions for a user
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const weekNumber = searchParams.get('week_number');
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'User ID is required',
        },
        { status: 400 }
      );
    }

    let query = supabase
      .from('sessions')
      .select(
        `
        *,
        session_exercises (
          *,
          exercise:exercises (*)
        )
      `
      )
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (weekNumber) {
      query = query.eq('week_number', parseInt(weekNumber));
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Failed to fetch sessions',
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Session[]>>({
      success: true,
      data: sessions || [],
    });
  } catch (error) {
    console.error('Error in sessions GET:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create a new session
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const body: CreateSessionRequest = await request.json();

    const { user_id, date, session_type, week_number, day_number } = body;

    // Validate required fields
    if (!user_id || !date || !session_type || !week_number || !day_number) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error:
            'Missing required fields: user_id, date, session_type, week_number, day_number',
        },
        { status: 400 }
      );
    }

    // Check if session already exists
    const { data: existingSession } = await supabase
      .from('sessions')
      .select('id')
      .eq('user_id', user_id)
      .eq('date', date)
      .eq('session_type', session_type)
      .single();

    if (existingSession) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Session already exists for this date and type',
        },
        { status: 409 }
      );
    }

    // Create new session
    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        user_id,
        date,
        session_type,
        week_number,
        day_number,
        status: 'planned',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Failed to create session',
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Session>>(
      {
        success: true,
        data: session,
        message: 'Session created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in sessions POST:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
