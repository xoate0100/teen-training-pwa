'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Dumbbell, 
  Target, 
  Zap, 
  TrendingUp, 
  Star,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { useExerciseDBIntegration } from '@/lib/hooks/use-exercisedb-integration';
import { ExerciseRecommendation, RecommendationContext } from '@/lib/services/exercisedb-integration';

export function ExerciseDBIntegrationDashboard() {
  const {
    exercises,
    categories,
    equipment,
    muscleGroups,
    recommendations,
    alternativeExercises,
    progressionExercises,
    searchExercises,
    getSmartRecommendations,
    getAlternativeExercises,
    getProgressionExercises,
    analyzeExerciseCompatibility,
    // getExerciseById,
    isLoading,
    error,
  } = useExerciseDBIntegration();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseRecommendation | null>(null);
  const [compatibilityAnalysis, setCompatibilityAnalysis] = useState<any>(null);
  const [recommendationContext, setRecommendationContext] = useState<RecommendationContext>({
    userLevel: 'beginner',
    availableEquipment: ['none'],
    targetMuscleGroups: [],
    sessionType: 'strength',
    previousExercises: [],
    preferences: {
      difficulty: 'moderate',
      duration: 'medium',
      intensity: 'medium',
    },
    limitations: {
      injuries: [],
      restrictions: [],
    },
  });

  // Search exercises
  const handleSearch = async () => {
    const filters: any = {};
    if (selectedCategory) filters.category = selectedCategory;
    if (selectedDifficulty) filters.difficulty = selectedDifficulty;
    if (selectedEquipment) filters.equipment = [selectedEquipment];
    if (selectedMuscleGroup) filters.muscleGroups = [selectedMuscleGroup];
    
    await searchExercises(searchQuery, filters);
  };

  // Get smart recommendations
  const handleGetRecommendations = async () => {
    await getSmartRecommendations(recommendationContext, 5);
  };

  // Get alternative exercises
  const handleGetAlternatives = async (exerciseId: string) => {
    await getAlternativeExercises(exerciseId, recommendationContext);
  };

  // Get progression exercises
  const handleGetProgressions = async (exerciseId: string) => {
    await getProgressionExercises(exerciseId, recommendationContext);
  };

  // Analyze compatibility
  const handleAnalyzeCompatibility = async (exerciseId: string) => {
    const analysis = await analyzeExerciseCompatibility(exerciseId, recommendationContext);
    setCompatibilityAnalysis(analysis);
  };

  // Select exercise
  const handleSelectExercise = (exercise: ExerciseRecommendation) => {
    setSelectedExercise(exercise);
    handleAnalyzeCompatibility(exercise.id);
  };

  const formatDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // const getCompatibilityColor = (compatibility: number) => {
  //   if (compatibility >= 80) return 'text-green-600';
  //   if (compatibility >= 60) return 'text-yellow-600';
  //   return 'text-red-600';
  // };

  const getCompatibilityBadge = (compatibility: number) => {
    if (compatibility >= 80) return 'bg-green-100 text-green-800';
    if (compatibility >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Exercise Search & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <Input
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All difficulties</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Equipment</label>
                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger>
                    <SelectValue placeholder="All equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All equipment</SelectItem>
                    {equipment.map(eq => (
                      <SelectItem key={eq} value={eq}>
                        {eq === 'none' ? 'No Equipment' : eq.charAt(0).toUpperCase() + eq.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Muscle Group</label>
                <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="All muscle groups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All muscle groups</SelectItem>
                    {muscleGroups.map(mg => (
                      <SelectItem key={mg} value={mg}>
                        {mg.charAt(0).toUpperCase() + mg.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Recommendation Context */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Recommendation Context</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">User Level</label>
                  <Select 
                    value={recommendationContext.userLevel} 
                    onValueChange={(value: any) => setRecommendationContext(prev => ({ ...prev, userLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Session Type</label>
                  <Select 
                    value={recommendationContext.sessionType} 
                    onValueChange={(value: any) => setRecommendationContext(prev => ({ ...prev, sessionType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="volleyball">Volleyball</SelectItem>
                      <SelectItem value="plyometric">Plyometric</SelectItem>
                      <SelectItem value="recovery">Recovery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button onClick={handleGetRecommendations} disabled={isLoading}>
                    <Zap className="h-4 w-4 mr-2" />
                    Get Recommendations
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Exercise Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exercise List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Exercises ({exercises.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {exercises.map(exercise => (
                <div
                  key={exercise.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedExercise?.id === exercise.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectExercise(exercise)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getDifficultyColor(exercise.difficulty)}>
                          {formatDifficulty(exercise.difficulty)}
                        </Badge>
                        <Badge variant="outline">{exercise.category}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3" />
                        {exercise.metadata.popularity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exercise Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Exercise Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedExercise ? (
              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold">{selectedExercise.name}</h3>
                  <p className="text-muted-foreground mt-1">{selectedExercise.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getDifficultyColor(selectedExercise.difficulty)}>
                      {formatDifficulty(selectedExercise.difficulty)}
                    </Badge>
                    <Badge variant="outline">{selectedExercise.category}</Badge>
                  </div>
                </div>

                {/* Compatibility Analysis */}
                {compatibilityAnalysis && (
                  <div>
                    <h4 className="font-medium mb-2">Compatibility Analysis</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">Compatibility:</span>
                      <Badge className={getCompatibilityBadge(compatibilityAnalysis.compatibility)}>
                        {compatibilityAnalysis.compatibility}%
                      </Badge>
                    </div>
                    
                    {compatibilityAnalysis.reasons.length > 0 && (
                      <div className="mb-2">
                        <h5 className="text-sm font-medium mb-1">Reasons:</h5>
                        <ul className="text-sm text-muted-foreground">
                          {compatibilityAnalysis.reasons.map((reason: string, index: number) => (
                            <li key={index}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {compatibilityAnalysis.warnings.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Warnings:</h5>
                        <ul className="text-sm text-red-600">
                          {compatibilityAnalysis.warnings.map((warning: string, index: number) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Equipment & Muscle Groups */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Equipment</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedExercise.equipment.map(eq => (
                        <Badge key={eq} variant="outline">
                          {eq === 'none' ? 'No Equipment' : eq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Muscle Groups</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedExercise.muscleGroups.map(mg => (
                        <Badge key={mg} variant="outline">
                          {mg}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="font-medium mb-2">Instructions</h4>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index}>{index + 1}. {instruction}</li>
                    ))}
                  </ol>
                </div>

                {/* Tips */}
                <div>
                  <h4 className="font-medium mb-2">Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedExercise.tips.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGetAlternatives(selectedExercise.id)}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Alternatives
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGetProgressions(selectedExercise.id)}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Progressions
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Select an exercise to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Smart Recommendations ({recommendations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map(exercise => (
                <div
                  key={exercise.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectExercise(exercise)}
                >
                  <h4 className="font-medium">{exercise.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {formatDifficulty(exercise.difficulty)}
                    </Badge>
                    <Badge variant="outline">{exercise.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alternative Exercises */}
      {alternativeExercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Alternative Exercises ({alternativeExercises.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alternativeExercises.map(exercise => (
                <div
                  key={exercise.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectExercise(exercise)}
                >
                  <h4 className="font-medium">{exercise.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {formatDifficulty(exercise.difficulty)}
                    </Badge>
                    <Badge variant="outline">{exercise.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progression Exercises */}
      {progressionExercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progression Exercises ({progressionExercises.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progressionExercises.map(exercise => (
                <div
                  key={exercise.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectExercise(exercise)}
                >
                  <h4 className="font-medium">{exercise.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {formatDifficulty(exercise.difficulty)}
                    </Badge>
                    <Badge variant="outline">{exercise.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
