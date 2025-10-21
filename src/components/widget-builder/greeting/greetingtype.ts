// greetingtype.ts
export interface GreetingSettings {
  // Content
  headingText: string;
  paraText: string;
  imageUrl: string;
  
  // Dimensions
  width: number;
  cardHeight: number;
  imageHeight: number;
  
  // Colors
  bgColor: string;
  headingColor: string;
  paraColor: string;
  closeIconColor: string;
  
  // Typography
  headingSize: number;
  paraSize: number;
  headingWeight: number;
  paraWeight: number;
  letterSpacing: number;
  lineHeight: number;
  
  // Border Radius
  borderRadius: {
    tl: number;
    tr: number;
    bl: number;
    br: number;
  };
  imageBorderRadius: {
    tl: number;
    tr: number;
  };
  
  // Background
  gradientEnabled: boolean;
  gradientType: 'linear' | 'radial' | 'conic';
  gradientAngle: number;
  gradientStops: Array<{ color: string; pos: number }>;
  
  // Shadow
  shadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowX: number;
  shadowY: number;
  
  // Border
  borderEnabled: boolean;
  borderColor: string;
  borderWidth: number;
  
  // Spacing
  contentPadding: number;
  textSpacing: number;
  buttonSpacing: number;
  
  // Buttons
  primaryBtnText: string;
  primaryBtnColor: string;
  primaryBtnTextColor: string;
  showPrimaryBtn: boolean;
  primaryBtnBorderRadius: number;
  
  secondaryBtnText: string;
  secondaryBtnColor: string;
  secondaryBtnTextColor: string;
  showSecondaryBtn: boolean;
  secondaryBtnIcon: string;
  secondaryBtnBorderRadius: number;
  
  // Button Styling
  buttonHeight: number;
  buttonFontSize: number;
  buttonFontWeight: number;
  buttonBorderEnabled: boolean;
  buttonBorderColor: string;
  buttonBorderWidth: number;
  
  // Animation
  hoverScaleEnabled: boolean;
  hoverScale: number;
  transitionDuration: number;
  
  // Close Button
  showCloseButton: boolean;
  closeButtonPosition: 'top-left' | 'top-right';
  closeButtonSize: number;
  
  // Image Settings
  imageFit: 'cover' | 'contain' | 'fill';
  imagePosition: 'top' | 'center' | 'bottom';
}

export const DEFAULT_GREETING_SETTINGS: GreetingSettings = {
  headingText: 'Hello! 👋',
  paraText: 'How can we help you today?',
  imageUrl: '/landingpage/hello01.png',
  width: 280,
  cardHeight: 400,
  imageHeight: 160,
  bgColor: '#ffffff',
  headingColor: '#1f2937',
  paraColor: '#6b7280',
  closeIconColor: '#9ca3af',
  headingSize: 18,
  paraSize: 14,
  headingWeight: 600,
  paraWeight: 400,
  letterSpacing: 0,
  lineHeight: 1.5,
  borderRadius: { tl: 12, tr: 12, bl: 12, br: 12 },
  imageBorderRadius: { tl: 12, tr: 12 },
  gradientEnabled: false,
  gradientType: 'linear',
  gradientAngle: 135,
  gradientStops: [
    { color: '#f3f4f6', pos: 0 },
    { color: '#e5e7eb', pos: 100 },
  ],
  shadow: true,
  shadowColor: '#00000040',
  shadowBlur: 20,
  shadowX: 0,
  shadowY: 4,
  borderEnabled: false,
  borderColor: '#e5e7eb',
  borderWidth: 1,
  contentPadding: 16,
  textSpacing: 8,
  buttonSpacing: 8,
  primaryBtnText: 'Get Started',
  primaryBtnColor: '#3b82f6',
  primaryBtnTextColor: '#ffffff',
  showPrimaryBtn: true,
  primaryBtnBorderRadius: 8,
  secondaryBtnText: 'Chat with us',
  secondaryBtnColor: '#f3f4f6',
  secondaryBtnTextColor: '#374151',
  showSecondaryBtn: true,
  secondaryBtnIcon: '💬',
  secondaryBtnBorderRadius: 8,
  buttonHeight: 44,
  buttonFontSize: 14,
  buttonFontWeight: 500,
  buttonBorderEnabled: false,
  buttonBorderColor: '#d1d5db',
  buttonBorderWidth: 1,
  hoverScaleEnabled: true,
  hoverScale: 1.05,
  transitionDuration: 0.3,
  showCloseButton: true,
  closeButtonPosition: 'top-right',
  closeButtonSize: 20,
  imageFit: 'cover',
  imagePosition: 'center',
};