'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';
import { useSettings } from '@/hooks/useSettings';
import { toast } from 'sonner';
import Loader from '@/components/loader/Loader';

type ChatWidgetSettings = {
  headingColor: string;
  paraColor: string;
  primaryBtnColor: string;
  secondaryBtnColor: string;
  headingText: string;
  paraText: string;
  imageUrl: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  showPrimaryBtn: boolean;
  showSecondaryBtn: boolean;
};

type GreetingProps = {
  showSettingsForm?: boolean;
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
      className="object-cover w-full"
      onError={(e) => {
        e.currentTarget.src = fallbackSrc;
      }}
    />
  </div>
);

export default function Greeting({ showSettingsForm = false }: GreetingProps) {
  const defaultSettings: ChatWidgetSettings = {
    headingColor: '#333333',
    paraColor: '#666666',
    primaryBtnColor: '#f97316',
    secondaryBtnColor: '#000000',
    headingText: 'Welcome to LiveChat!',
    paraText: 'Sign up free or talk with our product experts',
    imageUrl: '/landingpage/hello01.png',
    primaryBtnText: 'Primary',
    secondaryBtnText: 'Secondary',
    showPrimaryBtn: true,
    showSecondaryBtn: true,
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState<ChatWidgetSettings>(defaultSettings);
  const { resolvedTheme } = useTheme();
  const { settings, loading } = useSettings<ChatWidgetSettings>({
    section: 'greeting',
    defaultSettings,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  useEffect(() => {
    if (!loading) {
      setLocalSettings(settings);
    }
  }, [settings, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLocalSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    // Validation
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
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'greeting', data: localSettings }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Settings saved!');
      } else {
        toast.error('Failed to save settings: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      toast.error('Error saving settings');
      console.error(err);
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
        <div className="flex justify-center items-center p-6">
          <div className="relative w-[230px] mx-auto">
            <div className="absolute -top-7 right-0">
              <Skeleton width={24} height={24} circle />
            </div>
            <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
              <Skeleton width={230} height={150} />
              <div className="p-3.5 space-y-2">
                <Skeleton width={180} height={20} />
                <Skeleton width={200} height={16} />
              </div>
              <div className="px-2 pb-2 pt-[7px] space-y-2">
                <Skeleton width={206} height={40} borderRadius={6} />
                <Skeleton width={206} height={40} borderRadius={6} />
              </div>
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
        {showSettingsForm && (
          <>
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
                  { key: 'primaryBtnText', label: 'Primary Button Text', type: 'text', placeholder: 'Enter primary button text', maxLength: 20 },
                  { key: 'secondaryBtnText', label: 'Secondary Button Text', type: 'text', placeholder: 'Enter secondary button text', maxLength: 20 },
                  { key: 'showPrimaryBtn', label: 'Show Primary Button', type: 'checkbox' },
                  { key: 'showSecondaryBtn', label: 'Show Secondary Button', type: 'checkbox' },
                  { key: 'headingColor', label: 'Heading Color', type: 'color' },
                  { key: 'paraColor', label: 'Paragraph Color', type: 'color' },
                  { key: 'primaryBtnColor', label: 'Primary Button Color', type: 'color' },
                  { key: 'secondaryBtnColor', label: 'Secondary Button Color', type: 'color' },
                ].map(({ key, label, type, placeholder, maxLength }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-primary mb-2">{label}:</label>
                    {type === 'checkbox' ? (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name={key}
                          checked={localSettings[key as keyof ChatWidgetSettings] as boolean}
                          onChange={handleInputChange}
                          disabled={isSaving}
                          className="mr-2"
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ) : (
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <input
                          type={type === 'color' ? 'text' : type}
                          name={key}
                          placeholder={type === 'color' ? '#hex' : placeholder}
                          maxLength={maxLength}
                          className="w-full px-2 py-2 text-sm focus:outline-none"
                          value={localSettings[key as keyof ChatWidgetSettings] as string}
                          onChange={handleInputChange}
                          disabled={isSaving}
                        />
                        {type === 'color' && (
                          <input
                            type="color"
                            name={key}
                            className="w-12 h-12 cursor-pointer border-l"
                            value={localSettings[key as keyof ChatWidgetSettings] as string}
                            onChange={handleInputChange}
                            disabled={isSaving}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-center items-center">
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
              <button aria-label="Hide greeting" style={{ color: settings.headingColor }}>
                <CloseIcon />
              </button>
            </div>

            <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
              <GreetingImage
                src={settings.imageUrl}
                alt="Hello"
                fallbackSrc="/landingpage/hello01.png"
              />

              <div className="p-3.5 text-sm leading-snug break-words max-w-full overflow-hidden">
                <h2
                  className="mb-2 font-semibold"
                  style={{ color: settings.headingColor }}
                >
                  {settings.headingText}
                </h2>
                <p style={{ color: settings.paraColor }}>
                  {settings.paraText}
                </p>
              </div>

              <ul className="flex flex-col gap-2 px-2 pb-2 pt-[7px]">
                <CustomButton
                  text={settings.primaryBtnText}
                  bgColor={settings.primaryBtnColor}
                  isVisible={settings.showPrimaryBtn}
                />
                <CustomButton
                  text={settings.secondaryBtnText}
                  bgColor={settings.secondaryBtnColor}
                  icon={<span>💬</span>}
                  isVisible={settings.showSecondaryBtn}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}