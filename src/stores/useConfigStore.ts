import { create } from 'zustand';
import { BubblePixelSettings } from '@/components/pixel-modifier/bubble/bubbletype';
import { ChatbarSettings } from '@/components/pixel-modifier/chatbar/chatbartype';
import { ChatWidgetSettings } from '@/components/pixel-modifier/chatwidget/chat-widget-types';

interface ConfigStore {
  bubble: BubblePixelSettings | null;
  chatbar: ChatbarSettings | null;
  chatwidget: ChatWidgetSettings | null;
  setBubble: (data: BubblePixelSettings) => void;
  setChatbar: (data: ChatbarSettings) => void;
  setChatwidget: (data: ChatWidgetSettings) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  bubble: null,
  chatbar: null,
  chatwidget: null,
  setBubble: (data) => set({ bubble: data }),
  setChatbar: (data) => set({ chatbar: data }),
  setChatwidget: (data) => set({ chatwidget: data }),
}));
