type EntryAnim = 'none' | 'fadeIn' | 'pop' | 'slideUp' | 'slideIn' | 'rise';
type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double';
type GradientType = 'none' | 'linear' | 'radial' | 'conic';
export type OverlayType = 'image' | 'lucide';

type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export type BubblePixelSettings = {
  // Dimensions (converted to numbers for range inputs)
  width: number; // px
  height: number; // px
  borderRadius: { tl: number; tr: number; bl: number; br: number }; // px

  backgroundOverlayType: OverlayType;

  backgroundLucideIcon: string;
  backgroundLucideColor: string;
  backgroundLucideSize: number;
  backgroundLucideOpacity: number;
  // Background
  backgroundColor: string;
  gradientType: GradientType;
  gradientAngle: number; // degrees
  gradientStops: { color: string; pos: number }[]; // pos as percentage 0-100
  backgroundImageUrl?: string;
  backgroundImageSize: 'contain' | 'cover' | 'auto';
  backgroundImageOpacity: number; // 0-1
  backgroundBlendMode: BlendMode;

  // Border
  border: { width: number; color: string; style: BorderStyle }; // width in px
  borderGradientEnabled: boolean;
  borderGradientAngle: number; // degrees
  borderGradientStops: { color: string; pos: number }[];
  borderOffsetAnim: boolean;
  outlineRing: { enabled: boolean; width: number; color: string; opacity: number };

  // Shadow and effects
  boxShadowBlur: number; // px
  boxShadowSpread: number; // px
  boxShadowOffsetX: number; // px
  boxShadowOffsetY: number; // px
  boxShadowOpacity: number; // 0-1
  innerShadow: { enabled: boolean; blur: number; opacity: number };
  glass: { enabled: boolean; blur: number; bgOpacity: number };
  neon: { enabled: boolean; color: string; intensity: number };

  // Entry / idle animation
  animation: { type: EntryAnim; duration: number; delay: number }; // duration/delay in ms
  idleAnim: { enabled: boolean; type: 'float' | 'bob'; amplitude: number; duration: number };

  // Loader dots (optional)
  dots?: { color: string; size: number; spacing: number; animation: 'bounce' | 'pulse' | 'none' };
};