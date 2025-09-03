import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EligibilityHero } from '@/components/eligibility/EligibilityHero';
import { useEligibilityForm } from '@/hooks/useEligibilityForm';
import { ELIGIBILITY_STEPS } from '@/constants/eligibilitySteps';

// Mock du hook
jest.mock('@/hooks/useEligibilityForm');
const mockUseEligibilityForm = useEligibilityForm as jest.MockedFunction<typeof useEligibilityForm>;

describe('EligibilityHero', () => {
    const mockOnStartTest = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders hero section correctly', () => {
        render(<EligibilityHero onStartTest={mockOnStartTest} />);

        expect(screen.getByText(/Testez votre éligibilité/)).toBeInTheDocument();
        expect(screen.getByText(/2 minutes/)).toBeInTheDocument();
        expect(screen.getByText(/100% gratuit/)).toBeInTheDocument();
        expect(screen.getByText(/Données sécurisées/)).toBeInTheDocument();
    });

    it('calls onStartTest when CTA is clicked', () => {
        render(<EligibilityHero onStartTest={mockOnStartTest} />);

        const ctaButton = screen.getByRole('button', { name: /Commencer le test/i });
        fireEvent.click(ctaButton);

        expect(mockOnStartTest).toHaveBeenCalledTimes(1);
    });

    it('displays social proof', () => {
        render(<EligibilityHero onStartTest={mockOnStartTest} />);

        expect(screen.getByText(/consommateurs accompagnés/)).toBeInTheDocument();
    });
});

describe('useEligibilityForm', () => {
    beforeEach(() => {
        mockUseEligibilityForm.mockReturnValue({
            currentStep: 0,
            data: {},
            validations: {},
            updateData: jest.fn(),
            nextStep: jest.fn(),
            prevStep: jest.fn(),
            validateStep: jest.fn(),
            calculateEligibility: jest.fn()
        });
    });

    it('validates seller type correctly', () => {
        const { validateStep } = mockUseEligibilityForm();

        // Test professionnel (valide)
        const validResult = validateStep(0, 'professional');
        expect(validResult.isValid).toBe(true);

        // Test particulier (invalide)
        const invalidResult = validateStep(0, 'individual');
        expect(invalidResult.isValid).toBe(false);
        expect(invalidResult.error).toContain('professionnels');
    });
});

describe('ELIGIBILITY_STEPS', () => {
    it('contains all required steps', () => {
        expect(ELIGIBILITY_STEPS).toHaveLength(6);

        const stepIds = ELIGIBILITY_STEPS.map(step => step.id);
        expect(stepIds).toEqual([
            'seller',
            'usage',
            'product',
            'territory',
            'timing',
            'defect'
        ]);
    });

    it('each step has required legal information', () => {
        ELIGIBILITY_STEPS.forEach(step => {
            expect(step.legal.article).toBeTruthy();
            expect(step.legal.explanation).toBeTruthy();
            expect(step.question).toBeTruthy();
            expect(step.description).toBeTruthy();
        });
    });
});