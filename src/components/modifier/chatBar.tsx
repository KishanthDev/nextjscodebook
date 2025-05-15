'use client';

import { useEffect, useState } from 'react';
import Loader from '../loader/Loader';

type ChatBarSettings = {
  text: string;
  bgColor: string;
  textColor: string;
};

type Props = {
  defaultSettings: ChatBarSettings;
};

export default function ChatBarComponent({ defaultSettings }: Props) {
  const [settings, setSettings] = useState<ChatBarSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);

      try {
        const res = await fetch('/api/settings?section=chatBar');
        if (res.ok) {
          const json = await res.json();
          setSettings(json.settings ?? defaultSettings);
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
    if (settings) {
      setSettings((prev) => ({
        ...prev!,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'chatBar', data: settings }),
      });
      const result = await response.json();

      if (response.ok) {
        alert('Settings saved!');
      } else {
        alert('Failed to save settings: ' + result.error);
      }
    } catch (err) {
      alert('Error saving settings');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center min-h-[calc(100vh-64px)] items-center">
        <Loader />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold">Chat Bar Customization</h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Save
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Panel */}
        <div className="flex-1 space-y-4 border-r pr-4">
          {/* Chat Bar Text */}
          <div>
            <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-2">Chat Bar Text:</label>
            <input
              type="text"
              name="text"
              placeholder="Chat with us"
              maxLength={36}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={settings.text}
              onChange={handleInputChange}
            />
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-2">Background Color:</label>
            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="text"
                name="bgColor"
                placeholder="#007bff"
                className="w-full px-2 py-2 text-sm focus:outline-none"
                value={settings.bgColor}
                onChange={handleInputChange}
              />
              <input
                type="color"
                name="bgColor"
                className="w-12 h-12 cursor-pointer border-l"
                value={settings.bgColor}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-2">Text Color:</label>
            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="text"
                name="textColor"
                placeholder="#ffffff"
                className="w-full px-2 py-2 text-sm focus:outline-none"
                value={settings.textColor}
                onChange={handleInputChange}
              />
              <input
                type="color"
                name="textColor"
                className="w-12 h-12 cursor-pointer border-l"
                value={settings.textColor}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex justify-center items-start">
          <div
            className="w-full max-w-md p-3 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md flex justify-center items-center"
            style={{
              backgroundColor: settings.bgColor,
              color: settings.textColor
            }}
          >
            <span className="font-medium">{settings.text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
