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
    expect(screen.getByText('AI Intelligence')).toBeInTheDocument();
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

    const container = screen.getByRole('navigation') || screen.getByText('Dashboard').closest('div');
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
});
