'use client';

import React, { useState, ChangeEvent } from 'react';

// Placeholder components
const Eyecatcher = () => (
  <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg text-center">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Eyecatcher Component</h2>
    <p className="text-gray-700 dark:text-gray-200">This is the Eyecatcher component content.</p>
  </div>
);

const Bubble = () => (
  <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bubble Component</h2>
    <p className="text-gray-700 dark:text-gray-200">This is the Bubble component content.</p>
  </div>
);

const ChatBar = () => (
  <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg text-center">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chat Bar Component</h2>
    <p className="text-gray-700 dark:text-gray-200">This is the Chat Bar component content.</p>
  </div>
);

const ChatWidgetOpen = () => (
  <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-center">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chat Widget Open Component</h2>
    <p className="text-gray-700 dark:text-gray-200">This is the Chat Widget Open component content.</p>
  </div>
);

const ChatWidgetLanding = () => (
  <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg text-center">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chat Widget Landing Component</h2>
    <p className="text-gray-700 dark:text-gray-200">This is the Chat Widget Landing component content.</p>
  </div>
);

// Radio value types
type ChatOption =
  | ''
  | 'eyecatcher'
  | 'bubble'
  | 'chat_bar'
  | 'chat_widget'
  | 'chat_widget_landing';

const RadioOptions: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<ChatOption>('');

  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value as ChatOption);
  };

  const componentMap: Record<Exclude<ChatOption, ''>, React.FC> = {
    eyecatcher: Eyecatcher,
    bubble: Bubble,
    chat_bar: ChatBar,
    chat_widget: ChatWidgetOpen,
    chat_widget_landing: ChatWidgetLanding,
  };

  const SelectedComponent = selectedOption ? componentMap[selectedOption] : null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10 flex flex-col items-center">
      <form className="w-full max-w-3xl">
        <fieldset>
          <legend className="text-lg font-semibold mb-6 text-center text-gray-900 dark:text-white">
            Choose a chat option:
          </legend>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { value: 'eyecatcher', label: 'Eyecatcher' },
              { value: 'bubble', label: 'Bubble' },
              { value: 'chat_bar', label: 'Chat Bar' },
              { value: 'chat_widget', label: 'Chat Widget Open' },
              { value: 'chat_widget_landing', label: 'Chat Widget Landing' },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="chat_option"
                  value={value}
                  onChange={handleOptionChange}
                  className="accent-blue-500 dark:accent-blue-400"
                />
                <span className="text-gray-900 dark:text-gray-200">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      {/* Render selected component below the form */}
      {SelectedComponent && (
        <div className="w-full max-w-3xl mt-10">
          <SelectedComponent />
        </div>
      )}
    </div>
  );
};

export default RadioOptions;
