"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Play, Search, Filter, Plus } from "lucide-react"

// Mock exercise data structure (will be replaced with ExerciseDB API)
const mockExercises = [
  {
    id: 1,
    name: "Goblet Squat",
    bodyPart: "legs",
    equipment: "dumbbell",
    difficulty: "beginner",
    instructions: ["Hold dumbbell at chest", "Squat down keeping chest up", "Drive through heels to stand"],
    videoUrl: "/goblet-squat-demonstration.jpg",
    targetMuscles: ["quadriceps", "glutes", "core"],
  },
  {
    id: 2,
    name: "Push-ups",
    bodyPart: "chest",
    equipment: "bodyweight",
    difficulty: "beginner",
    instructions: ["Start in plank position", "Lower chest to ground", "Push back up to start"],
    videoUrl: "/push-up-demonstration.jpg",
    targetMuscles: ["chest", "shoulders", "triceps"],
  },
  {
    id: 3,
    name: "Dumbbell Row",
    bodyPart: "back",
    equipment: "dumbbell",
    difficulty: "intermediate",
    instructions: ["Hinge at hips", "Pull dumbbell to hip", "Lower with control"],
    videoUrl: "/dumbbell-row-demonstration.jpg",
    targetMuscles: ["lats", "rhomboids", "biceps"],
  },
  {
    id: 4,
    name: "Volleyball Serve Practice",
    bodyPart: "full body",
    equipment: "volleyball",
    difficulty: "intermediate",
    instructions: ["Toss ball consistently", "Contact at highest point", "Follow through across body"],
    videoUrl: "/volleyball-serve-technique.jpg",
    targetMuscles: ["shoulders", "core", "legs"],
  },
  {
    id: 5,
    name: "Lateral Bounds",
    bodyPart: "legs",
    equipment: "bodyweight",
    difficulty: "intermediate",
    instructions: ["Start on one foot", "Bound laterally to other foot", "Stick the landing"],
    videoUrl: "/lateral-bounds-plyometric.jpg",
    targetMuscles: ["glutes", "quadriceps", "calves"],
  },
]

const bodyParts = ["all", "legs", "chest", "back", "shoulders", "arms", "core", "full body"]
const equipment = ["all", "bodyweight", "dumbbell", "barbell", "volleyball", "resistance band"]
const difficulties = ["all", "beginner", "intermediate", "advanced"]

interface ExerciseLibraryProps {
  onSelectExercise?: (exercise: any) => void
  showAddButton?: boolean
}

export function ExerciseLibrary({ onSelectExercise, showAddButton = true }: ExerciseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBodyPart, setSelectedBodyPart] = useState("all")
  const [selectedEquipment, setSelectedEquipment] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredExercises = mockExercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.targetMuscles.some((muscle) => muscle.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesBodyPart = selectedBodyPart === "all" || exercise.bodyPart === selectedBodyPart
    const matchesEquipment = selectedEquipment === "all" || exercise.equipment === selectedEquipment
    const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty

    return matchesSearch && matchesBodyPart && matchesEquipment && matchesDifficulty
  })

  return (
    <div className="space-y-4">
      {/* Search and Filter Header */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search exercises or muscles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-primary text-primary-foreground" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
          {showAddButton && (
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg">
            <div>
              <label className="text-sm font-medium mb-2 block">Body Part</label>
              <select
                value={selectedBodyPart}
                onChange={(e) => setSelectedBodyPart(e.target.value)}
                className="w-full p-2 rounded border bg-background"
              >
                {bodyParts.map((part) => (
                  <option key={part} value={part}>
                    {part.charAt(0).toUpperCase() + part.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Equipment</label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full p-2 rounded border bg-background"
              >
                {equipment.map((eq) => (
                  <option key={eq} value={eq}>
                    {eq.charAt(0).toUpperCase() + eq.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-2 rounded border bg-background"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} onSelect={() => onSelectExercise?.(exercise)} />
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No exercises found matching your criteria.</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  )
}

interface ExerciseCardProps {
  exercise: any
  onSelect?: () => void
}

function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onSelect}>
      <CardHeader className="pb-2">
        <div className="relative">
          <img
            src={exercise.videoUrl || "/placeholder.svg"}
            alt={exercise.name}
            className="w-full h-32 object-cover rounded-md bg-muted"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/50 hover:bg-black/70"
          >
            <Play className="h-5 w-5 text-white" />
          </Button>
        </div>
        <CardTitle className="text-lg">{exercise.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs">
            {exercise.bodyPart}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {exercise.equipment}
          </Badge>
          <Badge
            variant={
              exercise.difficulty === "beginner"
                ? "default"
                : exercise.difficulty === "intermediate"
                  ? "secondary"
                  : "destructive"
            }
            className="text-xs"
          >
            {exercise.difficulty}
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">Target Muscles:</p>
          <p>{exercise.targetMuscles.join(", ")}</p>
        </div>

        <div className="text-sm">
          <p className="font-medium mb-1">Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            {exercise.instructions.slice(0, 2).map((instruction, index) => (
              <li key={index} className="text-muted-foreground">
                {instruction}
              </li>
            ))}
          </ol>
          {exercise.instructions.length > 2 && (
            <p className="text-xs text-muted-foreground mt-1">+{exercise.instructions.length - 2} more steps</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
