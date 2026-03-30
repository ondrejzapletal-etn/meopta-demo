'use client';

import React from 'react';
import { AIChatModal } from '../AIChat/AIChatModal';

/**
 * AIChatRoot — renders the floating modal overlay.
 * Registered in payload.config.ts under admin.components.afterNavLinks so it
 * renders inside the admin layout (where React portal can reach document.body).
 * The trigger button is rendered inside AiNavSection.
 */
export const AIChatRoot: React.FC = () => {
  return <AIChatModal />;
};
