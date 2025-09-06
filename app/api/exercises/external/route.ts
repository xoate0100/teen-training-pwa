import { NextRequest, NextResponse } from 'next/server';
import { exerciseDBService } from '@/lib/api/exercisedb';
import { youtubeService } from '@/lib/api/youtube';
import { ApiResponse } from '@/lib/types/database';

// GET /api/exercises/external - Search external exercise databases
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'exercisedb';
    const category = searchParams.get('category');
    const muscleGroup = searchParams.get('muscle_group');
    const equipment = searchParams.get('equipment');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let results = [];

    if (source === 'exercisedb') {
      const response = await exerciseDBService.searchExercises({
        category,
        muscle_group: muscleGroup,
        equipment,
        difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
        search,
        page,
        limit,
      });
      results = response.data;
    } else if (source === 'youtube') {
      if (search) {
        const response = await youtubeService.searchExerciseVideos({
          query: search,
          max_results: limit,
          order: 'relevance',
          duration: 'short',
        });
        results = response.videos;
      } else {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: 'Search query is required for YouTube source',
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Invalid source. Use "exercisedb" or "youtube"',
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse<typeof results>>({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error searching external exercises:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to search external exercises',
      },
      { status: 500 }
    );
  }
}

// GET /api/exercises/external/categories - Get available categories
export async function GET_CATEGORIES(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'exercisedb';

    let categories = [];

    if (source === 'exercisedb') {
      categories = await exerciseDBService.getBodyParts();
    } else if (source === 'youtube') {
      // YouTube doesn't have predefined categories, return common exercise categories
      categories = [
        'Cardio',
        'Strength Training',
        'Yoga',
        'Pilates',
        'HIIT',
        'Plyometric',
        'Flexibility',
        'Balance',
        'Core',
        'Upper Body',
        'Lower Body',
        'Full Body',
      ];
    } else {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Invalid source. Use "exercisedb" or "youtube"',
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse<typeof categories>>({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to get categories',
      },
      { status: 500 }
    );
  }
}

// GET /api/exercises/external/muscle-groups - Get available muscle groups
export async function GET_MUSCLE_GROUPS(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'exercisedb';

    let muscleGroups = [];

    if (source === 'exercisedb') {
      muscleGroups = await exerciseDBService.getMuscles();
    } else if (source === 'youtube') {
      // Return common muscle groups for YouTube searches
      muscleGroups = [
        'chest',
        'back',
        'shoulders',
        'biceps',
        'triceps',
        'forearms',
        'abs',
        'obliques',
        'quadriceps',
        'hamstrings',
        'glutes',
        'calves',
        'traps',
        'lats',
        'rhomboids',
        'deltoids',
      ];
    } else {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Invalid source. Use "exercisedb" or "youtube"',
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse<typeof muscleGroups>>({
      success: true,
      data: muscleGroups,
    });
  } catch (error) {
    console.error('Error getting muscle groups:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to get muscle groups',
      },
      { status: 500 }
    );
  }
}

// GET /api/exercises/external/equipment - Get available equipment
export async function GET_EQUIPMENT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'exercisedb';

    let equipment = [];

    if (source === 'exercisedb') {
      equipment = await exerciseDBService.getEquipments();
    } else if (source === 'youtube') {
      // Return common equipment for YouTube searches
      equipment = [
        'none',
        'dumbbells',
        'barbell',
        'kettlebell',
        'resistance_bands',
        'pull_up_bar',
        'bench',
        'mat',
        'medicine_ball',
        'stability_ball',
        'cable_machine',
        'treadmill',
        'bike',
        'rower',
      ];
    } else {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Invalid source. Use "exercisedb" or "youtube"',
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse<typeof equipment>>({
      success: true,
      data: equipment,
    });
  } catch (error) {
    console.error('Error getting equipment:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to get equipment',
      },
      { status: 500 }
    );
  }
}
