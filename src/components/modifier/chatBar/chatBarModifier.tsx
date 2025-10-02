'use client';

import { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import Loader from '@/components/loader/Loader';
import { useSettingsStore } from '@/stores/settingsStore';
import { ChatbarSettings } from '@/types/Modifier';
import ChatBarPreview from './chatBarPreview';
import defaultConfig from '../../../../data/modifier.json';

interface ChatBarModifierProps {
  defaultSettings?: ChatbarSettings; // SSR
}

const TextInputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  name: keyof ChatbarSettings;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

const ColorInputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  name: keyof ChatbarSettings;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <div className="flex items-center border rounded-md overflow-hidden">
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        className="w-full px-2 py-2 text-sm focus:outline-none"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <input
        type="color"
        name={name}
        className="w-12 h-12 cursor-pointer border-l"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  </div>
);

export default function ChatBarModifier({ defaultSettings }: ChatBarModifierProps) {
  const { resolvedTheme } = useTheme();
  const { settings, updateSettings, loading } = useSettingsStore();
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  const [localSettings, setLocalSettings] = useState<ChatbarSettings>(
    defaultSettings ?? {
      text: defaultConfig.chatBar.text || 'Chat with us',
      bgColor: defaultConfig.chatBar.bgColor || '#007bff',
      textColor: defaultConfig.chatBar.textColor || '#ffffff',
      iconColor: defaultConfig.chatBar.iconColor || '#ffffff',
      bubbleBgColor: defaultConfig.chatBar.bubbleBgColor || '#007bff',
      dotsColor: defaultConfig.chatBar.dotsColor || '#ffffff',
    }
  );

  // ✅ Mount for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Dark mode
  useEffect(() => {
    if (mounted) setIsDarkMode(resolvedTheme === 'dark');
  }, [mounted, resolvedTheme]);

  // ✅ Sync store to local settings if no local changes
  useEffect(() => {
    if (settings?.chatBar && !hasLocalChanges) {
      setLocalSettings(settings.chatBar as ChatbarSettings);
    }
  }, [settings, hasLocalChanges]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings((prev) => ({ ...prev, [name]: value }));
    setHasLocalChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings('chatBar', localSettings);
      setHasLocalChanges(false);
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
              {[...Array(6)].map((_, i) => (
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}
      <div className={isSaving ? 'blur-sm' : ''}>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold">Chat Bar Customization</h2>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            disabled={isSaving}
          >
            Save
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-5 pr-4 border-r border-gray-300 dark:border-gray-700">
            <TextInputField
              label="Chat Bar Text"
              name="text"
              value={localSettings.text}
              onChange={handleInputChange}
              placeholder="Chat with us"
              disabled={isSaving}
            />
            <ColorInputField
              label="Background Color"
              name="bgColor"
              value={localSettings.bgColor}
              onChange={handleInputChange}
              placeholder="#007bff"
              disabled={isSaving}
            />
            <ColorInputField
              label="Text Color"
              name="textColor"
              value={localSettings.textColor}
              onChange={handleInputChange}
              placeholder="#ffffff"
              disabled={isSaving}
            />
            <ColorInputField
              label="Icon Color"
              name="iconColor"
              value={localSettings.iconColor}
              onChange={handleInputChange}
              placeholder="#ffffff"
              disabled={isSaving}
            />
            <ColorInputField
              label="Bubble Background Color"
              name="bubbleBgColor"
              value={localSettings.bubbleBgColor}
              onChange={handleInputChange}
              placeholder="#007bff"
              disabled={isSaving}
            />
            <ColorInputField
              label="Dots Color"
              name="dotsColor"
              value={localSettings.dotsColor}
              onChange={handleInputChange}
              placeholder="#ffffff"
              disabled={isSaving}
            />
          </div>

          <div className="flex-1 flex justify-center items-start">
            <ChatBarPreview defaultSettings={localSettings} />
          </div>
        </div>
      </div>
    </div>
  );
}
