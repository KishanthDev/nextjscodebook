import { create } from 'zustand';
import { BubblePixelSettings } from '@/components/widget-builder/bubble/bubbletype';
import { ChatbarSettings } from '@/components/widget-builder/chatbar/chatbartype';
import { ChatWidgetSettings } from '@/components/widget-builder/chatwidget/chat-widget-types';

export interface ChatWidgetConfig {
  id: number;
  customerId: number;
  websiteId: number;
  bubblejson: BubblePixelSettings;
  chatbarjson: ChatbarSettings;
  chatwindowjson: Record<string, any>;
  chatwidgetSettings: ChatWidgetSettings;
  createdAt: string;
  updatedAt?: string;
}

interface ConfigStore {
  widgets: ChatWidgetConfig[];
  currentWidgetId: number | null;

  // CRUD operations
  setAllConfigs: (configs: ChatWidgetConfig[]) => void;
  addWidget: (widget: ChatWidgetConfig) => void;
  updateWidget: (id: number, updatedData: Partial<ChatWidgetConfig>) => void;
  deleteWidget: (id: number) => void;

  // current widget
  setCurrentWidget: (id: number) => void;
  getCurrentWidget: () => ChatWidgetConfig | undefined;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  widgets: [],
  currentWidgetId: null,

  setAllConfigs: (configs) =>
    set({ widgets: configs, currentWidgetId: configs[0]?.id ?? null }),

  addWidget: (widget) =>
    set((state) => ({
      widgets: [...state.widgets, widget],
      currentWidgetId: widget.id ?? state.currentWidgetId,
    })),

  updateWidget: (id, updatedData) =>
    set((state) => ({
      widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...updatedData } : w)),
    })),

  deleteWidget: (id) =>
    set((state) => {
      const filtered = state.widgets.filter((w) => w.id !== id);
      const newCurrentId =
        state.currentWidgetId === id ? filtered[0]?.id ?? null : state.currentWidgetId;
      return { widgets: filtered, currentWidgetId: newCurrentId };
    }),

  setCurrentWidget: (id) => set({ currentWidgetId: id }),

  getCurrentWidget: () => {
    const { widgets, currentWidgetId } = get();
    return widgets.find((w) => w.id === currentWidgetId);
  },
}));
