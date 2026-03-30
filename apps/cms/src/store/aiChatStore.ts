'use client';

import { useCallback, useEffect, useReducer } from 'react';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'page-creation-preview';
  previewData?: unknown;
};

type AIChatState = {
  isOpen: boolean;
  messages: ChatMessage[];
  loading: boolean;
  currentDocument: { id: string; collection: string; title: string } | null;
  currentCollection: string | null;
};

const MAX_HISTORY = 6;

const initialState: AIChatState = {
  isOpen: false,
  messages: [],
  loading: false,
  currentDocument: null,
  currentCollection: null,
};

// ---------------------------------------------------------------------------
// Module-level reactive store (no external state library needed)
// ---------------------------------------------------------------------------

let state: AIChatState = { ...initialState };
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((l) => l());
}

export function setAIChatState(partial: Partial<AIChatState>): void {
  state = { ...state, ...partial };
  notify();
}

export function addAIChatMessage(message: ChatMessage): void {
  const messages = [...state.messages, message].slice(-MAX_HISTORY);
  state = { ...state, messages };
  notify();
}

export function getAIChatState(): AIChatState {
  return state;
}

// ---------------------------------------------------------------------------
// React hook
// ---------------------------------------------------------------------------

export function useAIChatStore() {
  const [, rerender] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    listeners.add(rerender);
    return () => {
      listeners.delete(rerender);
    };
  }, [rerender]);

  const open = useCallback(() => setAIChatState({ isOpen: true }), []);
  const close = useCallback(() => setAIChatState({ isOpen: false }), []);
  const toggle = useCallback(() => setAIChatState({ isOpen: !getAIChatState().isOpen }), []);
  const clearChat = useCallback(() => setAIChatState({ messages: [], loading: false }), []);

  const setCurrentDocument = useCallback(
    (doc: { id: string; collection: string; title: string } | null) =>
      setAIChatState({ currentDocument: doc }),
    [],
  );

  return {
    ...state,
    open,
    close,
    toggle,
    clearChat,
    setCurrentDocument,
    addMessage: addAIChatMessage,
  };
}
