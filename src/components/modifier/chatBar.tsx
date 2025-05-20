'use client';
import { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import Loader from '../loader/Loader';
import { useSettingsStore } from '@/stores/settingsStore';
import { ChatbarSettings } from '@/types/Modifier';
import BubbleIcon from '../icons/BubbleIcon';

export default function ChatBarComponent({ defaultSettings }: { defaultSettings?: ChatbarSettings }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isHovered,setIsHovered] = useState(false)
  const [localSettings, setLocalSettings] = useState<ChatbarSettings>(
    defaultSettings ?? {
      text: 'Chat with us',
      bgColor: '#007bff',
      textColor: '#ffffff',
    }
  );
  const { resolvedTheme } = useTheme();
  const { settings, fetchSettings, updateSettings, loading } = useSettingsStore();

  useEffect(() => {
    setMounted(true);
    fetchSettings('chatBar', defaultSettings ?? {
      text: 'Chat with us',
      bgColor: '#007bff',
      textColor: '#ffffff',
    });
  }, [defaultSettings, fetchSettings]);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  useEffect(() => {
    if (settings.chatBar) {
      setLocalSettings((prev) => ({
        ...prev,
        ...settings.chatBar,
      }));
    }
  }, [settings.chatBar]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings('chatBar', localSettings);
      toast.success('Settings saved!');
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
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton width={150} height={16} />
                  {i === 0 ? (
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
              <Skeleton width={254.983} height={39.992} borderRadius={12.8} />
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
          <h2 className="text-2xl font-bold">Chat Bar Customization</h2>
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
              <label className="block text-sm font-medium mb-2">Chat Bar Text:</label>
              <input
                type="text"
                name="text"
                placeholder="Chat with us"
                maxLength={36}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={localSettings.text}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Background Color:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="bgColor"
                  placeholder="#007bff"
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={localSettings.bgColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <input
                  type="color"
                  name="bgColor"
                  className="w-12 h-12 cursor-pointer border-l"
                  value={localSettings.bgColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Text Color:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="textColor"
                  placeholder="#ffffff"
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={localSettings.textColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <input
                  type="color"
                  name="textColor"
                  className="w-12 h-12 cursor-pointer border-l"
                  value={localSettings.textColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-start">
            <div
              className="justify-between pl-4 pr-4 w-[254.983px] h-[39.992px] rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md flex  items-center"
              style={{
                backgroundColor: localSettings.bgColor,
                color: localSettings.textColor,
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="font-medium">{localSettings.text}</span>
              <BubbleIcon
                iconColor='#ffffff'
                bgColor='#ffffff'
                dotsColor='#ffffff'
                hovered={isHovered}
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}