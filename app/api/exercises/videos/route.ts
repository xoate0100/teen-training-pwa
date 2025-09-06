import { NextRequest, NextResponse } from 'next/server';
import { youtubeService } from '@/lib/api/youtube';
import { ApiResponse } from '@/lib/types/database';

// GET /api/exercises/videos - Search for exercise demonstration videos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseName = searchParams.get('exercise');
    const category = searchParams.get('category');
    const muscleGroup = searchParams.get('muscle_group');
    const equipment = searchParams.get('equipment');
    const difficulty = searchParams.get('difficulty');
    const maxResults = parseInt(searchParams.get('max_results') || '10');

    if (
      !exerciseName &&
      !category &&
      !muscleGroup &&
      !equipment &&
      !difficulty
    ) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'At least one search parameter is required',
        },
        { status: 400 }
      );
    }

    let videos = [];

    // Search based on exercise name
    if (exerciseName) {
      videos = await youtubeService.searchExerciseDemonstration(
        exerciseName,
        maxResults
      );
    }
    // Search based on category
    else if (category) {
      videos = await youtubeService.getCategoryVideos(category, maxResults);
    }
    // Search based on muscle group
    else if (muscleGroup) {
      videos = await youtubeService.getMuscleGroupVideos(
        muscleGroup,
        maxResults
      );
    }
    // Search based on equipment
    else if (equipment) {
      videos = await youtubeService.getEquipmentVideos(equipment, maxResults);
    }
    // Search based on difficulty
    else if (difficulty) {
      videos = await youtubeService.getDifficultyVideos(
        difficulty as 'beginner' | 'intermediate' | 'advanced',
        maxResults
      );
    }

    return NextResponse.json<ApiResponse<typeof videos>>({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error('Error searching exercise videos:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to search exercise videos',
      },
      { status: 500 }
    );
  }
}

// POST /api/exercises/videos - Search with custom parameters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      max_results = 10,
      order = 'relevance',
      duration = 'short',
    } = body;

    if (!query) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Query parameter is required',
        },
        { status: 400 }
      );
    }

    const response = await youtubeService.searchExerciseVideos({
      query,
      max_results: max_results,
      order: order as 'relevance' | 'date' | 'rating' | 'viewCount',
      duration: duration as 'short' | 'medium' | 'long',
    });

    return NextResponse.json<ApiResponse<typeof response>>({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error searching videos with custom parameters:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to search videos',
      },
      { status: 500 }
    );
  }
}
