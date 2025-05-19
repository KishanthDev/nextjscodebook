export type Message = {
  text: string;
  isUser: boolean;
};

export type ChatWidgetSettings = {
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
  messages: Message[];
};

export type ChatWidgetContactSettings = {
  formTitle:string;
  botMsgBgColor: string;
  formMessage1: string;
  formMessage2: string;
  userMsgBgColor: string;
  sendBtnBgColor: string;
  sendBtnIconColor: string;
  footerBgColor: string;
  footerTextColor: string;
  footerText: string;
   submitBtnBgColor: string;
  formBgColor: string;
  submitBtnFontColor: string;
  submitBtnText: string;
  submitBtnSubmittedText: string;
  inputPlaceholder: string;
  logoUrl: string;
  chatTitle: string;
  messages: Message[];
};

export type EyecatcherSettings = {
  title: string;
  text: string;
  bgColor: string;
  textColor: string;
};

export type BubbleSettings = {
  bgColor: string;
  iconColor: string;
  dotsColor: string;
};

export type ChatbarSettings = {
  text: string;
  bgColor: string;
  textColor: string;
};

export type GreetingSettings = {
  headingColor: string;
  paraColor: string;
  primaryBtnColor: string;
  secondaryBtnColor: string;
  headingText: string;
  paraText: string;
  imageUrl: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  showPrimaryBtn: boolean;
  showSecondaryBtn: boolean;
};

export type AppSettings = {
  eyeCatcher: EyecatcherSettings;
  bubble: BubbleSettings;
  chatBar: ChatbarSettings;
  chatWidget: ChatWidgetSettings;
  chatWidgetContact: ChatWidgetContactSettings;
  greeting: GreetingSettings;
};