'use client';

import { useState } from 'react';
import Bubble from '../../../components/modifier/bubble';
import ChatBar from '../../../components/modifier/chatBar/chatBarModifier';
import ChatWidgetOpen from '../../../components/modifier/chat-widget/ChatWidgetOpenComponent';
import Eyecatcher from '../../../components/modifier/eye-catcher';
import data from "../../../../data/modifier.json"
import Greeting from '@/components/modifier/greeting';
import ChatWidgetContactComponent from '@/components/modifier/chat-widget-contact/ChatWidgetContactComponent';


export default function SettingsPage() {
  const [selectedOption, setSelectedOption] = useState('eyecatcher');
  const eyecatcherdata = data.eyeCatcher;
  const bubbledata = data.bubble;
  const chatbardata = data.chatBar;
  const chatwidgetdata = data.chatWidget;
  const chatwidgetmessage = data.chatWidget.messages;
  const chatwidgetcontact = data.chatWidgetContact;
  const chatwidgetcontactmessage = data.chatWidgetContact.messages;
  const greeting = data.greeting

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case 'eyecatcher':
        return <Eyecatcher defaultSettings={eyecatcherdata} />;
      case 'bubble':
        return <Bubble defaultSettings={bubbledata} />;
      case 'chat-bar':
        return <ChatBar defaultSettings={chatbardata} />;
      case 'chat-widget-open':
        return <ChatWidgetOpen defaultSettings={chatwidgetdata} initialMessages={chatwidgetmessage} />;
      case 'chat-widget-contact':
        return <ChatWidgetContactComponent defaultSettings={chatwidgetcontact} initialMessages={chatwidgetcontactmessage} />;
      case 'chat-widget-greeting':
        return <Greeting defaultSettings={greeting} />
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
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
            <span className='text-sm font-semibold'>Eyecatcher</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="settingOption"
              value="bubble"
              checked={selectedOption === 'bubble'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <span className='text-sm font-semibold'>Bubble</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="settingOption"
              value="chat-bar"
              checked={selectedOption === 'chat-bar'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <span className='text-sm font-semibold'>Chat Bar</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="settingOption"
              value="chat-widget-open"
              checked={selectedOption === 'chat-widget-open'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <span className='text-sm font-semibold'>Chat Widget Open</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="settingOption"
              value="chat-widget-greeting"
              checked={selectedOption === 'chat-widget-greeting'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <span className='text-sm font-semibold'>Chat Widget Greeting</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="settingOption"
              value="chat-widget-contact"
              checked={selectedOption === 'chat-widget-contact'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <span className='text-sm font-semibold'>Chat Widget Contact</span>
          </label>
        </div>
      </div>

      {/* Render the selected component */}
      <div>{renderSelectedComponent()}</div>
    </div>
  );
}
