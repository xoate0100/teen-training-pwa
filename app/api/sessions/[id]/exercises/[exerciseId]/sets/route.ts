import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/client';
import { LogSetRequest, SetLog, ApiResponse } from '@/lib/types/database';

// POST /api/sessions/[id]/exercises/[exerciseId]/sets - Log a set
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; exerciseId: string } }
) {
  try {
    const supabase = createSupabaseServerClient();
    const sessionId = params.id;
    const sessionExerciseId = params.exerciseId;
    const body: LogSetRequest = await request.json();

    const {
      set_number,
      reps_completed,
      weight_used,
      rpe,
      rest_taken_seconds,
      notes,
    } = body;

    // Validate required fields
    if (!set_number || reps_completed === undefined || !rpe) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Missing required fields: set_number, reps_completed, rpe',
        },
        { status: 400 }
      );
    }

    // Validate RPE range
    if (rpe < 1 || rpe > 10) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'RPE must be between 1 and 10',
        },
        { status: 400 }
      );
    }

    // Verify the session exercise exists and belongs to the session
    const { data: sessionExercise, error: sessionExerciseError } =
      await supabase
        .from('session_exercises')
        .select('id, session_id')
        .eq('id', sessionExerciseId)
        .eq('session_id', sessionId)
        .single();

    if (sessionExerciseError || !sessionExercise) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Session exercise not found',
        },
        { status: 404 }
      );
    }

    // Check if set already exists
    const { data: existingSet } = await supabase
      .from('set_logs')
      .select('id')
      .eq('session_exercise_id', sessionExerciseId)
      .eq('set_number', set_number)
      .single();

    if (existingSet) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Set already logged for this set number',
        },
        { status: 409 }
      );
    }

    // Create new set log
    const { data: setLog, error } = await supabase
      .from('set_logs')
      .insert({
        session_exercise_id: sessionExerciseId,
        set_number,
        reps_completed,
        weight_used,
        rpe,
        rest_taken_seconds,
        notes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating set log:', error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Failed to log set',
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<SetLog>>(
      {
        success: true,
        data: setLog,
        message: 'Set logged successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in set logging POST:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// GET /api/sessions/[id]/exercises/[exerciseId]/sets - Get all sets for an exercise
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; exerciseId: string } }
) {
  try {
    const supabase = createSupabaseServerClient();
    const sessionId = params.id;
    const sessionExerciseId = params.exerciseId;

    // Verify the session exercise exists and belongs to the session
    const { data: sessionExercise, error: sessionExerciseError } =
      await supabase
        .from('session_exercises')
        .select('id, session_id')
        .eq('id', sessionExerciseId)
        .eq('session_id', sessionId)
        .single();

    if (sessionExerciseError || !sessionExercise) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Session exercise not found',
        },
        { status: 404 }
      );
    }

    // Get all set logs for this exercise
    const { data: setLogs, error } = await supabase
      .from('set_logs')
      .select('*')
      .eq('session_exercise_id', sessionExerciseId)
      .order('set_number', { ascending: true });

    if (error) {
      console.error('Error fetching set logs:', error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Failed to fetch set logs',
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<SetLog[]>>({
      success: true,
      data: setLogs || [],
    });
  } catch (error) {
    console.error('Error in set logs GET:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
