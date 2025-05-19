'use client';
import { useState, useEffect } from 'react';
import { ChatWidgetSettings } from '@/types/Modifier';

const EMOJIS = ['😊', '👍', '❤️', '😂', '😢', '😎', '🤔', '👋', '🎉', '💯', '🔥', '🚀'];

type Props = {
    settings: ChatWidgetSettings;
    newMessage: string;
    setNewMessage: (value: string) => void;
    onSendMessage: () => void;
    onTyping: (isTyping: boolean) => void; // New callback for typing
    isSaving: boolean;
};

export default function ChatInputArea({ settings, newMessage, setNewMessage, onSendMessage,onTyping, isSaving }: Props) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const addEmoji = (emoji: string) => {
        setNewMessage(newMessage + emoji);
        setShowEmojiPicker(false);
    };

    // Detect typing and notify parent
    useEffect(() => {
        const typingTimeout = setTimeout(() => {
            if (newMessage.trim() && !isSaving) {
                setIsTyping(true);
                onTyping(true);
            } else {
                setIsTyping(false);
                onTyping(false);
            }
        }, 300); // Delay to debounce typing

        return () => clearTimeout(typingTimeout);
    }, [newMessage, isSaving, onTyping]);

    return (
        <div className="p-3 border-t relative bg-white dark:bg-gray-800">
            <div className="flex items-center relative">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={settings.inputPlaceholder || 'Type a message...'}
                    className="flex-1 max-w-full border rounded-lg px-3 py-2 pr-24 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                    disabled={isSaving}
                />
                <div className="absolute right-2 flex gap-1">
                    <button
                        className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        disabled={isSaving}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </button>
                    <button
                        className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                        disabled={isSaving}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                        </svg>
                    </button>
                    <button
                        className={`p-1 rounded-lg ${newMessage.trim() ? 'text-white' : 'text-gray-400'}`}
                        style={{
                            backgroundColor: newMessage.trim() ? settings.sendBtnBgColor || '#000000' : '#d1d5db',
                            color: settings.sendBtnIconColor || '#ffffff',
                        }}
                        onClick={onSendMessage}
                        disabled={!newMessage.trim() || isSaving}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {showEmojiPicker && (
                <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1">
                    {EMOJIS.map((emoji) => (
                        <button
                            key={emoji}
                            className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1"
                            onClick={() => addEmoji(emoji)}
                            disabled={isSaving}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}