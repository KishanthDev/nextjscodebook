'use client';

import { useState } from 'react';
import clsx from 'clsx';
import Bubble from '@/components/modifier/bubble';
import ChatBar from '@/components/modifier/chatBar/chatBarModifier';
import ChatWidgetOpen from '@/components/modifier/chat-widget/ChatWidgetOpenComponent';
import Eyecatcher from '@/components/modifier/eye-catcher';
import Greeting from '@/components/modifier/greeting';
import ChatWidgetContactComponent from '@/components/modifier/chat-widget-contact/ChatWidgetContactComponent';
import data from '../../../../data/modifier.json';
import EyecatcherPreview from '../eye-catcher/page';
import BubblePreview from '../bubble/page';
import ChatBarPreview from '../chat-bar/page';
import ChatWidgetPreview from '../chat-widget-open/page';
import ChatWidgetContactPreview from '../chat-contact-preview/page';
import GreetingPreview from '../greeting/page';


const TABS = [
  { label: 'All', value: 'all' },
  { value: 'eyecatcher', label: 'Eyecatcher' },
  { value: 'bubble', label: 'Bubble' },
  { value: 'chat-bar', label: 'Chat Bar' },
  { value: 'chat-widget-open', label: 'Chat Widget Open' },
  { value: 'chat-widget-greeting', label: 'Chat Widget Greeting' },
  { value: 'chat-widget-contact', label: 'Chat Widget Contact' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOption, setSelectedOption] = useState('eyecatcher');

  const eyecatcherdata = data.eyeCatcher;
  const bubbledata = data.bubble;
  const chatbardata = data.chatBar;
  const chatwidgetdata = data.chatWidget;
  const chatwidgetmessage = data.chatWidget.messages;
  const chatwidgetcontact = data.chatWidgetContact;
  const chatwidgetcontactmessage = data.chatWidgetContact.messages;
  const greeting = data.greeting;

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case 'eyecatcher':
        return <Eyecatcher defaultSettings={eyecatcherdata} />;
      case 'bubble':
        return <Bubble defaultSettings={bubbledata} />;
      case 'chat-bar':
        return <ChatBar defaultSettings={chatbardata} />;
      case 'chat-widget-open':
        return (
          <ChatWidgetOpen
            defaultSettings={chatwidgetdata}
            initialMessages={chatwidgetmessage}
          />
        );
      case 'chat-widget-contact':
        return (
          <ChatWidgetContactComponent
            defaultSettings={chatwidgetcontact}
            initialMessages={chatwidgetcontactmessage}
          />
        );
      case 'chat-widget-greeting':
        return <Greeting defaultSettings={greeting} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left Sidebar */}
      <aside className="w-[220px] border-r bg-gray-50 dark:bg-zinc-900 p-4">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Settings</h2>
        <nav className="flex flex-col gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={clsx(
                'px-3 py-2 rounded-md text-left text-sm font-medium capitalize',
                activeTab === tab.value
                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Right Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'all' ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <label className="block font-semibold text-lg mb-2">Choose Setting Type:</label>
              <div className="flex gap-6 flex-wrap">
                {[
                  { value: 'eyecatcher', label: 'Eyecatcher' },
                  { value: 'bubble', label: 'Bubble' },
                  { value: 'chat-bar', label: 'Chat Bar' },
                  { value: 'chat-widget-open', label: 'Chat Widget Open' },
                  { value: 'chat-widget-greeting', label: 'Chat Widget Greeting' },
                  { value: 'chat-widget-contact', label: 'Chat Widget Contact' },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="settingOption"
                      value={value}
                      checked={selectedOption === value}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    <span className="text-sm font-semibold">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Modifier Component */}
            <div>{renderSelectedComponent()}</div>
          </div>
        ) : (
          <div className="text-lg text-gray-600 dark:text-gray-300">
            {activeTab === 'eyecatcher' && <EyecatcherPreview/>}
            {activeTab === 'bubble' && <BubblePreview/>}
            {activeTab === 'chat-bar' && <ChatBarPreview/>}
            {activeTab === 'chat-widget-open' && <ChatWidgetPreview/>}
            {activeTab === 'chat-widget-contact' && <ChatWidgetContactPreview/>}
            {activeTab === 'chat-widget-greeting' && <GreetingPreview/>}
          </div>
        )}
      </main>
    </div>
  );
}
