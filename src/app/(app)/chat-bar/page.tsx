'use client';
import { useEffect, useState } from 'react';

export default function ChatBarComponent() {
  const [settings, setSettings] = useState({
    text: '',
    bgColor: '',
    textColor: ''
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chatBarSettings');
    console.log('Loaded from localStorage:', savedSettings); // Debug log
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        console.log('Parsed settings:', parsedSettings); // Debug log
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing localStorage settings:', error);
      }
    } else {
      // Fallback to default settings
      setSettings({
        text: 'Chat with us',
        bgColor: '#007bff',
        textColor: '#ffffff'
      });
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (settings.text && settings.bgColor && settings.textColor) {
      console.log('Saving to localStorage:', settings); // Debug log
      localStorage.setItem('chatBarSettings', JSON.stringify(settings));
    }
  }, [settings]);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('chatBarSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

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