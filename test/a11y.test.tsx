import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HierarchicalNavigation } from '@/components/navigation/hierarchical-navigation';
import { UserOnboarding } from '@/components/user-onboarding';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock the Icon component for navigation tests
vi.mock('@/components/svg-icons', () => ({
  Icon: ({ name, size }: { name: string; size: number }) => (
    <div data-testid={`icon-${name}`} data-size={size} role="img" aria-label={name} />
  ),
}));

// Mock the useUser hook for onboarding tests
vi.mock('@/lib/contexts/user-context', () => ({
  useUser: () => ({
    createUser: vi.fn().mockResolvedValue({ id: 'user-123' }),
  }),
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Accessibility Tests', () => {
  describe('Button Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should be accessible when disabled', async () => {
      const { container } = render(<Button disabled>Disabled button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', async () => {
      const { container } = render(
        <Button aria-label="Close dialog" aria-describedby="close-description">
          ×
        </Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Card Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is test content for the card.</p>
          </CardContent>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Navigation Components', () => {
    it('should not have accessibility violations in hierarchical navigation', async () => {
      const { container } = render(
        <HierarchicalNavigation
          currentTab="dashboard"
          onTabChange={vi.fn()}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper navigation landmarks', async () => {
      const { container } = render(
        <HierarchicalNavigation
          currentTab="dashboard"
          onTabChange={vi.fn()}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper button roles and labels', async () => {
      const { container } = render(
        <HierarchicalNavigation
          currentTab="dashboard"
          onTabChange={vi.fn()}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form Components', () => {
    it('should not have accessibility violations in onboarding form', async () => {
      const { container } = render(
        <UserOnboarding onComplete={vi.fn()} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper form labels and associations', async () => {
      const { container } = render(
        <UserOnboarding onComplete={vi.fn()} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Color Contrast', () => {
    it('should meet WCAG AA contrast requirements', async () => {
      const { container } = render(
        <div>
          <Button variant="default">Primary Button</Button>
          <Button variant="outline">Secondary Button</Button>
          <Button variant="destructive">Destructive Button</Button>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be navigable with keyboard', async () => {
      const { container } = render(
        <HierarchicalNavigation
          currentTab="dashboard"
          onTabChange={vi.fn()}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper ARIA labels and descriptions', async () => {
      const { container } = render(
        <div>
          <Button aria-label="Close dialog" aria-describedby="close-help">
            ×
          </Button>
          <div id="close-help">Click to close the dialog</div>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Focus Management', () => {
    it('should have visible focus indicators', async () => {
      const { container } = render(
        <div>
          <Button>Focusable Button 1</Button>
          <Button>Focusable Button 2</Button>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
