'use client';
import { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import Loader from '../loader/Loader';
import { useSettingsStore } from '@/stores/settingsStore';
import { EyecatcherSettings } from '@/types/Modifier';

export default function EyecatcherComponent({ defaultSettings }: { defaultSettings?: EyecatcherSettings }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { settings, fetchSettings, updateSettings, loading } = useSettingsStore();

  const eyeCatcherSettings: EyecatcherSettings = {
    ...settings.eyeCatcher,
    title: settings.eyeCatcher?.title ?? defaultSettings?.title ?? 'Hello',
    text: settings.eyeCatcher?.text ?? defaultSettings?.text ?? 'Click to chat with us',
    bgColor: settings.eyeCatcher?.bgColor ?? defaultSettings?.bgColor ?? '#007bff',
    textColor: settings.eyeCatcher?.textColor ?? defaultSettings?.textColor ?? '#ffffff',
  };

  useEffect(() => {
    setMounted(true);
    console.log('Fetching eyecatcher settings...');
    fetchSettings('eyeCatcher', defaultSettings ?? {
      title: 'Hello',
      text: 'Click to chat with us',
      bgColor: '#007bff',
      textColor: '#ffffff',
    });
  }, [defaultSettings, fetchSettings]);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateSettings('eyeCatcher', { [name]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings('eyeCatcher', eyeCatcherSettings);
      toast.success('Settings saved!');
    } catch (err) {
      toast.error('Error saving settings');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  if (loading || !settings.eyeCatcher) {
    return (
      <SkeletonTheme
        baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
      >
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <Skeleton width={220} height={32} />
            <Skeleton width={80} height={40} borderRadius={6} />
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4 pr-4 border-r border-gray-300 dark:border-gray-700">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton width={150} height={16} />
                  {i < 2 ? (
                    <Skeleton width="100%" height={40} borderRadius={6} />
                  ) : (
                    <div className="flex items-center">
                      <Skeleton width="100%" height={40} borderRadius={6} containerClassName="flex-1" />
                      <Skeleton width={48} height={40} borderRadius={0} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex-1 flex justify-center items-start">
              <Skeleton width={208} height={96} borderRadius={8} />
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
          <h2 className="text-2xl font-bold">Eyecatcher Customization</h2>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={isSaving}
          >
            Save
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4 border-r pr-4">
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-2">Welcome Message:</label>
              <input
                type="text"
                name="title"
                placeholder="Hello"
                maxLength={20}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={eyeCatcherSettings.title}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-2">Invitation Text:</label>
              <input
                type="text"
                name="text"
                placeholder="Click to chat with us"
                maxLength={36}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={eyeCatcherSettings.text}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-2">Background Color:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="bgColor"
                  placeholder="#007bff"
                  className="w-full px-3 py-3 text-sm focus:outline-none"
                  value={eyeCatcherSettings.bgColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <input
                  type="color"
                  name="bgColor"
                  className="w-12 h-12 cursor-pointer border-l"
                  value={eyeCatcherSettings.bgColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-2">Text Color:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="textColor"
                  placeholder="#ffffff"
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={eyeCatcherSettings.textColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <input
                  type="color"
                  name="textColor"
                  className="w-12 h-12 cursor-pointer border-l"
                  value={eyeCatcherSettings.textColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-start">
            <div
              className="flex w-[13rem] p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md"
              style={{
                backgroundColor: eyeCatcherSettings.bgColor,
                color: eyeCatcherSettings.textColor,
              }}
            >
              <span className="text-3xl animate-wave flex-shrink-0 mr-3" style={{ animationDuration: '1.5s' }}>
                👋
              </span>
              <div className="flex flex-col min-w-0">
                <h3 className="font-bold text-sm leading-tight break-words">{eyeCatcherSettings.title}</h3>
                <p className="text-xs break-words whitespace-normal">{eyeCatcherSettings.text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: rotate(0deg);
          }
          10% {
            transform: rotate(14deg);
          }
          20% {
            transform: rotate(-8deg);
          }
          30% {
            transform: rotate(14deg);
          }
          40% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(10deg);
          }
          60% {
            transform: rotate(0deg);
          }
        }
        .animate-wave {
          display: inline-block;
          animation: wave 1.5s infinite;
          transform-origin: 70% 70%;
        }
      `}</style>
    </div>
  );
}