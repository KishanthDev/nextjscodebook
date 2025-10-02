'use client';
import { useState, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'sonner';
import Loader from '../loader/Loader';
import { useSettingsStore } from '@/stores/settingsStore';
import { BubbleSettings } from '@/types/Modifier';
import BubbleIcon from '../icons/BubbleIcon';

type BubbleComponentProps = { defaultSettings: BubbleSettings };

export default function BubbleComponent({ defaultSettings }: BubbleComponentProps) {
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [localSettings, setLocalSettings] = useState<BubbleSettings>(defaultSettings);

  const { settings, loading, updateSettings } = useSettingsStore();

  // Initialize store and local state
  useEffect(() => {
    setMounted(true);
    // Hydrate store with defaultSettings only if store is empty
    if (!settings.bubble || Object.keys(settings.bubble).length === 0) {
      useSettingsStore.setState((state) => ({
        settings: {
          ...state.settings,
          bubble: { ...defaultSettings },
        },
      }));
    }
    setLocalSettings(settings.bubble || defaultSettings);
  }, [defaultSettings, settings.bubble]);

  // Sync localSettings with store changes
  useEffect(() => {
    if (settings.bubble) {
      setLocalSettings(settings.bubble);
    }
  }, [settings.bubble]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings('bubble', localSettings);
      toast.success('Bubble settings saved!');
    } catch (err) {
      toast.error('Error saving bubble settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <Skeleton width={200} height={32} />
            <Skeleton width={80} height={40} borderRadius={6} />
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4 pr-4 border-r border-gray-300">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton width={150} height={16} />
                  <div className="flex items-center">
                    <Skeleton width="100%" height={40} borderRadius={6} containerClassName="flex-1" />
                    <Skeleton width={48} height={40} borderRadius={0} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 flex justify-center items-center">
              <Skeleton circle height={64} width={64} />
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
          <h2 className="text-2xl font-bold">Bubble Customization</h2>
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
            {(['bgColor', 'iconColor', 'dotsColor'] as const).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-primary mb-2">
                  {key === 'bgColor'
                    ? 'Bubble Background'
                    : key === 'iconColor'
                    ? 'Bubble Icon'
                    : 'Bubble Dots'}
                  :
                </label>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <input
                    type="text"
                    name={key}
                    value={localSettings[key] || ''}
                    onChange={handleInputChange}
                    className="w-full px-2 py-2 text-sm focus:outline-none"
                  />
                  <input
                    type="color"
                    name={key}
                    value={localSettings[key] || '#000000'}
                    onChange={handleInputChange}
                    className="w-12 h-12 cursor-pointer border-l"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 flex justify-center items-center">
            <div
              className="relative flex items-center justify-center rounded-full w-16 h-16 transition-colors duration-300 cursor-pointer"
              style={{ backgroundColor: localSettings.bgColor }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <BubbleIcon
                iconColor={localSettings.iconColor}
                bgColor={localSettings.bgColor}
                dotsColor={localSettings.dotsColor}
                hovered={isHovered}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}