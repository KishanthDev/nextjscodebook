"use client";
import { useEffect, useState } from 'react';

export default function ChatWidgetOpenComponent() {
  const [settings, setSettings] = useState({
    botMsgBgColor: '',
    userMsgBgColor: '',
    sendBtnBgColor: '',
    sendBtnIconColor: '',
    footerBgColor: '',
    footerTextColor: ''
  });

  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', isUser: false },
    { text: 'I need help with my order', isUser: true }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chatWidgetSettings');
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
      // Fallback to default settings if no saved settings
      setSettings({
        botMsgBgColor: '#f3f4f6',
        userMsgBgColor: '#fef08a',
        sendBtnBgColor: '#000000',
        sendBtnIconColor: '#ffffff',
        footerBgColor: '#ffffff',
        footerTextColor: '#374151'
      });
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (
      settings.botMsgBgColor &&
      settings.userMsgBgColor &&
      settings.sendBtnBgColor &&
      settings.sendBtnIconColor &&
      settings.footerBgColor &&
      settings.footerTextColor
    ) {
      console.log('Saving to localStorage:', settings); // Debug log
      localStorage.setItem('chatWidgetSettings', JSON.stringify(settings));
    }
  }, [settings]);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    setMessages(prev => [
      ...prev,
      { text: newMessage, isUser: true }
    ]);
    setNewMessage('');
    
    // Auto-scroll to bottom
    setTimeout(() => {
      const messagesContainer = document.getElementById('messagesContainer');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 10);
  };

  const addEmoji = (emoji:any) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSave = () => {
    localStorage.setItem('chatWidgetSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold">Chat Widget Customization</h2>
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
          {/* Bot Message Background */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bot Message Background Color:</label>
            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="text"
                name="botMsgBgColor"
                placeholder="#f3f4f6"
                className="w-full px-2 py-2 text-sm focus:outline-none"
                value={settings.botMsgBgColor}
                onChange={handleInputChange}
              />
              <input
                type="color"
                name="botMsgBgColor"
                className="w-12 h-12 cursor-pointer border-l"
                value={settings.botMsgBgColor}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* User Message Background */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Message Background Color:</label>
            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="text"
                name="userMsgBgColor"
                placeholder="#fef08a"
                className="w-full px-2 py-2 text-sm focus:outline-none"
                value={settings.userMsgBgColor}
                onChange={handleInputChange}
              />
              <input
                type="color"
                name="userMsgBgColor"
                className="w-12 h-12 cursor-pointer border-l"
                value={settings.userMsgBgColor}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Send Button Background */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Send Button Background Color:</label>
            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="text"
                name="sendBtnBgColor"
                placeholder="#000000"
                className="w-full px-2 py-2 text-sm focus:outline-none"
                value={settings.sendBtnBgColor}
                onChange={handleInputChange}
              />
              <input
                type="color"
                name="sendBtnBgColor"
                className="w-12 h-12 cursor-pointer border-l"
                value={settings.sendBtnBgColor}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Send Button Icon Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Send Button Icon Color:</label>
            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="text"
                name="sendBtnIconColor"
                placeholder="#ffffff"
                className="w-full px-2 py-2 text-sm focus:outline-none"
                value={settings.sendBtnIconColor}
                onChange={handleInputChange}
              />
              <input
                type="color"
                name="sendBtnIconColor"
                className="w-12 h-12 cursor-pointer border-l"
                value={settings.sendBtnIconColor}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Footer Background */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Footer Background Color:</label>
            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="text"
                name="footerBgColor"
                placeholder="#ffffff"
                className="w-full px-2 py-2 text-sm focus:outline-none"
                value={settings.footerBgColor}
                onChange={handleInputChange}
              />
              <input
                type="color"
                name="footerBgColor"
                className="w-12 h-12 cursor-pointer border-l"
                value={settings.footerBgColor}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Footer Text Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text Color:</label>
            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="text"
                name="footerTextColor"
                placeholder="#374151"
                className="w-full px-2 py-2 text-sm focus:outline-none"
                value={settings.footerTextColor}
                onChange={handleInputChange}
              />
              <input
                type="color"
                name="footerTextColor"
                className="w-12 h-12 cursor-pointer border-l"
                value={settings.footerTextColor}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex justify-center items-start">
          <div className="w-[370px] h-[700px] border rounded-lg overflow-hidden shadow-lg flex flex-col">
            {/* Header */}
            <div className="p-3 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center gap-2">
                  <img 
                    src="https://res.cloudinary.com/dfbqxsiud/image/upload/v1720047961/users/663e7a3a159e95e303d68afb/ChatMatrix/66415c89d553dbb92bacbbf4/profile_picture.png" 
                    alt="LiveChat Logo" 
                    className="w-8 h-8 rounded-full border"
                  />
                  <span className="text-sm font-semibold">LiveChat</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="p-1 text-gray-600 hover:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button 
                  className="p-1 text-gray-600 hover:text-gray-900 relative"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Send transcript</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Move chat to mobile</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sounds</a>
                      </div>
                    </div>
                  )}
                </button>
                
                <button className="p-1 text-gray-600 hover:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div 
              id="messagesContainer"
              className="p-4 flex-1 overflow-y-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`px-3 py-2 rounded-lg max-w-xs ${message.isUser ? 'rounded-br-none' : 'rounded-bl-none'}`}
                      style={{
                        backgroundColor: message.isUser ? settings.userMsgBgColor : settings.botMsgBgColor
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Input Area */}
            <div className="p-3 border-t relative">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <button 
                    className="p-1 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  
                  <button 
                    className={`p-1 rounded-lg ${newMessage.trim() ? 'bg-black text-white' : 'text-gray-400'}`}
                    style={{
                      backgroundColor: settings.sendBtnBgColor,
                      color: settings.sendBtnIconColor
                    }}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {showEmojiPicker && (
                <div className="absolute bottom-12 right-0 bg-white border rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1">
                  {['😊', '👍', '❤️', '😂', '😢', '😎', '🤔', '👋', '🎉', '💯', '🔥', '🚀'].map(emoji => (
                    <button 
                      key={emoji}
                      className="text-xl hover:bg-gray-100 rounded p-1"
                      onClick={() => addEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div 
              className="p-1 text-center text-xs border-t"
              style={{
                backgroundColor: settings.footerBgColor,
                color: settings.footerTextColor
              }}
            >
              Powered by LiveChat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}