import { ProgressChart } from "@/components/progress-chart"

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Progress Tracking</h1>
        <p className="text-muted-foreground">Your athletic development journey</p>
      </div>

      <ProgressChart />
    </div>
  )
}
