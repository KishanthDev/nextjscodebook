import { BubblePixelSettings } from "@/components/widget-builder/bubble/bubbletype";
import { ChatbarSettings } from "@/components/widget-builder/chatbar/chatbartype";
import { ChatWidgetSettings } from "@/components/widget-builder/chatwidget/chat-widget-types";
// 👆 your existing bubble settings type import

export interface BaseWidget {
  _id: string;
  custId: string;
  custName: string;
  type: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface BubbleWidget extends BaseWidget {
  type: "bubble";
  bubbleName: string;
  bubbleSettings: BubblePixelSettings;
}

export interface ChatBarWidget extends BaseWidget {
  type: "chatBar";
  chatBarName: string;
  chatBarSettings: ChatbarSettings; // you can replace with a ChatBarSettings type later
}

export interface ChatWidgetOpen extends BaseWidget {
  type: "chatWidget";
  chatWidgetName: string;
  chatwidgetSettings: ChatWidgetSettings; // replace later when you have that type
}

export type WidgetItem = BubbleWidget | ChatBarWidget | ChatWidgetOpen;
