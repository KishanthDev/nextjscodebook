export type ChatbarSettings = {
    text: string;
    textSize?: number;
    letterSpacing?: number;
    bgColor: string;
    textColor: string;
    gradientEnabled: boolean;
    gradientStops: { color: string; pos: number }[];
    gradientType: 'linear' | 'radial' | 'conic';
    gradientAngle: number;

    iconType: 'lucide' | 'image';
    iconColor: string;
    lucideIcon: string;
    iconHeight?: number;
    iconWidth?: number;
    iconImageUrl: string;
    iconFit: 'contain' | 'cover';
    iconOpacity: number;
    iconBlend: string;

    width: number;
    height: number;
    borderRadius: {
        tl: number; // top-left
        tr: number; // top-right
        bl: number; // bottom-left
        br: number; // bottom-right
    };
    shadow: boolean;
};
