'use client';

import React from 'react';
import { useAIChatStore } from '../../store/aiChatStore';

/**
 * AIChatTrigger — renders the "AI Chat" nav item in the Payload admin sidebar.
 * Clicking toggles the AIChatModal that is rendered by AIChatRoot.
 */
export const AIChatTrigger: React.FC = () => {
  const { toggle, isOpen } = useAIChatStore();

  return (
    <div className="nav__link"><button
      onClick={toggle}
      title="AI Chat"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '0px',
        background: isOpen ? 'var(--theme-elevation-100)' : 'transparent',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
        color: 'var(--theme-text)',
        fontSize: 13,
        textAlign: 'left',
      }}
    >
      <span style={{ fontSize: 12, lineHeight: 1 }}>💬</span>
      <span className="nav__link-label">AI Chat</span>
    </button></div>
  );
};
