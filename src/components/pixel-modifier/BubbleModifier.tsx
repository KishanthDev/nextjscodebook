'use client';

import React from 'react';
import { RangeInput, ColorInput, SelectInput, TextInput, CheckboxInput, GradientStopEditor } from './inputs';
import { BubblePixelSettings } from './bubbletype';
import { toast } from 'sonner';
import { Button } from '@/ui/button';
import { DownloadComponents } from './Downloader';

// Constraint constants
const CONSTRAINTS = {
    width: { min: 0, max: 100, step: 2 },
    height: { min: 0, max: 100, step: 2 },
    padding: { min: 0, max: 50, step: 1 },
    margin: { min: 0, max: 100, step: 2 },
    borderRadius: { min: 0, max: 100, step: 1 },
    borderWidth: { min: 0, max: 20, step: 1 },
    shadowBlur: { min: 0, max: 50, step: 1 },
    shadowSpread: { min: -20, max: 20, step: 1 },
    shadowOffset: { min: -30, max: 30, step: 1 },
    imageSize: { min: 16, max: 200, step: 4 },
    cutCornerSize: { min: 0, max: 50, step: 1 },
    dotSize: { min: 2, max: 20, step: 1 },
    dotSpacing: { min: 0, max: 20, step: 1 },
    angle: { min: 0, max: 360, step: 5 },
    scale: { min: 0.5, max: 2, step: 0.01 },
    rotate: { min: -180, max: 180, step: 5 },
    duration: { min: 100, max: 5000, step: 50 },
    opacity: { min: 0, max: 1, step: 0.01 },
    intensity: { min: 0, max: 3, step: 0.1 },
    amplitude: { min: 1, max: 20, step: 1 },
};

interface BubbleModifierProps {
    settings: BubblePixelSettings;
    updateSetting: <K extends keyof BubblePixelSettings>(
        key: K,
        value: BubblePixelSettings[K]
    ) => void;
    updateNestedSetting: <
        K extends keyof BubblePixelSettings,
        NK extends keyof NonNullable<BubblePixelSettings[K]>
    >(
        key: K,
        nestedKey: NK,
        value: NonNullable<BubblePixelSettings[K]>[NK]
    ) => void;
}

