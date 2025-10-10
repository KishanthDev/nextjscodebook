'use client';

import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Button } from '@/ui/button';

interface BubbleDownloadProps {
  settings: any; // You may replace this with a more specific type as needed
}

export const BubbleDownload: React.FC<BubbleDownloadProps> = ({ settings }) => {
  const handleDownload = async () => {
    const zip = new JSZip();

    try {
      // =================== BubblePreview.tsx ===================
      const previewCode = `'use client';

import React, { useMemo } from 'react';
import { BubblePixelSettings } from './bubbletype';

const ease = 'cubic-bezier(.2,.8,.2,1)';

interface BubblePreviewProps {
  settings: BubblePixelSettings;
}

export const BubblePreview: React.FC<BubblePreviewProps> = ({ settings }) => {
  // Computed styles
  const gradient = useMemo(() => {
    if (settings.gradientType === 'none') return '';
    const stops = settings.gradientStops.map(s => \`\${s.color} \${s.pos}%\`).join(', ');
    switch (settings.gradientType) {
      case 'linear':
        return \`linear-gradient(\${settings.gradientAngle}deg, \${stops})\`;
      case 'radial':
        return \`radial-gradient(circle, \${stops})\`;
      case 'conic':
        return \`conic-gradient(from \${settings.gradientAngle}deg, \${stops})\`;
      default:
        return '';
    }
  }, [settings.gradientType, settings.gradientAngle, settings.gradientStops]);

  const boxShadow = useMemo(() => {
    const { boxShadowOffsetX, boxShadowOffsetY, boxShadowBlur, boxShadowSpread, boxShadowOpacity } = settings;
    return \`\${boxShadowOffsetX}px \${boxShadowOffsetY}px \${boxShadowBlur}px \${boxShadowSpread}px rgba(0,0,0,\${boxShadowOpacity})\`;
  }, [settings.boxShadowOffsetX, settings.boxShadowOffsetY, settings.boxShadowBlur, settings.boxShadowSpread, settings.boxShadowOpacity]);

  const innerShadowValue = useMemo(() => {
    if (!settings.innerShadow.enabled) return '';
    return \`inset 0 6px \${settings.innerShadow.blur}px rgba(0,0,0,\${settings.innerShadow.opacity})\`;
  }, [settings.innerShadow]);

  const compositeBackground = useMemo(() => {
    return gradient || settings.backgroundColor;
  }, [gradient, settings.backgroundColor]);

  const borderImage = useMemo(() => {
    if (!settings.borderGradientEnabled) return undefined;
    const stops = settings.borderGradientStops.map(s => \`\${s.color} \${s.pos}%\`).join(', ');
    return \`linear-gradient(\${settings.borderGradientAngle}deg, \${stops}) 1\`;
  }, [settings.borderGradientEnabled, settings.borderGradientAngle, settings.borderGradientStops]);

  const entryAnimStyle: React.CSSProperties = useMemo(() => {
    const duration = \`\${settings.animation.duration}ms\`;
    const delay = \`\${settings.animation.delay}ms\`;
    switch (settings.animation.type) {
      case 'fadeIn':
        return { animation: \`fadeIn \${duration} \${ease} \${delay} both\` };
      case 'pop':
        return { animation: \`popIn \${duration} \${ease} \${delay} both\` };
      case 'slideUp':
        return { animation: \`slideUp \${duration} \${ease} \${delay} both\` };
      case 'slideIn':
        return { animation: \`slideIn \${duration} \${ease} \${delay} both\` };
      case 'rise':
        return { animation: \`rise \${duration} \${ease} \${delay} both\` };
      default:
        return {};
    }
  }, [settings.animation]);

  const borderStyle: React.CSSProperties = useMemo(() => ({
    borderWidth: \`\${settings.border.width}px\`,
    borderStyle: settings.border.style,
    borderColor: settings.border.color,
    ...(settings.borderGradientEnabled
      ? {
          borderImage: borderImage,
          borderColor: 'transparent',
        }
      : {}),
  }), [settings.border, settings.borderGradientEnabled, borderImage]);

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8">
      <div className="relative group" style={{ perspective: '800px' }}>
        <div
          className="relative flex items-center justify-center transition-all duration-300"
          style={{
            width: \`\${settings.width}px\`,
            height: \`\${settings.height}px\`,
            borderRadius: \`\${settings.borderRadius.tl}px \${settings.borderRadius.tr}px \${settings.borderRadius.br}px \${settings.borderRadius.bl}px\`,
            background: compositeBackground,
            backgroundBlendMode: settings.backgroundBlendMode,
            ...borderStyle,
            boxShadow: [boxShadow, innerShadowValue].filter(Boolean).join(', '),
            transformStyle: 'preserve-3d',
            ...(settings.glass.enabled ? { 
              backdropFilter: \`blur(\${settings.glass.blur}px)\`, 
              backgroundColor: \`rgba(255,255,255,\${settings.glass.bgOpacity})\` 
            } : {}),
            ...(settings.neon.enabled ? { 
              filter: \`drop-shadow(0 0 \${10 * settings.neon.intensity}px \${settings.neon.color})\`,
              boxShadow: \`\${boxShadow}, 0 0 \${10 * settings.neon.intensity}px \${settings.neon.color}, 0 0 \${25 * settings.neon.intensity}px \${settings.neon.color}\` 
            } : {}),
            ...entryAnimStyle,
          }}
        >
          {/* Background image overlay */}
          {settings.backgroundImageUrl && (
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: \`url(\${settings.backgroundImageUrl})\`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: settings.backgroundImageSize,
                opacity: settings.backgroundImageOpacity,
                mixBlendMode: settings.backgroundBlendMode,
                borderRadius: 'inherit',
              }}
            />
          )}

          {/* Center image/logo */}
          {settings.centerImageUrl && (
            <img
              src={settings.centerImageUrl}
              alt=""
              className="transition-transform duration-300 center-image"
              style={{
                width: \`\${settings.centerImageSize}px\`,
                height: \`\${settings.centerImageSize}px\`,
                objectFit: 'contain',
                opacity: settings.centerImageOpacity,
                animation: settings.centerImagePulse ? 'imagePulse 2s ease-in-out infinite' : undefined,
              }}
            />
          )}

          {/* Dots loader */}
          {settings.dots && (
            <div
              className="absolute flex"
              style={{ gap: \`\${settings.dots.spacing}px\` }}
            >
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className="rounded-full"
                  style={{
                    width: \`\${settings.dots?.size ?? 0}px\`,
                    height: \`\${settings.dots?.size ?? 0}px\`,
                    backgroundColor: settings.dots?.color ?? 'transparent',
                    animation:
                      settings.dots?.animation === 'bounce'
                        ? \`dotBounce 1.2s \${ease} \${i * 0.12}s infinite\`
                        : settings.dots?.animation === 'pulse'
                        ? \`dotPulse 1.4s \${ease} \${i * 0.1}s infinite\`
                        : undefined,
                  }}
                />
              ))}
            </div>
          )}

          {/* Outline ring */}
          {settings.outlineRing.enabled && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                borderRadius: 'inherit',
                boxShadow: \`0 0 0 \${settings.outlineRing.width}px \${hexToRgba(settings.outlineRing.color, settings.outlineRing.opacity)}\`,
              }}
            />
          )}
        </div>

        {/* Keyframes */}
        <style>{cssKeyframes(settings)}</style>
      </div>
    </div>
  );
};

// Utility functions
function hexToRgba(hex: string, alpha: number) {
  const v = hex.replace('#', '');
  const bigint = parseInt(v.length === 3 ? v.split('').map(c => c + c).join('') : v, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return \`rgba(\${r},\${g},\${b},\${alpha})\`;
}

function cssKeyframes(settings: BubblePixelSettings) {
  return \`
    @keyframes fadeIn { 
      from { opacity: 0; transform: translateY(6px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    @keyframes popIn { 
      0% { transform: scale(.9); opacity: 0; } 
      100% { transform: scale(1); opacity: 1; } 
    }
    @keyframes slideUp { 
      from { transform: translateY(16px); opacity: 0; } 
      to { transform: translateY(0); opacity: 1; } 
    }
    @keyframes slideIn { 
      from { transform: translateX(-16px); opacity: 0; } 
      to { transform: translateX(0); opacity: 1; } 
    }
    @keyframes rise { 
      from { transform: translateY(24px); filter: blur(6px); opacity: 0; } 
      to { transform: translateY(0); filter: blur(0); opacity: 1; } 
    }

    @keyframes idleFloat { 
      0%,100% { transform: translateY(0); } 
      50% { transform: translateY(-\${settings.idleAnim.amplitude}px); } 
    }
    @keyframes idleBob { 
      0%,100% { transform: translateY(0); } 
      50% { transform: translateY(-\${settings.idleAnim.amplitude}px) scale(1.01); } 
    }

    @keyframes imagePulse {
      0%,100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes dotBounce { 
      0%,100% { transform: translateY(0); } 
      50% { transform: translateY(-6px); } 
    }
    @keyframes dotPulse { 
      0%,100% { transform: scale(1); } 
      50% { transform: scale(1.25); } 
    }

    /* Custom slider styles */
    .slider::-webkit-slider-thumb {
      appearance: none;
      height: 18px;
      width: 18px;
      border-radius: 50%;
      background: #3B82F6;
      cursor: pointer;
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 1px #e5e7eb;
    }

    .slider::-moz-range-thumb {
      height: 18px;
      width: 18px;
      border-radius: 50%;
      background: #3B82F6;
      cursor: pointer;
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 1px #e5e7eb;
    }
  \`;
}

export default BubblePreview;
`;

      // =================== bubbletype.ts ===================
      const bubbletypeCode = `
export type BubblePixelSettings = {
  width: number;
  height: number;
  borderRadius: { tl: number; tr: number; bl: number; br: number };
  backgroundColor: string;
  gradientType: string;
  gradientAngle: number;
  gradientStops: Array<{ color: string, pos: number }>;
  backgroundImageUrl?: string;
  backgroundImageSize?: string;
  backgroundImageOpacity?: number;
  backgroundBlendMode?: string;
  border: { width: number; color: string; style: string };
  borderGradientEnabled?: boolean;
  borderGradientAngle?: number;
  borderGradientStops?: Array<{ color: string, pos: number }>;
  borderOffsetAnim?: boolean;
  outlineRing: { enabled: boolean; width: number; color: string; opacity: number };
  boxShadowBlur: number;
  boxShadowSpread: number;
  boxShadowOffsetX: number;
  boxShadowOffsetY: number;
  boxShadowOpacity: number;
  innerShadow: { enabled: boolean; blur: number; opacity: number };
  glass: { enabled: boolean; blur: number; bgOpacity: number };
  neon: { enabled: boolean; color: string; intensity: number };
  animation: { type: string; duration: number; delay: number };
  idleAnim: { enabled: boolean; type: string; amplitude: number; duration: number };
  centerImageUrl?: string;
  centerImageSize?: number;
  centerImageOpacity?: number;
  centerImageHoverScale?: number;
  centerImagePulse?: boolean;
  dots?: { color: string; size: number; spacing: number; animation: string };
};
`;

      // =================== BubbleComponent (page.tsx) ===================
      const bubbleComponentCode = `
import BubblePreview from './BubblePreview';

const settings = ${JSON.stringify(settings, null, 2)};

export const BubbleComponent = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
    >
      <BubblePreview settings={settings} />
    </div>
  );
};

export default BubbleComponent;
`;

      // Add files to zip
      zip.file('page.tsx', bubbleComponentCode.trim());
      zip.file('BubblePreview.tsx', previewCode.trim());
      zip.file('bubbletype.ts', bubbletypeCode.trim());

      // Generate zip and trigger download
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'bubble-page.zip');
    } catch (err) {
      console.error('Failed to download components:', err);
      alert('Failed to download. Check console.');
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size='sm'
    >
      Download 
    </Button>
  );
};

export default BubbleDownload;
