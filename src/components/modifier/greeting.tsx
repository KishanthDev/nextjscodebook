'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import Loader from '../loader/Loader';
import { useSettingsStore } from '@/stores/settingsStore';
import { GreetingSettings } from '@/types/Modifier';

type LiveChatWidgetProps = {
  defaultSettings: GreetingSettings;
};

const CloseIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
    <path d="M17.4,16l5.3,5.3c0.4,0.4,0.4,1,0,1.4c-0.4,0.4-1,0.4-1.4,0L16,17.4l-5.3,5.3c-0.4,0.4-1,0.4-1.4,0 c-0.4-0.4-0.4-1,0-1.4l5.3-5.3l-5.3-5.3c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4,0.4,1-0.4,1.4,0 c0.4,0.4,0.4,1,0,1.4L17.4,16z" />
  </svg>
);

const CustomButton = ({
  text,
  bgColor,
  icon,
  isVisible,
}: {
  text: string;
  bgColor: string;
  icon?: React.ReactNode;
  isVisible: boolean;
}) => {
  if (!isVisible) return null;
  return (
    <li>
      <button
        className="w-full flex justify-center items-center px-4 py-2 text-white rounded-md transition text-sm break-words max-w-full"
        style={{ backgroundColor: bgColor }}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {text}
      </button>
    </li>
  );
};

const GreetingImage = ({ src, alt, fallbackSrc }: { src: string; alt: string; fallbackSrc: string }) => (
  <div className="flex">
    <Image
      src={src || fallbackSrc}
      alt={alt}
      width={230}
      height={150}
      className="object-contain"
      onError={(e) => {
        e.currentTarget.src = fallbackSrc;
      }}
    />
  </div>
);

