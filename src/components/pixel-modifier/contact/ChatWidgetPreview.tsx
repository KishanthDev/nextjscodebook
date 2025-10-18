'use client';

import React, { useState, useMemo } from 'react';
import { X, Menu, Minus, ChevronLeft, Send, Smile, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatWidgetSettings, Message } from './chatwidgettype';
import { SaveButton } from '../lib/SaveButton';
import { CopyDownloadButtons } from '../lib/CopyDownloadButtons';

interface PreviewProps {
  settings: ChatWidgetSettings;
}

const SAMPLE_MESSAGES: Message[] = [
  { text: 'Hi! How can I help you today?', isUser: false, timestamp: new Date() },
  { text: 'I need help with my order', isUser: true, timestamp: new Date() },
  { text: "I'd be happy to help! Can you provide your order number?", isUser: false, timestamp: new Date() },
];

const EMOJIS = ['😊', '👍', '❤️', '😂', '😢', '😎', '🤔', '👋', '🎉', '💯'];

export default function ChatWidgetPreview({ settings }: PreviewProps) {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const backgroundStyle = useMemo(() => {
    if (!settings.chatBgGradientEnabled) return settings.chatBgColor;
    const stops = settings.chatBgGradientStops.map((s) => `${s.color} ${s.pos}%`).join(', ');
    switch (settings.chatBgGradientType) {
      case 'linear':
        return `linear-gradient(${settings.chatBgGradientAngle}deg, ${stops})`;
      case 'radial':
        return `radial-gradient(circle, ${stops})`;
      case 'conic':
        return `conic-gradient(from ${settings.chatBgGradientAngle}deg, ${stops})`;
      default:
        return settings.chatBgColor;
    }
  }, [
    settings.chatBgGradientEnabled,
    settings.chatBgGradientType,
    settings.chatBgGradientAngle,
    settings.chatBgGradientStops,
    settings.chatBgColor,
  ]);

  const widgetShadow = settings.widgetShadow
    ? `0 0 ${settings.widgetShadowBlur}px ${settings.widgetShadowColor}`
    : 'none';

  const widgetBorder = settings.widgetBorderEnabled
    ? `${settings.widgetBorderWidth}px solid ${settings.widgetBorderColor}`
    : 'none';

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, isUser: true, timestamp: new Date() }]);
      setNewMessage('');
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = { name: '', email: '', subject: '', message: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email';
      isValid = false;
    }
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
      isValid = false;
    }
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsFormSubmitted(true);
      setTimeout(() => {
        setShowContactForm(false);
        setIsFormSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 2000);
    }
  };

  const getAnimationVariants = () => {
    switch (settings.messageAnimationType) {
      case 'fade':
        return { initial: { opacity: 0 }, animate: { opacity: 1 } };
      case 'slide':
        return { initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 } };
      case 'scale':
        return { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 } };
      default:
        return { initial: {}, animate: {} };
    }
  };

  return (
    <div className="flex-1 relative bg-gray-50 dark:bg-neutral-800 rounded p-6 flex flex-col justify-center items-center transition-colors duration-200">
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <CopyDownloadButtons settings={settings} filename="chatwidget-settings.json" />
        <SaveButton type="chatwidget" data={settings} />
      </div>
      <div
        className="flex flex-col overflow-y-auto"
        style={{
          width: settings.widgetWidth,
          maxHeight: settings.widgetHeight,
          boxShadow: widgetShadow,
          border: widgetBorder,
          borderRadius: `${settings.widgetBorderRadius}px`,
        }}
      >
        {/* Header */}
        <header
          className="flex justify-between items-center px-3 border-b"
          style={{
            height: settings.headerHeight,
            backgroundColor: settings.headerBgColor,
            color: settings.headerTextColor,
          }}
        >
          <div className="flex items-center gap-2">
            <img
              src={settings.logoUrl}
              alt="Logo"
              className="w-8 h-8 rounded-full"
              onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/32')}
            />
            <span className="text-sm font-semibold">{settings.chatTitle}</span>
          </div>
          <nav className="flex gap-2">
            {settings.showBackButton && (
              <button className="p-1 hover:opacity-70">
                <ChevronLeft size={20} />
              </button>
            )}
            {settings.showMenuButton && (
              <button
                className="p-1 relative"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <Menu size={20} />
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 text-sm">
                    <button className="w-full text-left px-4 py-2">
                      Send transcript
                    </button>
                    <button
                      className="w-full text-left px-4 py-2"
                      onClick={() => {
                        setShowContactForm(!showContactForm);
                        setShowDropdown(false);
                      }}
                    >
                      {showContactForm ? 'Back to Chat' : 'Contact Form'}
                    </button>
                  </div>
                )}
              </button>
            )}
            {settings.showMinimizeButton && (
              <button className="p-1 hover:opacity-70">
                <Minus size={20} />
              </button>
            )}
          </nav>
        </header>

        {/* Chat Area */}
        <div
          className="flex-1 overflow-y-auto p-4"
          style={{
            background: backgroundStyle,
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              width: ${settings.scrollbarWidth}px;
            }
            div::-webkit-scrollbar-track {
              background: ${settings.scrollbarTrackColor};
            }
            div::-webkit-scrollbar-thumb {
              background: ${settings.scrollbarThumbColor};
              border-radius: 10px;
            }
          `}</style>

          {/* Contact Form */}
          {showContactForm ? (
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: settings.formBgColor,
                borderRadius: `${settings.formBorderRadius}px`,
                border: `1px solid ${settings.formBorderColor}`,
              }}
            >
              {!isFormSubmitted && (
                <div className="mb-4 text-center">
                  <p
                    className="text-lg font-bold pb-2"
                    style={{ color: settings.formTitleColor }}
                  >
                    {settings.formMessage1}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: settings.formMessageColor }}
                  >
                    {settings.formMessage2}
                  </p>
                </div>
              )}

              <h3
                className="text-base font-semibold mb-3"
                style={{ color: settings.formTitleColor }}
              >
                {settings.formTitle}
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: settings.formLabelColor }}
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Your Name"
                    disabled={isFormSubmitted}
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{
                      backgroundColor: settings.formInputBgColor,
                      border: `1px solid ${settings.formInputBorderColor}`,
                      borderRadius: `${settings.formInputBorderRadius}px`,
                      color: settings.formLabelColor,
                    }}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: settings.formLabelColor }}
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Your Email"
                    disabled={isFormSubmitted}
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{
                      backgroundColor: settings.formInputBgColor,
                      border: `1px solid ${settings.formInputBorderColor}`,
                      borderRadius: `${settings.formInputBorderRadius}px`,
                      color: settings.formLabelColor,
                    }}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: settings.formLabelColor }}
                  >
                    Subject:
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    placeholder="Subject"
                    disabled={isFormSubmitted}
                    className="w-full px-3 py-2 text-sm outline-none"
                    style={{
                      backgroundColor: settings.formInputBgColor,
                      border: `1px solid ${settings.formInputBorderColor}`,
                      borderRadius: `${settings.formInputBorderRadius}px`,
                      color: settings.formLabelColor,
                    }}
                  />
                  {formErrors.subject && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: settings.formLabelColor }}
                  >
                    Message:
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Your Message"
                    rows={3}
                    disabled={isFormSubmitted}
                    className="w-full px-3 py-2 text-sm outline-none resize-none"
                    style={{
                      backgroundColor: settings.formInputBgColor,
                      border: `1px solid ${settings.formInputBorderColor}`,
                      borderRadius: `${settings.formInputBorderRadius}px`,
                      color: settings.formLabelColor,
                    }}
                  />
                  {formErrors.message && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center mt-4 space-y-2">
                  <motion.button
                    type="submit"
                    disabled={isFormSubmitted}
                    className="rounded-full text-sm font-medium flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: settings.submitBtnBgColor,
                      color: settings.submitBtnFontColor,
                      borderRadius: `${settings.submitBtnBorderRadius}px`,
                      height: `${settings.submitBtnHeight}px`,
                      width: isFormSubmitted ? `${settings.submitBtnHeight}px` : '100%',
                    }}
                    animate={{
                      width: isFormSubmitted ? `${settings.submitBtnHeight}px` : '100%',
                    }}
                  >
                    {isFormSubmitted ? (
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.2 }}
                        transition={{
                          type: 'spring',
                          stiffness: 260,
                          damping: 20,
                          delay: 0.1,
                        }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </motion.svg>
                    ) : (
                      settings.submitBtnText
                    )}
                  </motion.button>

                  {isFormSubmitted && (
                    <motion.div
                      className="text-sm font-semibold"
                      style={{ color: settings.submitBtnBgColor }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      {settings.submitBtnSubmittedText}
                    </motion.div>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Messages */}
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`flex mb-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    {...(settings.messageAnimationEnabled ? getAnimationVariants() : {})}
                    transition={{ duration: settings.animationDuration }}
                  >
                    <div
                      className={`max-w-xs break-words ${message.isUser ? 'rounded-br-none' : 'rounded-bl-none'}`}
                      style={{
                        backgroundColor: message.isUser
                          ? settings.userMsgBgColor
                          : settings.botMsgBgColor,
                        color: message.isUser
                          ? settings.userMsgTextColor
                          : settings.botMsgTextColor,
                        fontSize: `${settings.msgFontSize}px`,
                        borderRadius: `${settings.msgBorderRadius}px`,
                        padding: `${settings.msgPadding}px`,
                      }}
                    >
                      {message.text}
                      {settings.showTimestamp && (
                        <div className="text-xs opacity-60 mt-1">
                          {message.timestamp?.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && settings.showTypingIndicator && (
                <div className="flex justify-start">
                  <div
                    className="flex items-center gap-1 px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: settings.typingIndicatorBgColor,
                      borderRadius: `${settings.msgBorderRadius}px`,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: settings.typingIndicatorColor,
                        animationDelay: '0ms',
                      }}
                    />
                    <span
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: settings.typingIndicatorColor,
                        animationDelay: '150ms',
                      }}
                    />
                    <span
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: settings.typingIndicatorColor,
                        animationDelay: '300ms',
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        {!showContactForm && (
          <div className="p-3 border-t" style={{ backgroundColor: settings.headerBgColor }}>
            <div className="flex items-center relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={settings.inputPlaceholder}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 outline-none"
                style={{
                  backgroundColor: settings.inputBgColor,
                  color: settings.inputTextColor,
                  borderColor: settings.inputBorderColor,
                  borderRadius: `${settings.inputBorderRadius}px`,
                  height: `${settings.inputHeight}px`,
                  fontSize: `${settings.inputFontSize}px`,
                  padding: '0 12px',
                  paddingRight: '100px',
                  border: `1px solid ${settings.inputBorderColor}`,
                }}
              />
              <div className="absolute right-2 flex gap-1">
                {settings.showEmojiPicker && (
                  <button
                    className="p-1 hover:opacity-70 relative"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{ color: settings.emojiButtonColor }}
                  >
                    <Smile size={20} />
                    {showEmojiPicker && (
                      <div className="absolute bottom-8 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 grid grid-cols-5 gap-1 z-20">
                        {EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1"
                            onClick={() => addEmoji(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </button>
                )}
                {settings.showAttachButton && (
                  <button
                    className="p-1 hover:opacity-70"
                    style={{ color: settings.attachButtonColor }}
                  >
                    <Paperclip size={20} />
                  </button>
                )}
                <button
                  className="p-1 rounded-lg disabled:opacity-50"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  style={{
                    backgroundColor: newMessage.trim() ? settings.sendBtnBgColor : '#d1d5db',
                    color: settings.sendBtnIconColor,
                    borderRadius: `${settings.sendBtnBorderRadius}px`,
                    width: `${settings.sendBtnSize}px`,
                    height: `${settings.sendBtnSize}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {settings.showFooter && (
          <div
            className="text-center text-xs border-t"
            style={{
              backgroundColor: settings.footerBgColor,
              color: settings.footerTextColor,
              height: `${settings.footerHeight}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {settings.footerText}
          </div>
        )}
      </div>
    </div>
  );
}