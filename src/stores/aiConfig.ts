import { create } from "zustand";

interface AIConfigState {
  spellingCorrection: boolean;
  smartReply: boolean;
  textFormatter: boolean;
  userExpression: boolean;
  AIReply: boolean;

  toggleFeature: (key: keyof Omit<AIConfigState, "toggleFeature">) => void;
  setFeature: (key: keyof Omit<AIConfigState, "toggleFeature">, value: boolean) => void;
}

export const useAIConfig = create<AIConfigState>((set) => ({
  spellingCorrection: true,
  smartReply: false,
  textFormatter: false,
  userExpression: false,
  AIReply: false,

  toggleFeature: (key) =>
    set((state) => ({ [key]: !state[key] })),

  setFeature: (key, value) =>
    set(() => ({ [key]: value })),
}));
