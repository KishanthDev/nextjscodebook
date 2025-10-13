// Centralized constraints for ChatBar modifier inputs
export const CHAT_BAR_CONSTRAINTS = {
    width: {
        min: 100,
        max: 600,
        step: 5,
        unit: 'px' as const
    },
    height: {
        min: 30,
        max: 120,
        step: 2,
        unit: 'px' as const
    },

    // Border Radius
    borderRadius: {
        min: 0,
        max: 50,
        step: 1,
        unit: 'px' as const
    },

    // Text
    textSize: {
        min: 10,
        max: 40,
        step: 1,
        unit: 'px' as const
    },
    letterSpacing: {
        min: -3,
        max: 5,
        step: 0.1,
        unit: 'px' as const
    },

    // Gradient
    gradientAngle: {
        min: 0,
        max: 360,
        step: 1,
        unit: '°' as const
    },

    // Icons
    iconSize: {
        min: 12,
        max: 80,
        step: 1,
        unit: 'px' as const
    },
    iconOpacity: {
        min: 0,
        max: 1,
        step: 0.05,
        unit: '' as const
    },

    // Shadows
    shadowBlur: {
        min: 0,
        max: 50,
        step: 1,
        unit: 'px' as const
    },
    shadowSpread: {
        min: -20,
        max: 20,
        step: 1,
        unit: 'px' as const
    },
    shadowOffset: {
        min: -20,
        max: 20,
        step: 1,
        unit: 'px' as const
    }
} as const;