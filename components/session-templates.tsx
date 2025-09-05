"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Target, Zap, Users } from "lucide-react"

// Session template data based on 11-week program structure
const sessionTemplates = {
  "lower-body-am": {
    id: "lower-body-am",
    name: "Lower Body Strength",
    schedule: "Monday & Thursday AM",
    duration: "45-60 minutes",
    focus: "Strength & Power Development",
    icon: Target,
    color: "bg-blue-500",
    warmup: [
      { name: "Dynamic Warm-up", duration: "8-10 min", reps: "2 rounds" },
      { name: "Activation Circuit", duration: "5 min", reps: "10 each" },
    ],
    mainWork: [
      { name: "Goblet Squat", sets: "3", reps: "8-12", load: "Moderate", rest: "90s" },
      { name: "Single-Leg RDL", sets: "3", reps: "6-8 each", load: "Light", rest: "60s" },
      { name: "Lateral Lunge", sets: "2", reps: "8-10 each", load: "Bodyweight", rest: "60s" },
      { name: "Calf Raises", sets: "2", reps: "15-20", load: "Bodyweight", rest: "45s" },
    ],
    conditioning: [
      { name: "Jump Training", duration: "10 min", type: "Plyometric" },
      { name: "Agility Ladder", duration: "5 min", type: "Speed" },
    ],
    cooldown: [{ name: "Static Stretching", duration: "8-10 min", focus: "Lower body" }],
  },
  "upper-body-am": {
    id: "upper-body-am",
    name: "Upper Body Strength",
    schedule: "Tuesday AM",
    duration: "45-60 minutes",
    focus: "Upper Body Power & Stability",
    icon: Zap,
    color: "bg-green-500",
    warmup: [
      { name: "Arm Circles & Shoulder Prep", duration: "5 min", reps: "10 each direction" },
      { name: "Band Pull-Aparts", duration: "3 min", reps: "15-20" },
    ],
    mainWork: [
      { name: "Push-ups", sets: "3", reps: "8-15", load: "Bodyweight", rest: "90s" },
      { name: "Dumbbell Row", sets: "3", reps: "8-12", load: "Moderate", rest: "90s" },
      { name: "Overhead Press", sets: "2", reps: "6-10", load: "Light", rest: "90s" },
      { name: "Plank Hold", sets: "2", reps: "30-45s", load: "Bodyweight", rest: "60s" },
    ],
    conditioning: [
      { name: "Medicine Ball Throws", duration: "8 min", type: "Power" },
      { name: "Core Circuit", duration: "7 min", type: "Stability" },
    ],
    cooldown: [{ name: "Upper Body Stretching", duration: "8-10 min", focus: "Shoulders & chest" }],
  },
  "full-body-am": {
    id: "full-body-am",
    name: "Full Body Endurance",
    schedule: "Wednesday & Saturday AM",
    duration: "50-65 minutes",
    focus: "Strength Endurance & Conditioning",
    icon: Users,
    color: "bg-purple-500",
    warmup: [
      { name: "Full Body Dynamic Warm-up", duration: "10 min", reps: "2 rounds" },
      { name: "Movement Prep", duration: "5 min", reps: "8-10 each" },
    ],
    mainWork: [
      { name: "Squat to Press", sets: "3", reps: "10-15", load: "Light", rest: "60s" },
      { name: "Reverse Lunge + Row", sets: "3", reps: "8-12 each", load: "Light", rest: "60s" },
      { name: "Burpees", sets: "2", reps: "5-8", load: "Bodyweight", rest: "90s" },
      { name: "Mountain Climbers", sets: "2", reps: "20-30", load: "Bodyweight", rest: "45s" },
    ],
    conditioning: [
      { name: "Circuit Training", duration: "15 min", type: "Endurance" },
      { name: "Cardio Intervals", duration: "8 min", type: "Conditioning" },
    ],
    cooldown: [{ name: "Full Body Stretching", duration: "10-12 min", focus: "All major muscles" }],
  },
  "skills-pm": {
    id: "skills-pm",
    name: "Skills & Conditioning",
    schedule: "Monday, Tuesday, Thursday PM",
    duration: "60-75 minutes",
    focus: "Volleyball Skills & Game Conditioning",
    icon: Clock,
    color: "bg-orange-500",
    warmup: [
      { name: "Sport-Specific Warm-up", duration: "10 min", reps: "Dynamic movements" },
      { name: "Ball Handling", duration: "5 min", reps: "Various touches" },
    ],
    mainWork: [
      { name: "Serving Practice", sets: "3", reps: "10-15 serves", load: "Technique focus", rest: "2 min" },
      { name: "Passing Drills", sets: "4", reps: "20 passes", load: "Accuracy focus", rest: "90s" },
      { name: "Setting Practice", sets: "3", reps: "15-20 sets", load: "Precision focus", rest: "90s" },
      { name: "Approach & Attack", sets: "3", reps: "8-12 attacks", load: "Power focus", rest: "2 min" },
    ],
    conditioning: [
      { name: "Court Movement Drills", duration: "12 min", type: "Agility" },
      { name: "Game Simulation", duration: "15 min", type: "Match Play" },
    ],
    cooldown: [{ name: "Volleyball-Specific Stretching", duration: "10 min", focus: "Shoulders & legs" }],
  },
}

