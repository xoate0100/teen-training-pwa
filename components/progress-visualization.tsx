"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Target, Award } from "lucide-react"
import { StorageManager } from "@/lib/storage"

interface ProgressData {
  date: string
  broadJump: number
  verticalReach: number
  sprintTime: number
  serveAccuracy: number
  passingQuality: number
  avgRPE: number
  totalVolume: number
}

export function ProgressVisualization() {
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [selectedMetric, setSelectedMetric] = useState<keyof ProgressData>("broadJump")
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month")

  const metrics = [
    { key: "broadJump", label: "Broad Jump", unit: "inches", icon: "🦘", target: 60 },
    { key: "verticalReach", label: "Vertical Reach", unit: "inches", icon: "⬆️", target: 24 },
    { key: "sprintTime", label: "10-Yard Sprint", unit: "seconds", icon: "🏃", target: 2.5, inverse: true },
    { key: "serveAccuracy", label: "Serve Accuracy", unit: "%", icon: "🎯", target: 80 },
    { key: "passingQuality", label: "Passing Quality", unit: "/3", icon: "🏐", target: 2.5 },
    { key: "avgRPE", label: "Average RPE", unit: "/10", icon: "💪", target: 6 },
  ]

  useEffect(() => {
    // Generate mock progress data based on stored sessions
    const storage = StorageManager.getInstance()
    const sessions = storage.getAllSessions()
    const checkIns = storage.getAllCheckIns()

    // Create weekly progress data
    const weeks = []
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 84) // 12 weeks ago

    for (let i = 0; i < 12; i++) {
      const weekDate = new Date(startDate)
      weekDate.setDate(weekDate.getDate() + i * 7)

      // Simulate progressive improvement
      const progress = i / 11 // 0 to 1 over 12 weeks

      weeks.push({
        date: weekDate.toISOString().split("T")[0],
        broadJump: Math.round(45 + progress * 20 + (Math.random() * 4 - 2)), // 45-65 inches
        verticalReach: Math.round(18 + progress * 8 + (Math.random() * 2 - 1)), // 18-26 inches
        sprintTime: Number((3.2 - progress * 0.7 + (Math.random() * 0.2 - 0.1)).toFixed(2)), // 3.2-2.5 seconds
        serveAccuracy: Math.round(60 + progress * 25 + (Math.random() * 10 - 5)), // 60-85%
        passingQuality: Number((1.5 + progress * 1.2 + (Math.random() * 0.3 - 0.15)).toFixed(1)), // 1.5-2.7
        avgRPE: Number((7 - progress * 1.5 + (Math.random() * 1 - 0.5)).toFixed(1)), // 7-5.5
        totalVolume: Math.round(1000 + progress * 800 + (Math.random() * 200 - 100)), // 1000-1800 lbs
      })
    }

    setProgressData(weeks)
  }, [])

  const getFilteredData = () => {
    const now = new Date()
    const cutoffDate = new Date()

    switch (timeRange) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7)
        break
      case "month":
        cutoffDate.setDate(now.getDate() - 30)
        break
      case "all":
        cutoffDate.setDate(now.getDate() - 365)
        break
    }

    return progressData.filter((d) => new Date(d.date) >= cutoffDate)
  }

  const getCurrentMetric = () => {
    return metrics.find((m) => m.key === selectedMetric)!
  }

  const getLatestValue = () => {
    const data = getFilteredData()
    return data.length > 0 ? data[data.length - 1][selectedMetric] : 0
  }

  const getTrend = () => {
    const data = getFilteredData()
    if (data.length < 2) return 0

    const latest = data[data.length - 1][selectedMetric] as number
    const previous = data[data.length - 2][selectedMetric] as number
    const metric = getCurrentMetric()

    if (metric.inverse) {
      return previous - latest // For metrics where lower is better
    }
    return latest - previous
  }

  const getProgressToTarget = () => {
    const latest = getLatestValue() as number
    const metric = getCurrentMetric()
    const target = metric.target

    if (metric.inverse) {
      return Math.max(0, Math.min(100, ((target - latest) / target) * 100))
    }
    return Math.max(0, Math.min(100, (latest / target) * 100))
  }

  const trend = getTrend()
  const progressPercent = getProgressToTarget()

  return (
    <div className="space-y-6">
      {/* Metric Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {metrics.map((metric) => (
          <Button
            key={metric.key}
            variant={selectedMetric === metric.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMetric(metric.key as keyof ProgressData)}
            className="h-auto p-2 flex flex-col items-center"
          >
            <span className="text-lg mb-1">{metric.icon}</span>
            <span className="text-xs text-center">{metric.label}</span>
          </Button>
        ))}
      </div>

      {/* Time Range Selection */}
      <div className="flex justify-center space-x-2">
        {(["week", "month", "all"] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range === "week" ? "7 Days" : range === "month" ? "30 Days" : "All Time"}
          </Button>
        ))}
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current</p>
                <p className="text-2xl font-bold">
                  {getLatestValue()} {getCurrentMetric().unit}
                </p>
              </div>
              <span className="text-2xl">{getCurrentMetric().icon}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trend</p>
                <p className={`text-2xl font-bold flex items-center ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {trend >= 0 ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
                  {Math.abs(trend).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Target Progress</p>
                <p className="text-2xl font-bold">{progressPercent.toFixed(0)}%</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <Target className="w-6 h-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">{getCurrentMetric().icon}</span>
            {getCurrentMetric().label} Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getFilteredData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value) => [`${value} ${getCurrentMetric().unit}`, getCurrentMetric().label]}
                />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Badge variant="secondary" className="p-2 flex flex-col items-center">
              <span className="text-lg mb-1">🎯</span>
              <span className="text-xs">Target Hit</span>
            </Badge>
            <Badge variant="secondary" className="p-2 flex flex-col items-center">
              <span className="text-lg mb-1">📈</span>
              <span className="text-xs">Personal Best</span>
            </Badge>
            <Badge variant="secondary" className="p-2 flex flex-col items-center">
              <span className="text-lg mb-1">🔥</span>
              <span className="text-xs">7-Day Streak</span>
            </Badge>
            <Badge variant="secondary" className="p-2 flex flex-col items-center">
              <span className="text-lg mb-1">💪</span>
              <span className="text-xs">Consistency</span>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
