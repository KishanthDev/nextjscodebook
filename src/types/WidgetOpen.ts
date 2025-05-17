export type Message = {
  text: string;
  isUser: boolean;
};

export type ChatWidgetSettings = {
  messages: import("c:/Mern/Intern/nextjscodebook/src/types/Modifier").Message[];
  botMsgBgColor: string;
  userMsgBgColor: string;
  sendBtnBgColor: string;
  sendBtnIconColor: string;
  footerBgColor: string;
  footerTextColor: string;
  footerText: string;
  inputPlaceholder: string;
  logoUrl: string;
  chatTitle: string;
};