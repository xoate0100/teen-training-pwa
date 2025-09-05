import OpenAI from 'openai'
import { DailyCheckIn, SetLog, Session } from '@/lib/types/database'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AdaptationRecommendation {
  intensity_adjustment: number // -1 to 1 scale
  rest_time_adjustment: number // multiplier
  exercise_substitutions: string[]
  motivational_message: string
  safety_notes: string[]
}

export interface WellnessData {
  mood: number
  energy_level: number
  sleep_hours: number
  muscle_soreness: number
  recent_rpe_trend: number[]
  recent_workout_frequency: number
}

/**
 * Analyze user's wellness data and recent performance to provide adaptation recommendations
 */
export async function analyzeWellnessAndAdapt(
  wellnessData: WellnessData,
  recentSessions: Session[],
  recentSetLogs: SetLog[]
): Promise<AdaptationRecommendation> {
  try {
    const prompt = `
You are an AI training coach for teenage athletes. Analyze the following data and provide adaptation recommendations:

Wellness Data:
- Mood: ${wellnessData.mood}/5
- Energy Level: ${wellnessData.energy_level}/10
- Sleep Hours: ${wellnessData.sleep_hours}
- Muscle Soreness: ${wellnessData.muscle_soreness}/5
- Recent RPE Trend: ${wellnessData.recent_rpe_trend.join(', ')}
- Recent Workout Frequency: ${wellnessData.recent_workout_frequency} sessions/week

Recent Performance:
- Sessions completed: ${recentSessions.length}
- Average RPE: ${recentSetLogs.length > 0 ? (recentSetLogs.reduce((sum, log) => sum + log.rpe, 0) / recentSetLogs.length).toFixed(1) : 'N/A'}

Provide recommendations in this JSON format:
{
  "intensity_adjustment": -0.2, // -1 to 1 scale (negative = reduce intensity)
  "rest_time_adjustment": 1.2, // multiplier (1.0 = no change, >1 = more rest)
  "exercise_substitutions": ["exercise1", "exercise2"], // alternative exercises if needed
  "motivational_message": "Encouraging message based on their data",
  "safety_notes": ["Note 1", "Note 2"] // safety considerations
}

Consider:
- High muscle soreness (4-5) = reduce intensity, increase rest
- Low energy (<4) = reduce intensity, focus on technique
- Poor sleep (<7 hours) = reduce intensity, increase rest
- High RPE trend (>7) = reduce intensity
- Low mood (<3) = motivational focus, lighter session
- Safety first - always prioritize injury prevention
`

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert youth athletic training coach with 20+ years experience. Focus on safety, proper progression, and maintaining motivation for teenage athletes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    const recommendation = JSON.parse(content) as AdaptationRecommendation

    // Validate the response structure
    if (typeof recommendation.intensity_adjustment !== 'number' ||
        typeof recommendation.rest_time_adjustment !== 'number' ||
        !Array.isArray(recommendation.exercise_substitutions) ||
        typeof recommendation.motivational_message !== 'string' ||
        !Array.isArray(recommendation.safety_notes)) {
      throw new Error('Invalid response format from OpenAI')
    }

    return recommendation

  } catch (error) {
    console.error('Error in AI adaptation analysis:', error)
    
    // Return safe default recommendations
    return {
      intensity_adjustment: 0,
      rest_time_adjustment: 1.0,
      exercise_substitutions: [],
      motivational_message: "Keep up the great work! Listen to your body and adjust as needed.",
      safety_notes: ["Always warm up properly", "Stop if you feel pain"]
    }
  }
}

/**
 * Generate personalized motivational messages based on performance trends
 */
export async function generateMotivationalMessage(
  performanceData: {
    streak_days: number
    recent_improvements: string[]
    upcoming_goals: string[]
    current_challenges: string[]
  }
): Promise<string> {
  try {
    const prompt = `
Generate a personalized motivational message for a teenage athlete based on:

- Current streak: ${performanceData.streak_days} days
- Recent improvements: ${performanceData.recent_improvements.join(', ')}
- Upcoming goals: ${performanceData.upcoming_goals.join(', ')}
- Current challenges: ${performanceData.current_challenges.join(', ')}

Make it:
- Age-appropriate for teens
- Encouraging but not overwhelming
- Specific to their achievements
- 1-2 sentences max
- Positive and motivating tone
`

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a motivational youth sports coach. Write encouraging, age-appropriate messages for teenage athletes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 100
    })

    return response.choices[0]?.message?.content || "Keep pushing forward! You're doing great!"

  } catch (error) {
    console.error('Error generating motivational message:', error)
    return "Keep pushing forward! You're doing great!"
  }
}

/**
 * Generate form cues for specific exercises
 */
export async function generateFormCues(
  exerciseName: string,
  commonMistakes: string[] = []
): Promise<string[]> {
  try {
    const prompt = `
Generate 3-5 key form cues for the exercise: ${exerciseName}

Common mistakes to address: ${commonMistakes.join(', ')}

Provide cues that are:
- Clear and concise (1-3 words each)
- Easy to remember during exercise
- Focus on safety and effectiveness
- Age-appropriate for teens

Format as a simple list, one cue per line.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert strength and conditioning coach. Provide clear, concise form cues for exercises."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 200
    })

    const content = response.choices[0]?.message?.content
    if (!content) return ["Keep good form", "Breathe properly", "Control the movement"]

    return content.split('\n')
      .map(cue => cue.trim())
      .filter(cue => cue.length > 0)
      .slice(0, 5) // Limit to 5 cues

  } catch (error) {
    console.error('Error generating form cues:', error)
    return ["Keep good form", "Breathe properly", "Control the movement"]
  }
}