interface SessionTemplateProps {
  templateId?: keyof typeof sessionTemplates
  onStartSession?: (template: any) => void
}

export function SessionTemplates({ templateId, onStartSession }: SessionTemplateProps) {
  if (templateId && sessionTemplates[templateId]) {
    return <SessionTemplateDetail template={sessionTemplates[templateId]} onStartSession={onStartSession} />
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(sessionTemplates).map((template) => (
          <SessionTemplateCard key={template.id} template={template} onStartSession={onStartSession} />
        ))}
      </div>
    </div>
  )
}

function SessionTemplateCard({
  template,
  onStartSession,
}: { template: any; onStartSession?: (template: any) => void }) {
  const IconComponent = template.icon

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${template.color} text-white`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{template.schedule}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {template.duration}
          </div>
        </div>

        <div>
          <Badge variant="secondary" className="text-xs">
            {template.focus}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Main Work:</span> {template.mainWork.length} exercises
          </div>
          <div>
            <span className="font-medium">Conditioning:</span> {template.conditioning.length} activities
          </div>
        </div>

        <Button className="w-full mt-4" onClick={() => onStartSession?.(template)}>
          Start Session
        </Button>
      </CardContent>
    </Card>
  )
}

function SessionTemplateDetail({
  template,
  onStartSession,
}: { template: any; onStartSession?: (template: any) => void }) {
  const IconComponent = template.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${template.color} text-white`}>
          <IconComponent className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{template.name}</h1>
          <p className="text-muted-foreground">
            {template.schedule} • {template.duration}
          </p>
          <Badge variant="secondary" className="mt-1">
            {template.focus}
          </Badge>
        </div>
      </div>

      {/* Session Structure */}
      <div className="grid gap-6">
        {/* Warm-up */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">🔥 Warm-up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {template.warmup.map((exercise: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="font-medium">{exercise.name}</span>
                  <div className="text-sm text-muted-foreground">
                    {exercise.duration} • {exercise.reps}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Work */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">💪 Main Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {template.mainWork.map((exercise: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <div>
                    <span className="font-medium">{exercise.name}</span>
                    <div className="text-sm text-muted-foreground">
                      {exercise.sets} sets • {exercise.reps} reps • {exercise.load}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Rest: {exercise.rest}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conditioning */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">⚡ Conditioning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {template.conditioning.map((activity: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="font-medium">{activity.name}</span>
                  <div className="text-sm text-muted-foreground">
                    {activity.duration} • {activity.type}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cool-down */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">🧘 Cool-down</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {template.cooldown.map((exercise: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="font-medium">{exercise.name}</span>
                  <div className="text-sm text-muted-foreground">
                    {exercise.duration} • {exercise.focus}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Start Session Button */}
      <Button size="lg" className="w-full" onClick={() => onStartSession?.(template)}>
        Start {template.name} Session
      </Button>
    </div>
  )
}
