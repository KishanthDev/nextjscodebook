'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import Loader from '../loader/Loader';

type ChatWidgetSettings = {
  headingColor: string;
  paraColor: string;
  freeTrialBtnColor: string;
  expertBtnColor: string;
};

type LiveChatWidgetProps = {
  defaultSettings: ChatWidgetSettings;
};

const CloseIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
    <path d="M17.4,16l5.3,5.3c0.4,0.4,0.4,1,0,1.4c-0.4,0.4-1,0.4-1.4,0L16,17.4l-5.3,5.3c-0.4,0.4-1,0.4-1.4,0 c-0.4-0.4-0.4-1,0-1.4l5.3-5.3l-5.3-5.3c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4,0.4,1-0.4,1.4,0 c0.4,0.4,0.4,1,0,1.4L17.4,16z" />
  </svg>
);

export default function Greeting({ defaultSettings }: LiveChatWidgetProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [settings, setSettings] = useState<ChatWidgetSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings?section=greeting');
        if (res.ok) {
          const json = await res.json();
          if (json.settings) {
            setSettings(json.settings);
          } else {
            setSettings(defaultSettings);
          }
        } else {
          setSettings(defaultSettings);
        }
      } catch (err) {
        console.error('Failed to fetch settings', err);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [defaultSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'greeting', data: settings }),
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
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <Skeleton width={200} height={32} />
            <Skeleton width={80} height={40} borderRadius={6} />
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4 pr-4 border-r border-gray-300 dark:border-gray-700">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton width={150} height={16} />
                  <div className="flex items-center">
                    <Skeleton width="100%" height={40} borderRadius={6} containerClassName="flex-1" />
                    <Skeleton width={48} height={40} borderRadius={0} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1">
              <Skeleton width={230} height={350} borderRadius={8} />
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
              { key: 'headingColor', label: 'Heading Color' },
              { key: 'paraColor', label: 'Paragraph Color' },
              { key: 'freeTrialBtnColor', label: 'Free Trial Button Color' },
              { key: 'expertBtnColor', label: 'Product Expert Button Color' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-primary mb-2">
                  {label}:
                </label>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <input
                    type="text"
                    name={key}
                    placeholder="#hex"
                    className="w-full px-2 py-2 text-sm focus:outline-none"
                    value={settings[key as keyof ChatWidgetSettings]}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                  <input
                    type="color"
                    name={key}
                    className="w-12 h-12 cursor-pointer border-l"
                    value={settings[key as keyof ChatWidgetSettings]}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                </div>
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
                <button aria-label="Hide greeting" style={{ color: settings.headingColor }}>
                  <CloseIcon />
                </button>
              </div>

              <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex">
                  <Image
                    src="/landingpage/hello01.png"
                    alt="Hello"
                    width={230}
                    height={150}
                    className="object-contain"
                  />
                </div>

                <div className="p-3.5">
                  <h2 className="mb-2" style={{ color: settings.headingColor }}>
                    Welcome to LiveChat!
                  </h2>
                  <p style={{ color: settings.paraColor }}>
                    Sign up free or talk with our product experts
                  </p>
                </div>

                <ul className="flex flex-col gap-2 px-2 pb-2 pt-[7px]">
                  <li>
                    <button
                      className="w-full flex justify-center px-4 py-2 text-white rounded-md transition"
                      style={{ backgroundColor: settings.freeTrialBtnColor }}
                    >
                      Free trial
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full flex justify-center items-center px-4 py-2 text-white rounded-md transition"
                      style={{ backgroundColor: settings.expertBtnColor }}
                    >
                      <span className="mr-2">💬</span> Product expert
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}