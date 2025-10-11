export interface Message {
  text: string;
  isUser: boolean;
  tags?: string[];
}

export interface GradientStop {
  color: string;
  pos: number;
}

export interface ChatWidgetSettings {
  width: number;
  height: number;
  borderRadius: number;

  bgColor: string;
  gradientEnabled: boolean;
  gradientType: 'linear' | 'radial';
  gradientAngle: number;
  gradientStops: GradientStop[];

  headerBgColor: string;
  headerTextColor: string;
  logoUrl: string;
  chatTitle: string;

  userMsgBgColor: string;
  botMsgBgColor: string;
  messagesBgColor?: string;
  msgTextColor: string;
  fontFamily: string;
  fontSize: number;

  inputBgColor?: string;
  inputBorderColor?: string;
  inputTextColor?: string;
  inputPlaceholder: string;

  sendBtnBgColor: string;
  sendBtnIconColor: string;

  soundsEnabled: boolean;
  soundProfile: 'chime' | 'pop' | 'ding';

  footerBgColor: string;
  footerTextColor: string;
  footerText: string;

  messages?: Message[];
}