export const BubbleModifier: React.FC<BubbleModifierProps> = ({
    settings,
    updateSetting,
    updateNestedSetting,
}) => {
    return (
        <div className="lg:w-96 space-y-6 bg-white p-6 rounded-lg shadow-sm overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bubble Modifier</h2>

            {/* Dimensions Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Dimensions</h3>
                <div className="grid grid-cols-2 gap-4">
                    <RangeInput
                        label="Width"
                        value={settings.width}
                        onChange={(width) => updateSetting('width', width)}
                        {...CONSTRAINTS.width}
                    />
                    <RangeInput
                        label="Height"
                        value={settings.height}
                        onChange={(height) => updateSetting('height', height)}
                        {...CONSTRAINTS.height}
                    />
                </div>
            </section>

            {/* Border Radius Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Border Radius</h3>
                <div className="grid grid-cols-2 gap-4">
                    {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
                        <RangeInput
                            key={corner}
                            label={corner.toUpperCase()}
                            value={settings.borderRadius[corner]}
                            onChange={(value) => updateNestedSetting('borderRadius', corner, value)}
                            {...CONSTRAINTS.borderRadius}
                        />
                    ))}
                </div>
            </section>

            {/* Background Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Background</h3>
                <ColorInput
                    label="Base Color"
                    value={settings.backgroundColor}
                    onChange={(backgroundColor) => updateSetting('backgroundColor', backgroundColor)}
                />
                <SelectInput
                    label="Gradient Type"
                    value={settings.gradientType}
                    onChange={(gradientType) => updateSetting('gradientType', gradientType)}
                    options={[
                        { value: 'none', label: 'None' },
                        { value: 'linear', label: 'Linear' },
                        { value: 'radial', label: 'Radial' },
                        { value: 'conic', label: 'Conic' }
                    ]}
                />
                {settings.gradientType !== 'none' && (
                    <>
                        <RangeInput
                            label="Gradient Angle"
                            value={settings.gradientAngle}
                            onChange={(gradientAngle) => updateSetting('gradientAngle', gradientAngle)}
                            {...CONSTRAINTS.angle}
                            unit="°"
                        />
                        <GradientStopEditor
                            stops={settings.gradientStops}
                            onChange={(gradientStops) => updateSetting('gradientStops', gradientStops)}
                        />
                    </>
                )}
            </section>

            {/* Center Image Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Center Image</h3>
                <TextInput
                    label="Image URL"
                    value={settings.centerImageUrl || ''}
                    onChange={(centerImageUrl) => updateSetting('centerImageUrl', centerImageUrl)}
                    placeholder="https://..."
                />
                {settings.centerImageUrl && (
                    <>
                        <RangeInput
                            label="Image Size"
                            value={settings.centerImageSize}
                            onChange={(centerImageSize) => updateSetting('centerImageSize', centerImageSize)}
                            {...CONSTRAINTS.imageSize}
                        />
                        <RangeInput
                            label="Image Opacity"
                            value={settings.centerImageOpacity}
                            onChange={(centerImageOpacity) => updateSetting('centerImageOpacity', centerImageOpacity)}
                            {...CONSTRAINTS.opacity}
                            unit=""
                        />
                        <RangeInput
                            label="Hover Scale"
                            value={settings.centerImageHoverScale}
                            onChange={(centerImageHoverScale) => updateSetting('centerImageHoverScale', centerImageHoverScale)}
                            {...CONSTRAINTS.scale}
                            unit="x"
                        />
                        <CheckboxInput
                            label="Pulse Effect"
                            checked={settings.centerImagePulse}
                            onChange={(centerImagePulse) => updateSetting('centerImagePulse', centerImagePulse)}
                        />
                    </>
                )}
            </section>

            {/* Background Overlay Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Background Overlay</h3>
                <TextInput
                    label="Background Image URL"
                    value={settings.backgroundImageUrl || ''}
                    onChange={(backgroundImageUrl) => updateSetting('backgroundImageUrl', backgroundImageUrl)}
                    placeholder="Overlay image url"
                />
                {settings.backgroundImageUrl && (
                    <>
                        <SelectInput
                            label="Background Size"
                            value={settings.backgroundImageSize}
                            onChange={(backgroundImageSize) => updateSetting('backgroundImageSize', backgroundImageSize)}
                            options={[
                                { value: 'contain', label: 'Contain' },
                                { value: 'cover', label: 'Cover' },
                                { value: 'auto', label: 'Auto' }
                            ]}
                        />
                        <RangeInput
                            label="Background Opacity"
                            value={settings.backgroundImageOpacity}
                            onChange={(backgroundImageOpacity) => updateSetting('backgroundImageOpacity', backgroundImageOpacity)}
                            {...CONSTRAINTS.opacity}
                            unit=""
                        />
                        <SelectInput
                            label="Blend Mode"
                            value={settings.backgroundBlendMode}
                            onChange={(backgroundBlendMode) => updateSetting('backgroundBlendMode', backgroundBlendMode)}
                            options={[
                                { value: 'normal', label: 'Normal' },
                                { value: 'multiply', label: 'Multiply' },
                                { value: 'screen', label: 'Screen' },
                                { value: 'overlay', label: 'Overlay' },
                                { value: 'darken', label: 'Darken' },
                                { value: 'lighten', label: 'Lighten' },
                                { value: 'color-dodge', label: 'Color Dodge' },
                                { value: 'color-burn', label: 'Color Burn' },
                                { value: 'hard-light', label: 'Hard Light' },
                                { value: 'soft-light', label: 'Soft Light' },
                                { value: 'difference', label: 'Difference' },
                                { value: 'exclusion', label: 'Exclusion' }
                            ]}
                        />
                    </>
                )}
            </section>

            {/* Border Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Border</h3>
                <div className="grid grid-cols-2 gap-4">
                    <RangeInput
                        label="Width"
                        value={settings.border.width}
                        onChange={(width) => updateNestedSetting('border', 'width', width)}
                        {...CONSTRAINTS.borderWidth}
                    />
                    <SelectInput
                        label="Style"
                        value={settings.border.style}
                        onChange={(style) => updateNestedSetting('border', 'style', style)}
                        options={[
                            { value: 'solid', label: 'Solid' },
                            { value: 'dashed', label: 'Dashed' },
                            { value: 'dotted', label: 'Dotted' },
                            { value: 'double', label: 'Double' }
                        ]}
                    />
                </div>
                <ColorInput
                    label="Border Color"
                    value={settings.border.color}
                    onChange={(color) => updateNestedSetting('border', 'color', color)}
                />

                <CheckboxInput
                    label="Gradient Border"
                    checked={settings.borderGradientEnabled}
                    onChange={(borderGradientEnabled) => updateSetting('borderGradientEnabled', borderGradientEnabled)}
                />
                {settings.borderGradientEnabled && (
                    <>
                        <RangeInput
                            label="Border Gradient Angle"
                            value={settings.borderGradientAngle}
                            onChange={(borderGradientAngle) => updateSetting('borderGradientAngle', borderGradientAngle)}
                            {...CONSTRAINTS.angle}
                            unit="°"
                        />
                        <GradientStopEditor
                            stops={settings.borderGradientStops}
                            onChange={(borderGradientStops) => updateSetting('borderGradientStops', borderGradientStops)}
                        />
                    </>
                )}

                <div className="mt-4">
                    <CheckboxInput
                        label="Outline Ring"
                        checked={settings.outlineRing.enabled}
                        onChange={(enabled) => updateNestedSetting('outlineRing', 'enabled', enabled)}
                    />
                    {settings.outlineRing.enabled && (
                        <div className="mt-3 space-y-3 pl-6">
                            <RangeInput
                                label="Ring Width"
                                value={settings.outlineRing.width}
                                onChange={(width) => updateNestedSetting('outlineRing', 'width', width)}
                                {...CONSTRAINTS.borderWidth}
                            />
                            <ColorInput
                                label="Ring Color"
                                value={settings.outlineRing.color}
                                onChange={(color) => updateNestedSetting('outlineRing', 'color', color)}
                            />
                            <RangeInput
                                label="Ring Opacity"
                                value={settings.outlineRing.opacity}
                                onChange={(opacity) => updateNestedSetting('outlineRing', 'opacity', opacity)}
                                {...CONSTRAINTS.opacity}
                                unit=""
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Shadows & Effects Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Shadows & Effects</h3>
                <div className="grid grid-cols-2 gap-4">
                    <RangeInput
                        label="Shadow Blur"
                        value={settings.boxShadowBlur}
                        onChange={(boxShadowBlur) => updateSetting('boxShadowBlur', boxShadowBlur)}
                        {...CONSTRAINTS.shadowBlur}
                    />
                    <RangeInput
                        label="Shadow Spread"
                        value={settings.boxShadowSpread}
                        onChange={(boxShadowSpread) => updateSetting('boxShadowSpread', boxShadowSpread)}
                        {...CONSTRAINTS.shadowSpread}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <RangeInput
                        label="Shadow X"
                        value={settings.boxShadowOffsetX}
                        onChange={(boxShadowOffsetX) => updateSetting('boxShadowOffsetX', boxShadowOffsetX)}
                        {...CONSTRAINTS.shadowOffset}
                    />
                    <RangeInput
                        label="Shadow Y"
                        value={settings.boxShadowOffsetY}
                        onChange={(boxShadowOffsetY) => updateSetting('boxShadowOffsetY', boxShadowOffsetY)}
                        {...CONSTRAINTS.shadowOffset}
                    />
                </div>
                <RangeInput
                    label="Shadow Opacity"
                    value={settings.boxShadowOpacity}
                    onChange={(boxShadowOpacity) => updateSetting('boxShadowOpacity', boxShadowOpacity)}
                    {...CONSTRAINTS.opacity}
                    unit=""
                />

                <CheckboxInput
                    label="Inner Shadow"
                    checked={settings.innerShadow.enabled}
                    onChange={(enabled) => updateNestedSetting('innerShadow', 'enabled', enabled)}
                />
                {settings.innerShadow.enabled && (
                    <div className="pl-6 space-y-3">
                        <RangeInput
                            label="Inner Blur"
                            value={settings.innerShadow.blur}
                            onChange={(blur) => updateNestedSetting('innerShadow', 'blur', blur)}
                            {...CONSTRAINTS.shadowBlur}
                        />
                        <RangeInput
                            label="Inner Opacity"
                            value={settings.innerShadow.opacity}
                            onChange={(opacity) => updateNestedSetting('innerShadow', 'opacity', opacity)}
                            {...CONSTRAINTS.opacity}
                            unit=""
                        />
                    </div>
                )}

                <CheckboxInput
                    label="Glassmorphism"
                    checked={settings.glass.enabled}
                    onChange={(enabled) => updateNestedSetting('glass', 'enabled', enabled)}
                />
                {settings.glass.enabled && (
                    <div className="pl-6 space-y-3">
                        <RangeInput
                            label="Backdrop Blur"
                            value={settings.glass.blur}
                            onChange={(blur) => updateNestedSetting('glass', 'blur', blur)}
                            min={0}
                            max={50}
                            unit="px"
                        />
                        <RangeInput
                            label="Background Opacity"
                            value={settings.glass.bgOpacity}
                            onChange={(bgOpacity) => updateNestedSetting('glass', 'bgOpacity', bgOpacity)}
                            {...CONSTRAINTS.opacity}
                            unit=""
                        />
                    </div>
                )}

                <CheckboxInput
                    label="Neon Glow"
                    checked={settings.neon.enabled}
                    onChange={(enabled) => updateNestedSetting('neon', 'enabled', enabled)}
                />
                {settings.neon.enabled && (
                    <div className="pl-6 space-y-3">
                        <ColorInput
                            label="Neon Color"
                            value={settings.neon.color}
                            onChange={(color) => updateNestedSetting('neon', 'color', color)}
                        />
                        <RangeInput
                            label="Intensity"
                            value={settings.neon.intensity}
                            onChange={(intensity) => updateNestedSetting('neon', 'intensity', intensity)}
                            {...CONSTRAINTS.intensity}
                            unit=""
                        />
                    </div>
                )}
            </section>

            {/* Animation Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Animation</h3>
                <SelectInput
                    label="Entry Animation"
                    value={settings.animation.type}
                    onChange={(type) => updateNestedSetting('animation', 'type', type)}
                    options={[
                        { value: 'none', label: 'None' },
                        { value: 'fadeIn', label: 'Fade In' },
                        { value: 'pop', label: 'Pop' },
                        { value: 'slideUp', label: 'Slide Up' },
                        { value: 'slideIn', label: 'Slide In' },
                        { value: 'rise', label: 'Rise' }
                    ]}
                />
                <div className="grid grid-cols-2 gap-4">
                    <RangeInput
                        label="Duration"
                        value={settings.animation.duration}
                        onChange={(duration) => updateNestedSetting('animation', 'duration', duration)}
                        {...CONSTRAINTS.duration}
                        unit="ms"
                    />
                    <RangeInput
                        label="Delay"
                        value={settings.animation.delay}
                        onChange={(delay) => updateNestedSetting('animation', 'delay', delay)}
                        {...CONSTRAINTS.duration}
                        unit="ms"
                    />
                </div>

                <CheckboxInput
                    label="Idle Animation"
                    checked={settings.idleAnim.enabled}
                    onChange={(enabled) => updateNestedSetting('idleAnim', 'enabled', enabled)}
                />
                {settings.idleAnim.enabled && (
                    <div className="pl-6 space-y-3">
                        <SelectInput
                            label="Type"
                            value={settings.idleAnim.type}
                            onChange={(type) => updateNestedSetting('idleAnim', 'type', type)}
                            options={[
                                { value: 'float', label: 'Float' },
                                { value: 'bob', label: 'Bob' }
                            ]}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <RangeInput
                                label="Amplitude"
                                value={settings.idleAnim.amplitude}
                                onChange={(amplitude) => updateNestedSetting('idleAnim', 'amplitude', amplitude)}
                                {...CONSTRAINTS.amplitude}
                            />
                            <RangeInput
                                label="Duration"
                                value={settings.idleAnim.duration}
                                onChange={(duration) => updateNestedSetting('idleAnim', 'duration', duration)}
                                {...CONSTRAINTS.duration}
                                unit="ms"
                            />
                        </div>
                    </div>
                )}
            </section>

            {/* Dots Loader Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Dots Loader</h3>
                <CheckboxInput
                    label="Show Dots"
                    checked={!!settings.dots}
                    onChange={(checked) => {
                        updateSetting('dots', checked ? { color: '#F8FAFC', size: 6, spacing: 6, animation: 'bounce' } : undefined);
                    }}
                />
                {settings.dots && (
                    <div className="pl-6 space-y-3">
                        <ColorInput
                            label="Dot Color"
                            value={settings.dots.color}
                            onChange={(color) => updateNestedSetting('dots', 'color', color)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <RangeInput
                                label="Dot Size"
                                value={settings.dots.size}
                                onChange={(size) => updateNestedSetting('dots', 'size', size)}
                                {...CONSTRAINTS.dotSize}
                            />
                            <RangeInput
                                label="Spacing"
                                value={settings.dots.spacing}
                                onChange={(spacing) => updateNestedSetting('dots', 'spacing', spacing)}
                                {...CONSTRAINTS.dotSpacing}
                            />
                        </div>
                        <SelectInput
                            label="Animation"
                            value={settings.dots.animation}
                            onChange={(animation) => updateNestedSetting('dots', 'animation', animation)}
                            options={[
                                { value: 'bounce', label: 'Bounce' },
                                { value: 'pulse', label: 'Pulse' },
                                { value: 'none', label: 'None' }
                            ]}
                        />
                    </div>
                )}
            </section>

            <div className="mt-6 flex justify-between">
                <Button
                    onClick={async () => {
                        try {
                            const settingsJson = JSON.stringify(settings, null, 2);
                            await navigator.clipboard.writeText(settingsJson);
                            toast.success('Bubble settings copied to clipboard!');
                        } catch (err) {
                            toast.error(`Failed to copy: ${String(err)}`);
                            alert('Failed to copy settings. Check console.');
                        }
                    }}
                >
                    Copy Settings
                </Button>

                <DownloadComponents settings={settings} />
            </div>
        </div >
    );
};

export default BubbleModifier;
