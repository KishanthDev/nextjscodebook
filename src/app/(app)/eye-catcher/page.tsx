'use client';
import { useEffect, useState } from 'react';

type EyecatcherSettings = {
  title: string;
  text: string;
  bgColor: string;
  textColor: string;
};

type EyecatcherComponentProps = {
  defaultSettings?: EyecatcherSettings;
};

export default function EyecatcherComponent({ defaultSettings }: EyecatcherComponentProps) {
  const [settings, setSettings] = useState<EyecatcherSettings | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('eyecatcherSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error parsing localStorage settings:', error);
        setSettings(defaultSettings || {
          title: '',
          text: '',
          bgColor: '',
          textColor: ''
        });
      }
    } else {
      setSettings(defaultSettings || {
        title: '',
        text: '',
        bgColor: '',
        textColor: ''
      });
    }
    setLoaded(true);
  }, [defaultSettings]);

  useEffect(() => {
    if (settings && settings.title && settings.text && settings.bgColor && settings.textColor) {
      localStorage.setItem('eyecatcherSettings', JSON.stringify(settings));
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSave = () => {
    if (settings) {
      localStorage.setItem('eyecatcherSettings', JSON.stringify(settings));
      alert('Settings saved successfully!');
    }
  };

  if (!loaded || !settings) return <p className="p-4 text-gray-500">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold">Eyecatcher Customization</h2>
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
                    {/* Welcome Message */}
                    <div>
                        <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-2">Welcome Message:</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Hello"
                            maxLength={20}
                            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={settings.title}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Invitation Text */}
                    <div>
                        <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-2">Invitation Text:</label>
                        <input
                            type="text"
                            name="text"
                            placeholder="Click to chat with us"
                            maxLength={36}
                            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                                className="w-full px-2 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none"
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
                                className="w-full px-2 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none"
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
                        className="flex w-[13rem] p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md"
                        style={{
                            backgroundColor: settings.bgColor,
                            color: settings.textColor
                        }}
                    >
                        {/* Emoji on the left */}
                        <span className="text-3xl animate-wave flex-shrink-0 mr-3" style={{ animationDuration: '1.5s' }}>
                            👋
                        </span>

                        {/* Text on the right */}
                        <div className="flex flex-col min-w-0">
                            <h3 className="font-bold text-sm leading-tight break-words">{settings.title}</h3>
                            <p className="text-xs break-words whitespace-normal">{settings.text}</p>
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