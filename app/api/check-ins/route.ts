import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/client'
import { CreateCheckInRequest, DailyCheckIn, ApiResponse } from '@/lib/types/database'

// GET /api/check-ins - Get check-ins for a user
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    if (!userId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    let query = supabase
      .from('daily_check_ins')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (startDate) {
      query = query.gte('date', startDate)
    }

    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data: checkIns, error } = await query

    if (error) {
      console.error('Error fetching check-ins:', error)
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Failed to fetch check-ins'
      }, { status: 500 })
    }

    return NextResponse.json<ApiResponse<DailyCheckIn[]>>({
      success: true,
      data: checkIns || []
    })

  } catch (error) {
    console.error('Error in check-ins GET:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/check-ins - Create a new check-in
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const body: CreateCheckInRequest = await request.json()

    const { user_id, date, mood, energy_level, sleep_hours, muscle_soreness, notes } = body

    // Validate required fields
    if (!user_id || !date || mood === undefined || energy_level === undefined || 
        sleep_hours === undefined || muscle_soreness === undefined) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Missing required fields: user_id, date, mood, energy_level, sleep_hours, muscle_soreness'
      }, { status: 400 })
    }

    // Validate ranges
    if (mood < 1 || mood > 5) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Mood must be between 1 and 5'
      }, { status: 400 })
    }

    if (energy_level < 1 || energy_level > 10) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Energy level must be between 1 and 10'
      }, { status: 400 })
    }

    if (sleep_hours < 0 || sleep_hours > 24) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Sleep hours must be between 0 and 24'
      }, { status: 400 })
    }

    if (muscle_soreness < 1 || muscle_soreness > 5) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Muscle soreness must be between 1 and 5'
      }, { status: 400 })
    }

    // Check if check-in already exists for this date
    const { data: existingCheckIn } = await supabase
      .from('daily_check_ins')
      .select('id')
      .eq('user_id', user_id)
      .eq('date', date)
      .single()

    if (existingCheckIn) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Check-in already exists for this date'
      }, { status: 409 })
    }

    // Create new check-in
    const { data: checkIn, error } = await supabase
      .from('daily_check_ins')
      .insert({
        user_id,
        date,
        mood,
        energy_level,
        sleep_hours,
        muscle_soreness,
        notes
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating check-in:', error)
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Failed to create check-in'
      }, { status: 500 })
    }

    return NextResponse.json<ApiResponse<DailyCheckIn>>({
      success: true,
      data: checkIn,
      message: 'Check-in created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error in check-ins POST:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