export default function Greeting({ defaultSettings }: LiveChatWidgetProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const { resolvedTheme } = useTheme();
  const { settings, fetchSettings, updateSettings, loading } = useSettingsStore();

  const [localSettings, setLocalSettings] = useState<GreetingSettings>(() => ({
    headingColor: defaultSettings.headingColor || '#000000',
    paraColor: defaultSettings.paraColor || '#333333',
    primaryBtnColor: defaultSettings.primaryBtnColor || '#007bff',
    secondaryBtnColor: defaultSettings.secondaryBtnColor || '#28a745',
    headingText: defaultSettings.headingText || 'Welcome to LiveChat!',
    paraText: defaultSettings.paraText || 'Sign up free or talk with our product experts',
    imageUrl: defaultSettings.imageUrl || '/landingpage/hello01.png',
    primaryBtnText: defaultSettings.primaryBtnText || 'Primary',
    secondaryBtnText: defaultSettings.secondaryBtnText || 'Secondary',
    showPrimaryBtn: defaultSettings.showPrimaryBtn ?? true,
    showSecondaryBtn: defaultSettings.showSecondaryBtn ?? true,
  }));

  useEffect(() => {
    setMounted(true);
    fetchSettings('greeting', localSettings);
  }, [fetchSettings]);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  useEffect(() => {
    if (settings.greeting && !hasLocalChanges) {
      setLocalSettings((prev) => ({
        ...prev,
        ...settings.greeting,
      }));
      console.log('Synced localSettings with store:', settings.greeting);
    }
  }, [settings.greeting, hasLocalChanges]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLocalSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setHasLocalChanges(true);
    console.log(`Updated localSettings[${name}]:`, type === 'checkbox' ? checked : value);
  };

  const handleSave = async () => {
    // Basic validation
    if (!localSettings.headingText.trim() || !localSettings.paraText.trim()) {
      toast.error('Heading and paragraph text cannot be empty');
      return;
    }
    if (!localSettings.imageUrl.trim()) {
      toast.error('Image URL cannot be empty');
      return;
    }
    if (localSettings.showPrimaryBtn && !localSettings.primaryBtnText.trim()) {
      toast.error('Primary button text cannot be empty when button is shown');
      return;
    }
    if (localSettings.showSecondaryBtn && !localSettings.secondaryBtnText.trim()) {
      toast.error('Secondary button text cannot be empty when button is shown');
      return;
    }

    setIsSaving(true);
    try {
      await updateSettings('greeting', localSettings);
      setHasLocalChanges(false); // Allow store sync after save
      toast.success('Settings saved!');
      console.log('Saved to database:', localSettings);
    } catch (err) {
      toast.error('Error saving settings');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <SkeletonTheme
        baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
      >
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <Skeleton width={200} height={32} />
            <Skeleton width={80} height={40} borderRadius={6} />
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4 pr-4 border-r border-gray-300 dark:border-gray-700">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton width={150} height={16} />
                  <div className="flex items-center">
                    <Skeleton width="100%" height={40} borderRadius={6} containerClassName="flex-1" />
                    {i < 4 && <Skeleton width={48} height={40} borderRadius={0} />}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1">
              <Skeleton width={230} height={425} borderRadius={8} />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div className="relative p-6 max-w-4xl mx-auto">
      {isSaving && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}
      <div className={isSaving ? 'blur-sm' : ''}>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold">Chat Widget Customization</h2>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={isSaving}
          >
            Save
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4 border-r pr-4">
            {[
              { key: 'headingText', label: 'Heading Text', type: 'text', placeholder: 'Enter heading', maxLength: 19 },
              { key: 'paraText', label: 'Paragraph Text', type: 'text', placeholder: 'Enter paragraph', maxLength: 38 },
              { key: 'imageUrl', label: 'Image URL', type: 'text', placeholder: 'Enter image URL' },
              { key: 'headingColor', label: 'Heading Color', type: 'color' },
              { key: 'paraColor', label: 'Paragraph Color', type: 'color' },
              {
                key: 'primaryBtnText',
                label: 'Primary Button Text',
                type: 'text',
                placeholder: 'Enter primary button text',
                maxLength: 20,
                checkboxKey: 'showPrimaryBtn',
                checkboxLabel: 'Show',
              },
              {
                key: 'secondaryBtnText',
                label: 'Secondary Button Text',
                type: 'text',
                placeholder: 'Enter secondary button text',
                maxLength: 20,
                checkboxKey: 'showSecondaryBtn',
                checkboxLabel: 'Show',
              },
              { key: 'primaryBtnColor', label: 'Primary Button Color', type: 'color' },
              { key: 'secondaryBtnColor', label: 'Secondary Button Color', type: 'color' },
            ].map(({ key, label, type, placeholder, maxLength, checkboxKey, checkboxLabel }) => (
              <div key={key}>
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <label className="block text-sm font-medium text-primary">{label}:</label>
                  {checkboxKey && (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name={checkboxKey}
                        checked={localSettings[checkboxKey as keyof GreetingSettings] as boolean}
                        onChange={handleInputChange}
                        disabled={isSaving}
                        className="mr-1"
                        aria-label={checkboxLabel}
                      />
                      <span className="text-sm">{checkboxLabel}</span>
                    </label>
                  )}
                </div>
                {type !== 'checkbox' && (
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <input
                      type={type === 'color' ? 'text' : type}
                      name={key}
                      placeholder={type === 'color' ? '#hex' : placeholder}
                      maxLength={maxLength}
                      className="w-full px-2 py-2 text-sm focus:outline-none"
                      value={localSettings[key as keyof GreetingSettings] as string}
                      onChange={handleInputChange}
                      disabled={isSaving}
                    />
                    {type === 'color' && (
                      <input
                        type="color"
                        name={key}
                        className="w-12 h-12 cursor-pointer border-l"
                        value={localSettings[key as keyof GreetingSettings] as string}
                        onChange={handleInputChange}
                        disabled={isSaving}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div
              className="relative w-[230px] mx-auto group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className={`absolute -top-7 right-0 z-20 transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <button aria-label="Hide greeting" style={{ color: localSettings.headingColor }}>
                  <CloseIcon />
                </button>
              </div>

              <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden min-h-[300px]">
                <GreetingImage
                  src={localSettings.imageUrl}
                  alt="Greeting image"
                  fallbackSrc="/landingpage/hello01.png"
                />

                <div className="p-3.5">
                  <h2
                    className="mb-2 break-words max-w-full box-border"
                    style={{ color: localSettings.headingColor }}
                  >
                    {localSettings.headingText}
                  </h2>
                  <p
                    className="break-words max-w-full box-border"
                    style={{ color: localSettings.paraColor }}
                  >
                    {localSettings.paraText}
                  </p>
                </div>

                <ul className="flex flex-col gap-2 px-2 pb-2 pt-[7px] mt-auto">
                  <CustomButton
                    text={localSettings.primaryBtnText}
                    bgColor={localSettings.primaryBtnColor}
                    isVisible={localSettings.showPrimaryBtn}
                  />
                  <CustomButton
                    text={localSettings.secondaryBtnText}
                    bgColor={localSettings.secondaryBtnColor}
                    icon={<span>💬</span>}
                    isVisible={localSettings.showSecondaryBtn}
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}