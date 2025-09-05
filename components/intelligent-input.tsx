"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { StorageManager } from "@/lib/storage"

interface IntelligentInputProps {
  exerciseName: string
  currentSet: number
  onDataEntry: (data: { rpe: number; notes: string; weight?: number; reps?: number }) => void
}

export function IntelligentInput({ exerciseName, currentSet, onDataEntry }: IntelligentInputProps) {
  const [rpe, setRpe] = useState<number>(5)
  const [notes, setNotes] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [previousData, setPreviousData] = useState<any>(null)
  const [weight, setWeight] = useState<number>(0)
  const [reps, setReps] = useState<number>(0)

  // Quick-tap note options
  const quickNotes = [
    { text: "Felt great! 💪", emoji: "💪" },
    { text: "Too easy", emoji: "😴" },
    { text: "Perfect challenge", emoji: "🎯" },
    { text: "Tough but doable", emoji: "😤" },
    { text: "Really challenging", emoji: "🔥" },
    { text: "Need lighter weight", emoji: "⬇️" },
  ]

  useEffect(() => {
    // Load previous session data for this exercise
    const storage = StorageManager.getInstance()
    const sessions = storage.getAllSessions()
    const lastSession = sessions
      .filter((s) => s.exercises?.some((e) => e.name === exerciseName))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    if (lastSession) {
      const exercise = lastSession.exercises.find((e) => e.name === exerciseName)
      if (exercise && exercise.sets && exercise.sets.length > 0) {
        const lastSet = exercise.sets[exercise.sets.length - 1]
        setPreviousData(lastSet)
        // Pre-fill with previous data
        setRpe(lastSet.rpe || 5)
        setWeight(lastSet.weight || 0)
        setReps(lastSet.reps || 0)
      }
    }
  }, [exerciseName])

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser")
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase()

      // Parse voice commands
      if (transcript.includes("rpe") || transcript.includes("effort")) {
        const rpeMatch = transcript.match(/(\d+)/)
        if (rpeMatch) {
          setRpe(Number.parseInt(rpeMatch[1]))
        }
      }

      if (transcript.includes("weight")) {
        const weightMatch = transcript.match(/(\d+)/)
        if (weightMatch) {
          setWeight(Number.parseInt(weightMatch[1]))
        }
      }

      if (transcript.includes("reps")) {
        const repsMatch = transcript.match(/(\d+)/)
        if (repsMatch) {
          setReps(Number.parseInt(repsMatch[1]))
        }
      }

      // Add as notes if no specific command
      if (!transcript.includes("rpe") && !transcript.includes("weight") && !transcript.includes("reps")) {
        setNotes(transcript)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleQuickNote = (noteText: string) => {
    setNotes(noteText)
  }

  const handleSubmit = () => {
    onDataEntry({ rpe, notes, weight: weight || undefined, reps: reps || undefined })
  }

  const getRpeColor = (value: number) => {
    if (value <= 3) return "text-green-500"
    if (value <= 5) return "text-yellow-500"
    if (value <= 7) return "text-orange-500"
    return "text-red-500"
  }

  const getRpeDescription = (value: number) => {
    const descriptions = {
      1: "Very Easy",
      2: "Easy",
      3: "Moderate",
      4: "Somewhat Hard",
      5: "Hard",
      6: "Harder",
      7: "Very Hard",
      8: "Very Very Hard",
      9: "Extremely Hard",
      10: "Maximum Effort",
    }
    return descriptions[value as keyof typeof descriptions] || "Unknown"
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">Set {currentSet} Complete!</CardTitle>
        {previousData && (
          <div className="text-sm text-muted-foreground">
            Last time: {previousData.weight}lbs × {previousData.reps} reps (RPE {previousData.rpe})
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weight and Reps Input */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Weight (lbs)</label>
            <div className="flex items-center space-x-2 mt-1">
              <Button variant="outline" size="sm" onClick={() => setWeight(Math.max(0, weight - 5))}>
                -5
              </Button>
              <span className="text-lg font-bold min-w-[3rem] text-center">{weight}</span>
              <Button variant="outline" size="sm" onClick={() => setWeight(weight + 5)}>
                +5
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Reps</label>
            <div className="flex items-center space-x-2 mt-1">
              <Button variant="outline" size="sm" onClick={() => setReps(Math.max(0, reps - 1))}>
                -1
              </Button>
              <span className="text-lg font-bold min-w-[3rem] text-center">{reps}</span>
              <Button variant="outline" size="sm" onClick={() => setReps(reps + 1)}>
                +1
              </Button>
            </div>
          </div>
        </div>

        {/* RPE Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">How hard was that?</label>
            <span className={`text-lg font-bold ${getRpeColor(rpe)}`}>{rpe}/10</span>
          </div>
          <Slider
            value={[rpe]}
            onValueChange={(value) => setRpe(value[0])}
            max={10}
            min={1}
            step={1}
            className="mb-2"
          />
          <div className={`text-center text-sm ${getRpeColor(rpe)}`}>{getRpeDescription(rpe)}</div>
        </div>

        {/* Quick Notes */}
        <div>
          <label className="text-sm font-medium mb-2 block">Quick Notes</label>
          <div className="grid grid-cols-2 gap-2">
            {quickNotes.map((note, index) => (
              <Button
                key={index}
                variant={notes === note.text ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuickNote(note.text)}
                className="text-xs h-8"
              >
                {note.emoji} {note.text.split(" ")[0]}
              </Button>
            ))}
          </div>
        </div>

        {/* Voice Input */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleVoiceInput}
            disabled={isListening}
            className="flex-1 bg-transparent"
          >
            {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
            {isListening ? "Listening..." : "Voice Input"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(`Set ${currentSet} complete. RPE ${rpe}`)
              speechSynthesis.speak(utterance)
            }}
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Custom Notes */}
        {notes && !quickNotes.some((qn) => qn.text === notes) && (
          <div className="p-2 bg-muted rounded text-sm">
            <strong>Notes:</strong> {notes}
          </div>
        )}

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full" size="lg">
          Log Set & Continue
        </Button>
      </CardContent>
    </Card>
  )
}
