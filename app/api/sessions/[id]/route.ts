import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/client';
import {
  UpdateSessionRequest,
  Session,
  ApiResponse,
} from '@/lib/types/database';

// GET /api/sessions/[id] - Get a specific session
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient();
    const sessionId = params.id;

    const { data: session, error } = await supabase
      .from('sessions')
      .select(
        `
        *,
        session_exercises (
          *,
          exercise:exercises (*),
          set_logs (*)
        )
      `
      )
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching session:', error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Session not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Session>>({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Error in session GET:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/sessions/[id] - Update a session
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient();
    const sessionId = params.id;
    const body: UpdateSessionRequest = await request.json();

    const { status, duration_minutes, notes } = body;

    // Build update object with only provided fields
    const updateData: Partial<UpdateSessionRequest> = {};
    if (status !== undefined) updateData.status = status;
    if (duration_minutes !== undefined)
      updateData.duration_minutes = duration_minutes;
    if (notes !== undefined) updateData.notes = notes;

    // If session is being completed, calculate totals
    if (status === 'completed') {
      // Get session exercises to calculate totals
      const { data: sessionExercises } = await supabase
        .from('session_exercises')
        .select(
          `
          sets,
          reps,
          set_logs (rpe)
        `
        )
        .eq('session_id', sessionId);

      if (sessionExercises) {
        const totalSets = sessionExercises.reduce(
          (sum, se) => sum + se.sets,
          0
        );
        const totalReps = sessionExercises.reduce(
          (sum, se) => sum + se.sets * se.reps,
          0
        );

        // Calculate average RPE from set logs
        const allSetLogs = sessionExercises.flatMap(se => se.set_logs || []);
        const averageRpe =
          allSetLogs.length > 0
            ? allSetLogs.reduce((sum, log) => sum + log.rpe, 0) /
              allSetLogs.length
            : null;

        updateData.total_sets = totalSets;
        updateData.total_reps = totalReps;
        updateData.average_rpe = averageRpe;
      }
    }

    const { data: session, error } = await supabase
      .from('sessions')
      .update(updateData)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating session:', error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Failed to update session',
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Session>>({
      success: true,
      data: session,
      message: 'Session updated successfully',
    });
  } catch (error) {
    console.error('Error in session PUT:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[id] - Delete a session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient();
    const sessionId = params.id;

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('Error deleting session:', error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Failed to delete session',
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error) {
    console.error('Error in session DELETE:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
