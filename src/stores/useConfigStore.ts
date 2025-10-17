import { create } from 'zustand';
import { BubblePixelSettings } from '@/components/pixel-modifier/bubble/bubbletype';
import { ChatbarSettings } from '@/components/pixel-modifier/chatbar/chatbartype';
import { ChatWidgetSettings } from '@/components/pixel-modifier/chatwidget/chat-widget-types';

export interface ChatWidgetConfig {
  id?: number;
  customerId: number;
  websiteId: number;
  bubblejson: BubblePixelSettings;
  chatbarjson: ChatbarSettings;
  chatwindowjson?: Record<string, any>;
  chatwidgetSettings: ChatWidgetSettings;
  createdAt?: string;
  updatedAt?: string;
}

interface ConfigStore {
  widgets: ChatWidgetConfig[];
  setAllConfigs: (configs: ChatWidgetConfig[]) => void;
  updateWidget: (id: number, updatedData: Partial<ChatWidgetConfig>) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  widgets: [],
  setAllConfigs: (configs) => set({ widgets: configs }),
  updateWidget: (id, updatedData) =>
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, ...updatedData } : w
      ),
    })),
}));
