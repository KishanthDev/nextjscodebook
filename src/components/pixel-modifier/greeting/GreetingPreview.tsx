'use client';

import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { GreetingSettings } from './greetingtype';
import { SaveButton } from '../lib/SaveButton';
import { CopyDownloadButtons } from '../lib/CopyDownloadButtons';

interface PreviewProps {
  settings: GreetingSettings;
}

export default function GreetingPreview({ settings }: PreviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  const backgroundStyle = useMemo(() => {
    if (!settings.gradientEnabled) return settings.bgColor;
    const stops = settings.gradientStops.map((s) => `${s.color} ${s.pos}%`).join(', ');
    switch (settings.gradientType) {
      case 'linear':
        return `linear-gradient(${settings.gradientAngle}deg, ${stops})`;
      case 'radial':
        return `radial-gradient(circle, ${stops})`;
      case 'conic':
        return `conic-gradient(from ${settings.gradientAngle}deg, ${stops})`;
      default:
        return settings.bgColor;
    }
  }, [
    settings.gradientEnabled,
    settings.gradientType,
    settings.gradientAngle,
    settings.gradientStops,
    settings.bgColor,
  ]);

  const cardBorderRadius = `${settings.borderRadius.tl}px ${settings.borderRadius.tr}px ${settings.borderRadius.br}px ${settings.borderRadius.bl}px`;
  const imageBorderRadius = `${settings.imageBorderRadius.tl}px ${settings.imageBorderRadius.tr}px 0 0`;

  const shadowStyle = settings.shadow
    ? `${settings.shadowX}px ${settings.shadowY}px ${settings.shadowBlur}px ${settings.shadowColor}`
    : 'none';

  const borderStyle = settings.borderEnabled
    ? `${settings.borderWidth}px solid ${settings.borderColor}`
    : 'none';

  const buttonBorderStyle = settings.buttonBorderEnabled
    ? `${settings.buttonBorderWidth}px solid ${settings.buttonBorderColor}`
    : 'none';

  const closeButtonPositionClass =
    settings.closeButtonPosition === 'top-left' ? 'left-0' : 'right-0';

  return (
    <div className="flex-1 relative bg-gray-50 dark:bg-neutral-800 rounded p-6 flex justify-center items-center transition-colors duration-200">
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <CopyDownloadButtons settings={settings} filename="greeting-settings.json" />
      </div>

      <div
        className="relative group"
        style={{ width: settings.width }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Close Button */}
        {settings.showCloseButton && (
          <div
            className={`absolute -top-7 ${closeButtonPositionClass} z-20 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              aria-label="Close greeting"
              className="p-1 hover:opacity-70 transition-opacity"
              style={{ color: settings.closeIconColor }}
            >
              <X size={settings.closeButtonSize} />
            </button>
          </div>
        )}

        {/* Greeting Card */}
        <div
          className="flex flex-col overflow-hidden transition-all"
          style={{
            background: backgroundStyle,
            borderRadius: cardBorderRadius,
            boxShadow: shadowStyle,
            border: borderStyle,
            minHeight: settings.cardHeight,
            transitionDuration: `${settings.transitionDuration}s`,
            transform:
              settings.hoverScaleEnabled && isHovered
                ? `scale(${settings.hoverScale})`
                : 'scale(1)',
          }}
        >
          {/* Image Section */}
          <div
            className="overflow-hidden flex-shrink-0"
            style={{
              height: settings.imageHeight,
              borderRadius: imageBorderRadius,
            }}
          >
            <img
              src={settings.imageUrl}
              alt="Greeting"
              className="w-full h-full"
              style={{
                objectFit: settings.imageFit,
                objectPosition: settings.imagePosition,
              }}
              onError={(e) => {
                e.currentTarget.src = '/landingpage/hello01.png';
              }}
            />
          </div>

          {/* Content Section */}
          <div
            className="break-words"
            style={{
              padding: `${settings.contentPadding}px`,
            }}
          >
            <h2
              className="break-words"
              style={{
                fontSize: `${settings.headingSize}px`,
                fontWeight: settings.headingWeight,
                letterSpacing: `${settings.letterSpacing}px`,
                lineHeight: settings.lineHeight,
                color: settings.headingColor,
                marginBottom: `${settings.textSpacing}px`,
              }}
            >
              {settings.headingText}
            </h2>
            <p
              className="break-words"
              style={{
                fontSize: `${settings.paraSize}px`,
                fontWeight: settings.paraWeight,
                letterSpacing: `${settings.letterSpacing}px`,
                lineHeight: settings.lineHeight,
                color: settings.paraColor,
              }}
            >
              {settings.paraText}
            </p>
          </div>

          {/* Buttons Section */}
          <ul
            className="flex flex-col px-2 pb-2"
            style={{ gap: `${settings.buttonSpacing}px` }}
          >
            {settings.showPrimaryBtn && (
              <li>
                <button
                  className="w-full flex items-center justify-center transition-opacity hover:opacity-90"
                  style={{
                    height: `${settings.buttonHeight}px`,
                    backgroundColor: settings.primaryBtnColor,
                    color: settings.primaryBtnTextColor,
                    fontSize: `${settings.buttonFontSize}px`,
                    fontWeight: settings.buttonFontWeight,
                    borderRadius: `${settings.primaryBtnBorderRadius}px`,
                    border: buttonBorderStyle,
                  }}
                >
                  {settings.primaryBtnText}
                </button>
              </li>
            )}

            {settings.showSecondaryBtn && (
              <li>
                <button
                  className="w-full flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                  style={{
                    height: `${settings.buttonHeight}px`,
                    backgroundColor: settings.secondaryBtnColor,
                    color: settings.secondaryBtnTextColor,
                    fontSize: `${settings.buttonFontSize}px`,
                    fontWeight: settings.buttonFontWeight,
                    borderRadius: `${settings.secondaryBtnBorderRadius}px`,
                    border: buttonBorderStyle,
                  }}
                >
                  {settings.secondaryBtnIcon && (
                    <span>{settings.secondaryBtnIcon}</span>
                  )}
                  {settings.secondaryBtnText}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}