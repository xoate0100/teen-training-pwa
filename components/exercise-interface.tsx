"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Check, Timer, Plus, Minus } from "lucide-react"

interface ExerciseSet {
  id: string
  reps: number
  weight: number
  rpe: number
  completed: boolean
  restTime?: number
}

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  load?: string
  instructions: string[]
}

interface ExerciseInterfaceProps {
  exercise: Exercise
  exerciseIndex: number
  totalExercises: number
  onComplete: (exerciseData: any) => void
  onNext: () => void
  onPrevious: () => void
}

export function ExerciseInterface({
  exercise,
  exerciseIndex,
  totalExercises,
  onComplete,
  onNext,
  onPrevious,
}: ExerciseInterfaceProps) {
  const [currentSet, setCurrentSet] = useState(0)
  const [sets, setSets] = useState<ExerciseSet[]>(() =>
    Array.from({ length: exercise.sets }, (_, i) => ({
      id: `${exercise.id}-set-${i + 1}`,
      reps: 0,
      weight: 0,
      rpe: 5,
      completed: false,
    })),
  )
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [notes, setNotes] = useState("")
  const [showRPE, setShowRPE] = useState(false)

  // Auto-advance rest timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isResting, restTimer])

  const handleSetComplete = () => {
    const updatedSets = [...sets]
    updatedSets[currentSet].completed = true
    setSets(updatedSets)
    setShowRPE(true)
  }

  const handleRPESubmit = (rpe: number) => {
    const updatedSets = [...sets]
    updatedSets[currentSet].rpe = rpe
    setSets(updatedSets)
    setShowRPE(false)

    // Start rest timer if not last set
    if (currentSet < exercise.sets - 1) {
      const recommendedRest = rpe >= 8 ? 120 : rpe >= 6 ? 90 : 60
      setRestTimer(recommendedRest)
      setIsResting(true)
      setCurrentSet(currentSet + 1)
    } else {
      // Exercise complete
      onComplete({
        exerciseId: exercise.id,
        sets: updatedSets,
        notes,
        completedAt: new Date(),
      })
    }
  }

  const updateSetValue = (field: "reps" | "weight", value: number) => {
    const updatedSets = [...sets]
    updatedSets[currentSet][field] = Math.max(0, value)
    setSets(updatedSets)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const allSetsCompleted = sets.every((set) => set.completed)
  const currentSetData = sets[currentSet]

  return (
    <div className="space-y-4">
      {/* Exercise Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{exercise.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Exercise {exerciseIndex + 1} of {totalExercises}
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              Set {currentSet + 1} / {exercise.sets}
            </Badge>
          </div>
          <Progress
            value={((currentSet + (currentSetData?.completed ? 1 : 0)) / exercise.sets) * 100}
            className="h-2"
          />
        </CardHeader>
      </Card>

      {/* Rest Timer */}
      {isResting && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Rest Time</span>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">{formatTime(restTimer)}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsResting(false)
                setRestTimer(0)
              }}
            >
              Skip Rest
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Set Input Interface */}
      {!isResting && !allSetsCompleted && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Set {currentSet + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Reps Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Reps</label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => updateSetValue("reps", currentSetData.reps - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={currentSetData.reps}
                  onChange={(e) => updateSetValue("reps", Number.parseInt(e.target.value) || 0)}
                  className="text-center text-lg font-semibold w-20"
                />
                <Button variant="outline" size="icon" onClick={() => updateSetValue("reps", currentSetData.reps + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">Target: {exercise.reps}</span>
              </div>
            </div>

            {/* Weight Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (lbs)</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateSetValue("weight", currentSetData.weight - 5)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={currentSetData.weight}
                  onChange={(e) => updateSetValue("weight", Number.parseInt(e.target.value) || 0)}
                  className="text-center text-lg font-semibold w-20"
                  step="5"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateSetValue("weight", currentSetData.weight + 5)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                {exercise.load && (
                  <span className="text-sm text-muted-foreground ml-2">Suggested: {exercise.load}</span>
                )}
              </div>
            </div>

            <Button onClick={handleSetComplete} className="w-full" disabled={currentSetData.reps === 0}>
              <Check className="h-4 w-4 mr-2" />
              Complete Set
            </Button>
          </CardContent>
        </Card>
      )}

      {/* RPE Rating */}
      {showRPE && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">How hard was that set?</CardTitle>
            <p className="text-sm text-muted-foreground">Rate your effort from 1 (very easy) to 10 (maximum effort)</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Slider
                value={[currentSetData.rpe]}
                onValueChange={([value]) => {
                  const updatedSets = [...sets]
                  updatedSets[currentSet].rpe = value
                  setSets(updatedSets)
                }}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Very Easy</span>
                <span className="font-semibold text-primary text-lg">{currentSetData.rpe}/10</span>
                <span>Max Effort</span>
              </div>
            </div>
            <Button onClick={() => handleRPESubmit(currentSetData.rpe)} className="w-full">
              Submit Rating
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Exercise Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {exercise.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </Badge>
                <span className="text-sm">{instruction}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="How did this exercise feel? Any adjustments needed?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onPrevious} disabled={exerciseIndex === 0} className="flex-1 bg-transparent">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} disabled={!allSetsCompleted} className="flex-1">
          Next Exercise
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
