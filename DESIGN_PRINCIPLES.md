# Design Principles for Teen Training PWA

## Core UX Philosophy: ADHD-Friendly Athletic Training

### 1. **Visual Hierarchy & Contrast**

**Problem Solved**: Poor contrast ratios and unclear visual priorities
**Implementation**:

- High contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text)
- Enhanced slider visibility with thick tracks (h-4) and large thumbs (h-8, w-8)
- White slider thumbs with primary color borders for maximum visibility
- Clear visual separation between interactive and static elements

**Code Pattern**:
\`\`\`css
[&_[role=slider]]:bg-white
[&_[role=slider]]:border-4
[&_[role=slider]]:border-primary
[&_[role=slider]]:shadow-lg
[&_.slider-track]:bg-gray-200
[&_.slider-track]:h-4
\`\`\`

### 2. **Touch Target Optimization**

**Problem Solved**: Small, hard-to-tap interactive elements
**Implementation**:

- Minimum 44px (h-12) touch targets for all interactive elements
- Generous padding and spacing between clickable areas
- Large, prominent primary action buttons (h-14)
- Emoji buttons with substantial padding (p-4)

### 3. **Cognitive Load Reduction**

**Problem Solved**: Information overload and decision fatigue
**Implementation**:

- Single-focus cards with clear primary actions
- Progressive disclosure (show only what's needed now)
- Visual grouping with consistent spacing (space-y-6, space-y-4)
- Emoji-enhanced labels to reduce text processing

### 4. **Immediate Feedback Systems**

**Problem Solved**: Unclear interaction states and system responses
**Implementation**:

- Scale animations on selection (scale-105)
- Color state changes with smooth transitions
- Large, visible badges for current values
- Celebration animations for completed actions

### 5. **ADHD-Specific Accommodations**

**Problem Solved**: Attention and focus challenges
**Implementation**:

- High-contrast visual cues
- Emoji-based communication to reduce text processing
- Clear completion states with checkmarks
- Consistent interaction patterns across the app

## Color System Guidelines

### Primary Palette

- **Primary**: Used for active states, CTAs, and progress indicators
- **Secondary**: Used for badges, inactive states, and supporting elements
- **Muted**: Used for backgrounds and subtle separations

### Contrast Requirements

- Text on background: minimum 4.5:1 ratio
- Interactive elements: minimum 3:1 ratio
- Slider components: white thumbs on colored tracks for maximum visibility

## Typography Scale

### Hierarchy

- **Headers**: text-2xl (32px) for main titles
- **Card Titles**: text-lg (18px) for section headers
- **Body Text**: text-sm (14px) for labels and descriptions
- **Interactive Labels**: text-base (16px) for button text

### Weight System

- **Bold (font-bold)**: For headers and important labels
- **Semibold (font-semibold)**: For card titles and emphasis
- **Medium (font-medium)**: For interactive element labels

## Layout Patterns

### Card Structure

\`\`\`tsx
<Card className="border-2 border-primary/20">
<CardHeader>
<CardTitle className="flex items-center gap-2 text-lg">
<Icon />
Title
</CardTitle>
</CardHeader>
<CardContent className="space-y-6">
{/_ Content with consistent spacing _/}
</CardContent>
</Card>
\`\`\`

### Interactive Element Pattern

\`\`\`tsx
<Button
variant={isActive ? "default" : "outline"}
size="lg"
className="h-12 text-base font-semibold"

> Content
> </Button>
> \`\`\`

## Responsive Design

### Mobile-First Approach

- Base styles optimized for mobile (320px+)
- Touch-friendly sizing by default
- Vertical layouts with adequate spacing

### Breakpoint Strategy

- sm: 640px+ (larger phones)
- md: 768px+ (tablets)
- lg: 1024px+ (desktop)

## Accessibility Standards

### WCAG 2.1 AA Compliance

- Color contrast ratios meet or exceed requirements
- All interactive elements have focus states
- Semantic HTML structure with proper headings
- Alternative text for all meaningful images

### ADHD-Specific Features

- Reduced motion options (to be implemented)
- High contrast mode support
- Clear visual hierarchy
- Consistent interaction patterns

## Animation Guidelines

### Micro-Interactions

- Subtle scale transforms (scale-105) for button presses
- Smooth transitions (transition-all) for state changes
- Celebration animations for achievements
- Loading states with clear progress indicators

### Performance Considerations

- CSS transforms over position changes
- Minimal animation duration (200-300ms)
- Respect user's motion preferences

## Implementation Checklist

### For Each New Component:

- [ ] Meets minimum touch target size (44px)
- [ ] Has proper contrast ratios
- [ ] Includes hover and focus states
- [ ] Uses consistent spacing system
- [ ] Follows established color patterns
- [ ] Includes appropriate feedback mechanisms

### For Each New Feature:

- [ ] Reduces cognitive load
- [ ] Provides clear completion states
- [ ] Uses familiar interaction patterns
- [ ] Includes appropriate visual hierarchy
- [ ] Supports ADHD-friendly design principles

## Future Enhancements

### Phase 1 (Immediate)

- Implement haptic feedback for mobile interactions
- Add sound effects for achievements
- Enhance loading states with progress indicators

### Phase 2 (Short-term)

- Dark mode optimization
- Reduced motion preferences
- Voice input capabilities
- Gesture-based navigation

### Phase 3 (Long-term)

- Personalized UI adaptations based on user behavior
- Advanced accessibility features
- Multi-language support with cultural considerations
