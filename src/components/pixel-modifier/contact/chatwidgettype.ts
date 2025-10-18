// chatwidgettype.ts
export interface Message {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

export interface ChatWidgetSettings {
  // Header Settings
  logoUrl: string;
  chatTitle: string;
  headerBgColor: string;
  headerTextColor: string;
  headerHeight: number;
  showBackButton: boolean;
  showMenuButton: boolean;
  showMinimizeButton: boolean;
  
  // Widget Dimensions
  widgetWidth: number;
  widgetHeight: number;
  
  // Messages Settings
  userMsgBgColor: string;
  userMsgTextColor: string;
  botMsgBgColor: string;
  botMsgTextColor: string;
  msgFontSize: number;
  msgBorderRadius: number;
  msgPadding: number;
  msgSpacing: number;
  showTimestamp: boolean;
  
  // Background
  chatBgColor: string;
  chatBgGradientEnabled: boolean;
  chatBgGradientType: 'linear' | 'radial' | 'conic';
  chatBgGradientAngle: number;
  chatBgGradientStops: Array<{ color: string; pos: number }>;
  
  // Input Area
  inputPlaceholder: string;
  inputBgColor: string;
  inputTextColor: string;
  inputBorderColor: string;
  inputBorderRadius: number;
  inputHeight: number;
  inputFontSize: number;
  
  // Send Button
  sendBtnBgColor: string;
  sendBtnIconColor: string;
  sendBtnBorderRadius: number;
  sendBtnSize: number;
  
  // Emoji & Attachments
  showEmojiPicker: boolean;
  showAttachButton: boolean;
  emojiButtonColor: string;
  attachButtonColor: string;
  
  // Footer
  footerBgColor: string;
  footerTextColor: string;
  footerText: string;
  footerHeight: number;
  showFooter: boolean;
  
  // Contact Form
  formBgColor: string;
  formBorderColor: string;
  formBorderRadius: number;
  formTitle: string;
  formMessage1: string;
  formMessage2: string;
  formTitleColor: string;
  formMessageColor: string;
  formLabelColor: string;
  formInputBgColor: string;
  formInputBorderColor: string;
  formInputBorderRadius: number;
  
  // Submit Button
  submitBtnBgColor: string;
  submitBtnFontColor: string;
  submitBtnText: string;
  submitBtnSubmittedText: string;
  submitBtnBorderRadius: number;
  submitBtnHeight: number;
  
  // Typing Indicator
  typingIndicatorColor: string;
  typingIndicatorBgColor: string;
  showTypingIndicator: boolean;
  
  // Shadows & Borders
  widgetShadow: boolean;
  widgetShadowColor: string;
  widgetShadowBlur: number;
  widgetBorderEnabled: boolean;
  widgetBorderColor: string;
  widgetBorderWidth: number;
  widgetBorderRadius: number;
  
  // Scrollbar
  scrollbarWidth: number;
  scrollbarThumbColor: string;
  scrollbarTrackColor: string;
  
  // Animation
  messageAnimationEnabled: boolean;
  messageAnimationType: 'fade' | 'slide' | 'scale' | 'none';
  animationDuration: number;
}

export const DEFAULT_CHAT_WIDGET_SETTINGS: ChatWidgetSettings = {
  logoUrl: 'https://via.placeholder.com/32',
  chatTitle: 'Support Chat',
  headerBgColor: '#ffffff',
  headerTextColor: '#1f2937',
  headerHeight: 56,
  showBackButton: true,
  showMenuButton: true,
  showMinimizeButton: true,
  widgetWidth: 370,
  widgetHeight: 700,
  userMsgBgColor: '#3b82f6',
  userMsgTextColor: '#ffffff',
  botMsgBgColor: '#f3f4f6',
  botMsgTextColor: '#1f2937',
  msgFontSize: 14,
  msgBorderRadius: 15,
  msgPadding: 12,
  msgSpacing: 12,
  showTimestamp: false,
  chatBgColor: '#ffffff',
  chatBgGradientEnabled: false,
  chatBgGradientType: 'linear',
  chatBgGradientAngle: 135,
  chatBgGradientStops: [
    { color: '#ffffff', pos: 0 },
    { color: '#f3f4f6', pos: 100 },
  ],
  inputPlaceholder: 'Type a message...',
  inputBgColor: '#ffffff',
  inputTextColor: '#1f2937',
  inputBorderColor: '#d1d5db',
  inputBorderRadius: 8,
  inputHeight: 44,
  inputFontSize: 14,
  sendBtnBgColor: '#000000',
  sendBtnIconColor: '#ffffff',
  sendBtnBorderRadius: 8,
  sendBtnSize: 32,
  showEmojiPicker: true,
  showAttachButton: true,
  emojiButtonColor: '#6b7280',
  attachButtonColor: '#6b7280',
  footerBgColor: '#f9fafb',
  footerTextColor: '#6b7280',
  footerText: 'Powered by ChatWidget',
  footerHeight: 32,
  showFooter: true,
  formBgColor: '#ffffff',
  formBorderColor: '#000000',
  formBorderRadius: 12,
  formTitle: 'Contact Us',
  formMessage1: 'Please fill in the form we will reach out',
  formMessage2: 'We are sorry our chat experts are busy right now',
  formTitleColor: '#1f2937',
  formMessageColor: '#6b7280',
  formLabelColor: '#374151',
  formInputBgColor: '#ffffff',
  formInputBorderColor: '#d1d5db',
  formInputBorderRadius: 8,
  submitBtnBgColor: '#3b82f6',
  submitBtnFontColor: '#ffffff',
  submitBtnText: 'Submit',
  submitBtnSubmittedText: 'Submitted!',
  submitBtnBorderRadius: 24,
  submitBtnHeight: 44,
  typingIndicatorColor: '#6b7280',
  typingIndicatorBgColor: '#f3f4f6',
  showTypingIndicator: true,
  widgetShadow: true,
  widgetShadowColor: '#00000026',
  widgetShadowBlur: 20,
  widgetBorderEnabled: true,
  widgetBorderColor: '#e5e7eb',
  widgetBorderWidth: 1,
  widgetBorderRadius: 12,
  scrollbarWidth: 6,
  scrollbarThumbColor: '#d1d5db',
  scrollbarTrackColor: '#f3f4f6',
  messageAnimationEnabled: true,
  messageAnimationType: 'slide',
  animationDuration: 0.3,
};