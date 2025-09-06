import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/client'
import { exerciseDBService } from '@/lib/api/exercisedb'
import { youtubeService } from '@/lib/api/youtube'
import { Exercise, ApiResponse, PaginatedResponse } from '@/lib/types/database'

// GET /api/exercises - Get exercises with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const muscleGroup = searchParams.get('muscle_group')
    const equipment = searchParams.get('equipment')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const isCustom = searchParams.get('is_custom')

    let query = supabase
      .from('exercises')
      .select('*', { count: 'exact' })

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }

    if (muscleGroup) {
      query = query.contains('muscle_groups', [muscleGroup])
    }

    if (equipment) {
      query = query.contains('equipment', [equipment])
    }

    if (difficulty) {
      query = query.eq('difficulty_level', difficulty)
    }

    if (isCustom !== null) {
      query = query.eq('is_custom', isCustom === 'true')
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Order by name
    query = query.order('name', { ascending: true })

    const { data: exercises, error, count } = await query

    if (error) {
      console.error('Error fetching exercises:', error)
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Failed to fetch exercises'
      }, { status: 500 })
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json<ApiResponse<PaginatedResponse<Exercise>>>({
      success: true,
      data: {
        data: exercises || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: totalPages
        }
      }
    })

  } catch (error) {
    console.error('Error in exercises GET:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/exercises - Create a new custom exercise
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const body = await request.json()

    const {
      name,
      description,
      category,
      muscle_groups,
      equipment,
      difficulty_level,
      instructions,
      video_url,
      image_url,
      created_by
    } = body

    // Validate required fields
    if (!name || !category || !muscle_groups || !equipment || !difficulty_level || !instructions) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Missing required fields: name, category, muscle_groups, equipment, difficulty_level, instructions'
      }, { status: 400 })
    }

    // Validate arrays
    if (!Array.isArray(muscle_groups) || !Array.isArray(equipment) || !Array.isArray(instructions)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'muscle_groups, equipment, and instructions must be arrays'
      }, { status: 400 })
    }

    // Validate difficulty level
    if (!['beginner', 'intermediate', 'advanced'].includes(difficulty_level)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'difficulty_level must be one of: beginner, intermediate, advanced'
      }, { status: 400 })
    }

    // Create new exercise
    const { data: exercise, error } = await supabase
      .from('exercises')
      .insert({
        name,
        description,
        category,
        muscle_groups,
        equipment,
        difficulty_level,
        instructions,
        video_url,
        image_url,
        is_custom: true,
        created_by
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating exercise:', error)
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Failed to create exercise'
      }, { status: 500 })
    }

    return NextResponse.json<ApiResponse<Exercise>>({
      success: true,
      data: exercise,
      message: 'Exercise created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error in exercises POST:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
