// eyecatchertype.ts
export interface EyecatcherSettings {
  // Content
  title: string;
  text: string;
  emoji: string;
  
  // Dimensions
  width: number;
  height: number;
  
  // Colors
  bgColor: string;
  textColor: string;
  titleColor: string;
  
  // Typography
  titleSize: number;
  textSize: number;
  titleWeight: number;
  letterSpacing: number;
  
  // Border Radius
  borderRadius: {
    tl: number;
    tr: number;
    bl: number;
    br: number;
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
  
  // Animation
  animationEnabled: boolean;
  animationType: 'wave' | 'bounce' | 'pulse' | 'rotate' | 'none';
  animationDuration: number;
  
  // Layout
  emojiPosition: 'left' | 'top' | 'right';
  emojiSize: number;
  contentAlignment: 'left' | 'center' | 'right';
  
  // Border
  borderEnabled: boolean;
  borderColor: string;
  borderWidth: number;
  
  // Spacing
  padding: number;
  gap: number;
}

export const DEFAULT_EYECATCHER_SETTINGS: EyecatcherSettings = {
  title: 'Welcome!',
  text: 'How can we help you today?',
  emoji: '👋',
  width: 280,
  height: 120,
  bgColor: '#3b82f6',
  textColor: '#ffffff',
  titleColor: '#ffffff',
  titleSize: 16,
  textSize: 12,
  titleWeight: 700,
  letterSpacing: 0,
  borderRadius: { tl: 12, tr: 12, bl: 12, br: 12 },
  gradientEnabled: false,
  gradientType: 'linear',
  gradientAngle: 135,
  gradientStops: [
    { color: '#3b82f6', pos: 0 },
    { color: '#8b5cf6', pos: 100 },
  ],
  shadow: true,
  shadowColor: '#000000',
  shadowBlur: 20,
  shadowX: 0,
  shadowY: 4,
  animationEnabled: true,
  animationType: 'wave',
  animationDuration: 1.5,
  emojiPosition: 'left',
  emojiSize: 32,
  contentAlignment: 'left',
  borderEnabled: false,
  borderColor: '#000000',
  borderWidth: 2,
  padding: 16,
  gap: 12,
};