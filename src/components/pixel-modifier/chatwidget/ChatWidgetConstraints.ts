// Centralized constraints for Chat Widget modifier inputs
export const CHAT_WIDGET_CONSTRAINTS = {
    // Dimensions
    width: {
        min: 260,
        max: 600,
        step: 10,
        unit: 'px' as const
    },
    height: {
        min: 300,
        max: 800,
        step: 10,
        unit: 'px' as const
    },
    borderRadius: {
        min: 0,
        max: 24,
        step: 1,
        unit: 'px' as const
    },

    // Typography
    fontSize: {
        min: 10,
        max: 24,
        step: 1,
        unit: 'px' as const
    },

    // Input
    inputBorderRadius: {
        min: 0,
        max: 20,
        step: 1,
        unit: 'px' as const
    },

    // Header
    logoSize: {
        min: 20,
        max: 50,
        step: 2,
        unit: 'px' as const
    },

    // Message Bubbles
    bubbleBorderRadius: {
        min: 0,
        max: 20,
        step: 1,
        unit: 'px' as const
    },
    bubblePadding: {
        min: 4,
        max: 20,
        step: 1,
        unit: 'px' as const
    },

    // Send Button
    sendBtnSize: {
        min: 24,
        max: 48,
        step: 2,
        unit: 'px' as const
    },

    // Footer
    footerHeight: {
        min: 20,
        max: 60,
        step: 2,
        unit: 'px' as const
    },

    // Spacing
    messagePadding: {
        min: 8,
        max: 24,
        step: 2,
        unit: 'px' as const
    },
    headerPadding: {
        min: 8,
        max: 24,
        step: 2,
        unit: 'px' as const
    }
} as const;

// Font size options
export const FONT_SIZE_OPTIONS = [
    { value: '12', label: '12px' },
    { value: '14', label: '14px' },
    { value: '16', label: '16px' },
    { value: '18', label: '18px' },
]

// Type for constraint values
export type ConstraintConfig = {
    min: number;
    max: number;
    step: number;
    unit: string;
};

// Helper function to get constraint by key
export const getConstraint = (key: keyof typeof CHAT_WIDGET_CONSTRAINTS): ConstraintConfig => {
    return CHAT_WIDGET_CONSTRAINTS[key];
};