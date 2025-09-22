import { create } from "zustand";

interface AIConfigState {
  spellingCorrection: boolean;
  smartReply: boolean;
  textFormatter: boolean;
  userExpression: boolean;
  openaiGenerate: boolean;
  openaiReply: boolean;
  humanTakeOver: boolean;

  toggleFeature: (key: keyof Omit<AIConfigState, "toggleFeature">) => void;
  setFeature: (key: keyof Omit<AIConfigState, "toggleFeature">, value: boolean) => void;
}

export const useAIConfig = create<AIConfigState>((set, get) => ({
  spellingCorrection: true,
  smartReply: false,
  textFormatter: false,
  userExpression: false,
  openaiGenerate: false,
  openaiReply: false,
  humanTakeOver: false,

  toggleFeature: (key) => {
    const state = get();
    const newValue = !state[key];

    // Apply dependencies
    const newState: Partial<AIConfigState> = { [key]: newValue };

    if (key === "openaiReply" && newValue) {
      newState.openaiGenerate = true; // Reply requires Generate
      newState.humanTakeOver = false; // disable human takeover
    }

    if (key === "openaiGenerate" && newValue) {
      newState.humanTakeOver = false; // disable human takeover
      // no need to enable reply automatically
    }

    if (key === "humanTakeOver" && newValue) {
      newState.openaiReply = false;
      newState.openaiGenerate = false;
    }

    set(newState);
  },

  setFeature: (key, value) => {
    const state = get();
    const newState: Partial<AIConfigState> = { [key]: value };

    if (key === "openaiReply" && value) {
      newState.openaiGenerate = true;
      newState.humanTakeOver = false;
    }

    if (key === "openaiGenerate" && value) {
      newState.humanTakeOver = false;
    }

    if (key === "humanTakeOver" && value) {
      newState.openaiReply = false;
      newState.openaiGenerate = false;
    }

    set(newState);
  },
}));
