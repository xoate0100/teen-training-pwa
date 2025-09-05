"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Volume2, VolumeX, Eye, Type, Palette, Zap, Settings, Sun, Moon, Contrast } from "lucide-react"

interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  reducedMotion: boolean
  audioFeedback: boolean
  voiceInstructions: boolean
  colorBlindMode: string
  theme: "light" | "dark" | "auto"
  focusIndicators: boolean
}

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
    audioFeedback: true,
    voiceInstructions: false,
    colorBlindMode: "none",
    theme: "auto",
    focusIndicators: true,
  })

  useEffect(() => {
    // Load saved accessibility settings
    const saved = localStorage.getItem("accessibilitySettings")
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    // Apply accessibility settings to document
    document.documentElement.style.fontSize = `${settings.fontSize}px`
    document.documentElement.classList.toggle("high-contrast", settings.highContrast)
    document.documentElement.classList.toggle("reduced-motion", settings.reducedMotion)
    document.documentElement.classList.toggle("focus-indicators", settings.focusIndicators)

    // Save settings
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings))
  }, [settings])

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        aria-label="Open accessibility settings"
      >
        <Settings className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Type className="h-4 w-4" />
                Text Size
              </label>
              <Badge variant="outline">{settings.fontSize}px</Badge>
            </div>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([value]) => updateSetting("fontSize", value)}
              min={12}
              max={24}
              step={2}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">Sample text at current size</div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Contrast className="h-4 w-4" />
              High Contrast Mode
            </label>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSetting("highContrast", checked)}
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Reduce Animations
            </label>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
            />
          </div>

          {/* Audio Feedback */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Sound Effects
            </label>
            <Switch
              checked={settings.audioFeedback}
              onCheckedChange={(checked) => updateSetting("audioFeedback", checked)}
            />
          </div>

          {/* Voice Instructions */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <VolumeX className="h-4 w-4" />
              Voice Instructions
            </label>
            <Switch
              checked={settings.voiceInstructions}
              onCheckedChange={(checked) => updateSetting("voiceInstructions", checked)}
            />
          </div>

          {/* Theme Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "auto", label: "Auto", icon: Settings },
              ].map((theme) => (
                <Button
                  key={theme.value}
                  variant={settings.theme === theme.value ? "default" : "outline"}
                  onClick={() => updateSetting("theme", theme.value)}
                  className="flex flex-col gap-1 h-16"
                >
                  <theme.icon className="h-4 w-4" />
                  <span className="text-xs">{theme.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Color Blind Support */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Color Blind Support</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "none", label: "Standard" },
                { value: "protanopia", label: "Red-Green" },
                { value: "deuteranopia", label: "Green-Red" },
                { value: "tritanopia", label: "Blue-Yellow" },
              ].map((mode) => (
                <Button
                  key={mode.value}
                  variant={settings.colorBlindMode === mode.value ? "default" : "outline"}
                  onClick={() => updateSetting("colorBlindMode", mode.value)}
                  className="text-xs h-10"
                >
                  {mode.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Focus Indicators */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enhanced Focus Indicators</label>
            <Switch
              checked={settings.focusIndicators}
              onCheckedChange={(checked) => updateSetting("focusIndicators", checked)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Close
            </Button>
            <Button
              onClick={() => {
                // Reset to defaults
                setSettings({
                  fontSize: 16,
                  highContrast: false,
                  reducedMotion: false,
                  audioFeedback: true,
                  voiceInstructions: false,
                  colorBlindMode: "none",
                  theme: "auto",
                  focusIndicators: true,
                })
              }}
              variant="outline"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
