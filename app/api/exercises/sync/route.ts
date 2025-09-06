import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/client'
import { exerciseDBService } from '@/lib/api/exercisedb'
import { youtubeService } from '@/lib/api/youtube'
import { ApiResponse } from '@/lib/types/database'

// POST /api/exercises/sync - Sync exercises from ExerciseDB and YouTube
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const body = await request.json()
    const { source = 'both', batch_size = 100 } = body

    let results = {
      exercisedb: { synced: 0, errors: 0 },
      youtube: { synced: 0, errors: 0 },
      total: 0
    }

    // Sync from ExerciseDB
    if (source === 'both' || source === 'exercisedb') {
      try {
        console.log('🔄 Syncing exercises from ExerciseDB...')
        const exercisedbResult = await exerciseDBService.syncExercisesToDatabase(
          supabase,
          batch_size
        )
        results.exercisedb = exercisedbResult
        console.log(`✅ ExerciseDB sync complete: ${exercisedbResult.synced} synced, ${exercisedbResult.errors} errors`)
      } catch (error) {
        console.error('❌ ExerciseDB sync failed:', error)
        results.exercisedb.errors = 1
      }
    }

    // Sync YouTube videos for existing exercises
    if (source === 'both' || source === 'youtube') {
      try {
        console.log('🔄 Syncing YouTube videos for exercises...')
        const youtubeResult = await syncYouTubeVideos(supabase)
        results.youtube = youtubeResult
        console.log(`✅ YouTube sync complete: ${youtubeResult.synced} synced, ${youtubeResult.errors} errors`)
      } catch (error) {
        console.error('❌ YouTube sync failed:', error)
        results.youtube.errors = 1
      }
    }

    results.total = results.exercisedb.synced + results.youtube.synced

    return NextResponse.json<ApiResponse<typeof results>>({
      success: true,
      data: results,
      message: `Sync complete: ${results.total} items synced`
    })

  } catch (error) {
    console.error('Error in exercises sync:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to sync exercises'
    }, { status: 500 })
  }
}

// GET /api/exercises/sync - Get sync status and statistics
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    // Get exercise counts
    const { count: totalExercises } = await supabase
      .from('exercises')
      .select('*', { count: 'exact', head: true })

    const { count: customExercises } = await supabase
      .from('exercises')
      .select('*', { count: 'exact', head: true })
      .eq('is_custom', true)

    const { count: externalExercises } = await supabase
      .from('exercises')
      .select('*', { count: 'exact', head: true })
      .eq('is_custom', false)

    const { count: exercisesWithVideos } = await supabase
      .from('exercises')
      .select('*', { count: 'exact', head: true })
      .not('video_url', 'is', null)

    const stats = {
      total_exercises: totalExercises || 0,
      custom_exercises: customExercises || 0,
      external_exercises: externalExercises || 0,
      exercises_with_videos: exercisesWithVideos || 0,
      video_coverage: totalExercises ? Math.round((exercisesWithVideos || 0) / totalExercises * 100) : 0
    }

    return NextResponse.json<ApiResponse<typeof stats>>({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error getting sync status:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to get sync status'
    }, { status: 500 })
  }
}

/**
 * Sync YouTube videos for existing exercises
 */
async function syncYouTubeVideos(supabase: any): Promise<{ synced: number; errors: number }> {
  let synced = 0
  let errors = 0

  try {
    // Get exercises without video URLs
    const { data: exercises, error: fetchError } = await supabase
      .from('exercises')
      .select('id, name, category, muscle_groups')
      .is('video_url', null)
      .limit(50) // Process in batches

    if (fetchError) {
      throw fetchError
    }

    if (!exercises || exercises.length === 0) {
      return { synced: 0, errors: 0 }
    }

    // Process each exercise
    for (const exercise of exercises) {
      try {
        // Search for demonstration videos
        const videos = await youtubeService.searchExerciseDemonstration(
          exercise.name,
          1 // Get only the best match
        )

        if (videos.length > 0) {
          const bestVideo = videos[0]
          
          // Update exercise with video URL
          const { error: updateError } = await supabase
            .from('exercises')
            .update({
              video_url: bestVideo.video_url,
              image_url: bestVideo.thumbnail_url
            })
            .eq('id', exercise.id)

          if (updateError) {
            console.error(`Error updating exercise ${exercise.id}:`, updateError)
            errors++
          } else {
            synced++
            console.log(`Added video for exercise: ${exercise.name}`)
          }
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200))

      } catch (error) {
        console.error(`Error processing exercise ${exercise.name}:`, error)
        errors++
      }
    }

    return { synced, errors }

  } catch (error) {
    console.error('Error syncing YouTube videos:', error)
    throw error
  }
}
