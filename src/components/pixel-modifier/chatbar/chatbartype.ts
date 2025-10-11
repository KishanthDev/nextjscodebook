export type ChatbarSettings = {
    text: string;
    bgColor: string;
    textColor: string;
    gradientEnabled: boolean;
    gradientStops: { color: string; pos: number }[];
    gradientType: 'linear' | 'radial' | 'conic';
    gradientAngle: number;

    iconType: 'lucide' | 'image';
    iconColor: string;
    lucideIcon: string;
    iconImageUrl: string;
    iconFit: 'contain' | 'cover';
    iconOpacity: number;
    iconBlend: string;

    width: number;
    height: number;
    borderRadius: number;
    shadow: boolean;
};