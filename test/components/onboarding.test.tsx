import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserOnboarding } from '@/components/user-onboarding';

// Mock the useUser hook
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

describe('UserOnboarding', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render step 1 with form fields', () => {
    render(<UserOnboarding onComplete={mockOnComplete} />);

    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Sport')).toBeInTheDocument();
  });

  it('should validate step 1 form fields', async () => {
    render(<UserOnboarding onComplete={mockOnComplete} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();

    // Fill required fields
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Sport'), {
      target: { value: 'Volleyball' },
    });

    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
  });

  it('should navigate to step 2 when Next is clicked', async () => {
    render(<UserOnboarding onComplete={mockOnComplete} />);

    // Fill step 1
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Sport'), {
      target: { value: 'Volleyball' },
    });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Physical Information')).toBeInTheDocument();
      expect(screen.getByLabelText('Height (cm)')).toBeInTheDocument();
      expect(screen.getByLabelText('Weight (kg)')).toBeInTheDocument();
    });
  });

  it('should validate step 2 with height and weight', async () => {
    render(<UserOnboarding onComplete={mockOnComplete} />);

    // Navigate to step 2
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Sport'), {
      target: { value: 'Volleyball' },
    });
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
    });

    // Fill height and weight
    fireEvent.change(screen.getByLabelText('Height (cm)'), {
      target: { value: '180' },
    });
    fireEvent.change(screen.getByLabelText('Weight (kg)'), {
      target: { value: '70' },
    });

    await waitFor(() => {
      const nextButton = screen.getByText('Next');
      expect(nextButton).not.toBeDisabled();
    });
  });

  it('should navigate to step 3 for goals selection', async () => {
    render(<UserOnboarding onComplete={mockOnComplete} />);

    // Complete steps 1 and 2
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Sport'), {
      target: { value: 'Volleyball' },
    });
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Height (cm)'), {
        target: { value: '180' },
      });
      fireEvent.change(screen.getByLabelText('Weight (kg)'), {
        target: { value: '70' },
      });
      fireEvent.click(screen.getByText('Next'));
    });

    await waitFor(() => {
      expect(screen.getByText('Training Goals')).toBeInTheDocument();
      expect(screen.getByText('Improve vertical jump')).toBeInTheDocument();
    });
  });

  it('should validate step 3 with goal selection', async () => {
    render(<UserOnboarding onComplete={mockOnComplete} />);

    // Complete steps 1 and 2
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Sport'), {
      target: { value: 'Volleyball' },
    });
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Height (cm)'), {
        target: { value: '180' },
      });
      fireEvent.change(screen.getByLabelText('Weight (kg)'), {
        target: { value: '70' },
      });
      fireEvent.click(screen.getByText('Next'));
    });

    await waitFor(() => {
      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();

      // Select a goal
      fireEvent.click(screen.getByText('Improve vertical jump'));

      expect(nextButton).not.toBeDisabled();
    });
  });

  it('should complete onboarding and call onComplete', async () => {
    render(<UserOnboarding onComplete={mockOnComplete} />);

    // Complete all steps
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Sport'), {
      target: { value: 'Volleyball' },
    });
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Height (cm)'), {
        target: { value: '180' },
      });
      fireEvent.change(screen.getByLabelText('Weight (kg)'), {
        target: { value: '70' },
      });
      fireEvent.click(screen.getByText('Next'));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Improve vertical jump'));
      fireEvent.click(screen.getByText('Next'));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Morning (8-10 AM)'));
      fireEvent.click(screen.getByText('Complete Setup'));
    });

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('should allow going back to previous steps', async () => {
    render(<UserOnboarding onComplete={mockOnComplete} />);

    // Complete step 1
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Sport'), {
      target: { value: 'Volleyball' },
    });
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.getByText('Physical Information')).toBeInTheDocument();
    });

    // Go back to step 1
    fireEvent.click(screen.getByText('Previous'));

    await waitFor(() => {
      expect(screen.getByText('Tell us about yourself')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });
  });
});
