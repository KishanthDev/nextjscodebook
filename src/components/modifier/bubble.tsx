'use client';
import { useState, useEffect } from 'react';

type BubbleSettings = {
  bgColor: string;
  iconColor: string;
  dotsColor: string;
};

type BubbleComponentProps = {
  defaultSettings: BubbleSettings;
};

export default function BubbleComponent({ defaultSettings }: BubbleComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [settings, setSettings] = useState<BubbleSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings?section=bubble');
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
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'bubble', data: settings }),
      });
      const result = await response.json();

      if (response.ok) {
        alert('Settings saved!');
      } else {
        alert('Failed to save settings: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error saving settings');
      console.error(err);
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold">Bubble Customization</h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Panel */}
        <div className="flex-1 space-y-4 border-r pr-4">
          {['bgColor', 'iconColor', 'dotsColor'].map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-primary mb-2">
                {key === 'bgColor'
                  ? 'Bubble Background Color'
                  : key === 'iconColor'
                  ? 'Bubble Icon Color'
                  : 'Bubble Dots Color'}
                :
              </label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name={key}
                  placeholder="#hex"
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={settings[key as keyof BubbleSettings]}
                  onChange={handleInputChange}
                />
                <input
                  type="color"
                  name={key}
                  className="w-12 h-12 cursor-pointer border-l"
                  value={settings[key as keyof BubbleSettings]}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex justify-center items-center">
          <div
            className="relative flex items-center justify-center rounded-full w-16 h-16 transition-colors duration-300 cursor-pointer"
            style={{ backgroundColor: settings.bgColor }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {!isHovered ? (
              <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
                <path
                  fill={settings.iconColor}
                  d="M12.63,26.46H8.83a6.61,6.61,0,0,1-6.65-6.07,89.05,89.05,0,0,1,0-11.2A6.5,6.5,0,0,1,8.23,3.25a121.62,121.62,0,0,1,15.51,0A6.51,6.51,0,0,1,29.8,9.19a77.53,77.53,0,0,1,0,11.2,6.61,6.61,0,0,1-6.66,6.07H19.48L12.63,31V26.46Z"
                />
                <path
                  fill={settings.bgColor}
                  d="M19.57,21.68h3.67a2.08,2.08,0,0,0,2.11-1.81,89.86,89.86,0,0,0,0-10.38,1.9,1.9,0,0,0-1.84-1.74,113.15,113.15,0,0,0-15,0A1.9,1.9,0,0,0,6.71,9.49a74.92,74.92,0,0,0-.06,10.38,2,2,0,0,0,2.1,1.81h3.81V26.5Z"
                />
              </svg>
            ) : (
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: settings.dotsColor,
                      animation: `jump 1.2s infinite ease-in-out ${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes jump {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
