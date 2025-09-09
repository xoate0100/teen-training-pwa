import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HierarchicalNavigation, MobileBottomNavigation } from '@/components/navigation/hierarchical-navigation';

// Mock the Icon component
vi.mock('@/components/svg-icons', () => ({
  Icon: ({ name, size }: { name: string; size: number }) => (
    <div data-testid={`icon-${name}`} data-size={size} />
  ),
}));

describe('HierarchicalNavigation', () => {
  const mockOnTabChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all primary navigation items', () => {
    render(
      <HierarchicalNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Session')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should highlight active tab', () => {
    render(
      <HierarchicalNavigation
        currentTab="session"
        onTabChange={mockOnTabChange}
      />
    );

    const sessionButton = screen.getByText('Session').closest('button');
    expect(sessionButton).toHaveClass('bg-primary');
  });

  it('should call onTabChange when tab is clicked', () => {
    render(
      <HierarchicalNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    fireEvent.click(screen.getByText('Session'));
    expect(mockOnTabChange).toHaveBeenCalledWith('session');
  });

  it('should toggle secondary navigation', () => {
    render(
      <HierarchicalNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    const toggleButton = screen.getByLabelText('Show advanced features');
    fireEvent.click(toggleButton);

    expect(screen.getByLabelText('Hide advanced features')).toBeInTheDocument();
  });

  it('should render secondary navigation items when expanded', () => {
    render(
      <HierarchicalNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    const toggleButton = screen.getByLabelText('Show advanced features');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('Social')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Wellness')).toBeInTheDocument();
    expect(screen.getByText('Smart')).toBeInTheDocument();
    expect(screen.getByText('Interactive')).toBeInTheDocument();
    expect(screen.getByText('Advanced UX')).toBeInTheDocument();
  });

  it('should show badge on achievements item', () => {
    render(
      <HierarchicalNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    const toggleButton = screen.getByLabelText('Show advanced features');
    fireEvent.click(toggleButton);

    expect(screen.getByText('3')).toBeInTheDocument(); // Badge for achievements
  });

  it('should highlight active secondary tab', () => {
    render(
      <HierarchicalNavigation
        currentTab="achievements"
        onTabChange={mockOnTabChange}
      />
    );

    const toggleButton = screen.getByLabelText('Show advanced features');
    fireEvent.click(toggleButton);

    const achievementsButton = screen.getByText('Achievements').closest('button');
    expect(achievementsButton).toHaveClass('bg-secondary');
  });

  it('should call onTabChange when secondary tab is clicked', () => {
    render(
      <HierarchicalNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    const toggleButton = screen.getByLabelText('Show advanced features');
    fireEvent.click(toggleButton);

    fireEvent.click(screen.getByText('Achievements'));
    expect(mockOnTabChange).toHaveBeenCalledWith('achievements');
  });

  it('should have proper accessibility attributes', () => {
    render(
      <HierarchicalNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    // Check aria-labels on buttons
    expect(screen.getByLabelText('Navigate to Dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Navigate to Session')).toBeInTheDocument();
    expect(screen.getByLabelText('Navigate to Exercises')).toBeInTheDocument();
    expect(screen.getByLabelText('Navigate to Progress')).toBeInTheDocument();
    expect(screen.getByLabelText('Navigate to Settings')).toBeInTheDocument();

    // Check toggle button accessibility
    const toggleButton = screen.getByLabelText('Show advanced features');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should render all primary navigation items with correct icons', () => {
    render(
      <HierarchicalNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    // Check that icons are rendered
    expect(screen.getByTestId('icon-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('icon-session')).toBeInTheDocument();
    expect(screen.getByTestId('icon-exercises')).toBeInTheDocument();
    expect(screen.getByTestId('icon-progress')).toBeInTheDocument();
    expect(screen.getByTestId('icon-settings')).toBeInTheDocument();
  });
});

describe('MobileBottomNavigation', () => {
  const mockOnTabChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render mobile navigation items', () => {
    render(
      <MobileBottomNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Session')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should have proper mobile styling', () => {
    render(
      <MobileBottomNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    const container = screen.getByTestId('mobile-navigation');
    expect(container).toHaveClass('fixed', 'bottom-0');
  });

  it('should call onTabChange when mobile tab is clicked', () => {
    render(
      <MobileBottomNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    fireEvent.click(screen.getByText('Session'));
    expect(mockOnTabChange).toHaveBeenCalledWith('session');
  });

  it('should have proper touch targets', () => {
    render(
      <MobileBottomNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveStyle({
        minHeight: '64px',
        minWidth: '64px',
      });
    });
  });

  it('should highlight active mobile tab', () => {
    render(
      <MobileBottomNavigation
        currentTab="session"
        onTabChange={mockOnTabChange}
      />
    );

    const sessionButton = screen.getByText('Session').closest('button');
    expect(sessionButton).toHaveClass('text-primary', 'bg-primary/10');
  });

  it('should render all mobile navigation items with correct icons', () => {
    render(
      <MobileBottomNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    // Check that icons are rendered with correct size
    expect(screen.getByTestId('icon-dashboard')).toHaveAttribute('data-size', '24');
    expect(screen.getByTestId('icon-session')).toHaveAttribute('data-size', '24');
    expect(screen.getByTestId('icon-exercises')).toHaveAttribute('data-size', '24');
    expect(screen.getByTestId('icon-progress')).toHaveAttribute('data-size', '24');
    expect(screen.getByTestId('icon-settings')).toHaveAttribute('data-size', '24');
  });

  it('should have proper mobile accessibility attributes', () => {
    render(
      <MobileBottomNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    // Check aria-labels on mobile buttons
    expect(screen.getByLabelText('Navigate to Dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Navigate to Session')).toBeInTheDocument();
    expect(screen.getByLabelText('Navigate to Exercises')).toBeInTheDocument();
    expect(screen.getByLabelText('Navigate to Progress')).toBeInTheDocument();
    expect(screen.getByLabelText('Navigate to Settings')).toBeInTheDocument();
  });

  it('should have proper mobile styling classes', () => {
    render(
      <MobileBottomNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    const container = screen.getByTestId('mobile-navigation');
    expect(container).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0', 'bg-background/95', 'backdrop-blur-sm', 'border-t', 'border-border');
  });

  it('should have proper grid layout for mobile buttons', () => {
    render(
      <MobileBottomNavigation
        currentTab="dashboard"
        onTabChange={mockOnTabChange}
      />
    );

    const gridContainer = screen.getByTestId('mobile-navigation').querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-5', 'gap-1', 'max-w-md', 'mx-auto');
  });
});
