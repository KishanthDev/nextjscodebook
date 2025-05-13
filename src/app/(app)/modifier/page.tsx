'use client';

import { useState } from 'react';
import Bubble from '../bubble/page';
import ChatBar from '../chat-bar/page';
import ChatWidgetOpen from '../chat-widget-open/page';
import Eyecatcher from '../eye-catcher/page'; // You had a comment here, now properly imported

export default function SettingsPage() {
  const [selectedOption, setSelectedOption] = useState('eyecatcher');

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case 'eyecatcher':
        return <Eyecatcher />;
      case 'bubble':
        return <Bubble />;
      case 'chat-bar':
        return <ChatBar />;
      case 'chat-widget-open':
        return <ChatWidgetOpen />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Radio Buttons Group - horizontal layout */}
      <div>
        <label className="block font-semibold text-lg mb-2">Choose Setting Type:</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="settingOption"
              value="eyecatcher"
              checked={selectedOption === 'eyecatcher'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <span>Eyecatcher</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="settingOption"
              value="bubble"
              checked={selectedOption === 'bubble'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <span>Bubble</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="settingOption"
              value="chat-bar"
              checked={selectedOption === 'chat-bar'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <span>Chat Bar</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="settingOption"
              value="chat-widget-open"
              checked={selectedOption === 'chat-widget-open'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <span>Chat Widget Open</span>
          </label>
        </div>
      </div>

      {/* Render the selected component */}
      <div>{renderSelectedComponent()}</div>
    </div>
  );
}
