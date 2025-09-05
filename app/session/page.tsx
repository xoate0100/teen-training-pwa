"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Target } from "lucide-react"
import { ExerciseInterface } from "@/components/exercise-interface"
import { Button } from "@/components/ui/button"

const mockExercises = [
  {
    id: "1",
    name: "Goblet Squats",
    sets: 3,
    reps: "10-12",
    load: "25 lbs",
    instructions: [
      "Hold dumbbell at chest level",
      "Squat down keeping chest up",
      "Drive through heels to stand",
      "Control the descent (3 seconds down)",
    ],
  },
  {
    id: "2",
    name: "Push-ups",
    sets: 3,
    reps: "8-10",
    instructions: [
      "Start in plank position",
      "Lower chest to floor",
      "Push back to start position",
      "Keep core tight throughout",
    ],
  },
  {
    id: "3",
    name: "Single-Leg Glute Bridges",
    sets: 3,
    reps: "8 each leg",
    instructions: [
      "Lie on back, one foot on ground",
      "Lift other leg straight up",
      "Drive through heel to lift hips",
      "Squeeze glutes at the top",
    ],
  },
  {
    id: "4",
    name: "Plank Hold",
    sets: 3,
    reps: "30-45 sec",
    instructions: [
      "Start in forearm plank",
      "Keep body in straight line",
      "Breathe normally",
      "Focus on core engagement",
    ],
  },
]

export default function SessionPage() {
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [completedExercises, setCompletedExercises] = useState(0)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [exerciseData, setExerciseData] = useState<any[]>([])
  const [showAutoAdvance, setShowAutoAdvance] = useState(false)
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(3)

  useEffect(() => {
    if (!sessionStartTime) {
      setSessionStartTime(new Date())
    }
  }, [sessionStartTime])

  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionStartTime) {
        const now = new Date()
        const duration = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000)
        setSessionDuration(duration)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionStartTime])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const sessionProgress = (completedExercises / mockExercises.length) * 100

  const handleExerciseComplete = (data: any) => {
    const newExerciseData = [...exerciseData, data]
    setExerciseData(newExerciseData)
    setCompletedExercises((prev) => prev + 1)

    if (currentExercise < mockExercises.length - 1) {
      setShowAutoAdvance(true)
      setAutoAdvanceCountdown(3)

      const countdownInterval = setInterval(() => {
        setAutoAdvanceCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            setShowAutoAdvance(false)
            setCurrentExercise((prevEx) => prevEx + 1)
            return 3
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setSessionComplete(true)
    }
  }

  const handleNextExercise = () => {
    if (currentExercise < mockExercises.length - 1) {
      setCurrentExercise((prev) => prev + 1)
    }
  }

  const handlePreviousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise((prev) => prev - 1)
    }
  }

  const cancelAutoAdvance = () => {
    setShowAutoAdvance(false)
    setAutoAdvanceCountdown(3)
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md text-center border-2 border-primary/20 shadow-xl">
          <CardContent className="p-8">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold mb-4 text-primary">Amazing Work!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              You crushed all {mockExercises.length} exercises like a champion!
            </p>
            <div className="space-y-3 text-base bg-muted/50 p-4 rounded-lg mb-6">
              <div className="flex justify-between">
                <span className="font-medium">Total Time:</span>
                <span className="font-bold text-primary">{formatDuration(sessionDuration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Exercises Completed:</span>
                <span className="font-bold text-primary">{completedExercises}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">You Earned:</span>
                <span className="font-bold text-primary">+50 XP 🏆</span>
              </div>
            </div>
            <Button className="w-full h-14 text-lg font-semibold" onClick={() => (window.location.href = "/")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {showAutoAdvance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm text-center border-2 border-primary shadow-2xl">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">Great Job!</h3>
              <p className="text-muted-foreground mb-4">Moving to next exercise in...</p>
              <div className="text-6xl font-bold text-primary mb-4">{autoAdvanceCountdown}</div>
              <Button
                variant="outline"
                onClick={cancelAutoAdvance}
                className="w-full h-12 font-semibold bg-transparent"
              >
                Stay Here
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Lower-Body Strength</h1>
            <p className="text-muted-foreground">Monday Morning • Week 6</p>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            <Clock className="h-4 w-4 mr-1" />
            {formatDuration(sessionDuration)}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Session Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedExercises} / {mockExercises.length} exercises
                </span>
              </div>
              <Progress value={sessionProgress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Started{" "}
                  {sessionStartTime
                    ? sessionStartTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : ""}
                </span>
                <span>Est. 25-30 min total</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Coming Up Next
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {mockExercises.slice(currentExercise, currentExercise + 2).map((exercise, index) => (
                <div key={exercise.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={index === 0 ? "default" : "outline"}
                      className="w-6 h-6 p-0 flex items-center justify-center"
                    >
                      {currentExercise + index + 1}
                    </Badge>
                    <span className={`font-medium ${index === 0 ? "text-primary" : "text-muted-foreground"}`}>
                      {exercise.name}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {exercise.sets} × {exercise.reps}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <ExerciseInterface
        exercise={mockExercises[currentExercise]}
        exerciseIndex={currentExercise}
        totalExercises={mockExercises.length}
        onComplete={handleExerciseComplete}
        onNext={handleNextExercise}
        onPrevious={handlePreviousExercise}
      />
    </div>
  )
}
