'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation.js';
import {
  useAIChatStore,
  addAIChatMessage,
  setAIChatState,
  type ChatMessage,
} from '../../store/aiChatStore';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseDocContextFromPath(pathname: string | null): {
  docId: string;
  collection: string;
} | null {
  if (!pathname) return null;
  const m = pathname.match(/\/admin\/collections\/([^/]+)\/([^/]+)/);
  if (m && m[2] !== 'create') return { collection: m[1]!, docId: m[2]! };
  return null;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------------------
// Quick action buttons (context-sensitive)
// ---------------------------------------------------------------------------

const PAGE_ARTICLE_ACTIONS = [
  { label: 'Analyzovat stránku', prompt: 'Proveď SEO analýzu aktuální stránky.' },
  { label: 'Vytvořit Meta popis', prompt: 'Vygeneruj meta popis pro aktuální stránku.' },
];

const DEFAULT_ACTIONS = [
  { label: 'Přidat novou stránku', prompt: 'Chci přidat novou stránku.' },
  { label: 'Kde jsou obrázky', prompt: 'Kde najdu obrázky v CMS?' },
];

// ---------------------------------------------------------------------------
// Message bubble
// ---------------------------------------------------------------------------

const MessageBubble: React.FC<{
  message: ChatMessage;
  onApprove?: (data: unknown) => void;
}> = ({ message, onApprove }) => {
  const isUser = message.role === 'user';
  const [clientTime, setClientTime] = useState<string>('');

  useEffect(() => {
    setClientTime(formatTime(message.timestamp));
  }, [message.timestamp]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          padding: '8px 12px',
          borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
          background: isUser ? 'var(--theme-success-500, #22c55e)' : 'var(--theme-elevation-100)',
          color: isUser ? '#fff' : 'var(--theme-text)',
          fontSize: 13,
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>

      {message.type === 'page-creation-preview' && !!message.previewData && !!onApprove && (
        <div
          style={{
            marginTop: 8,
            padding: '8px 12px',
            background: 'var(--theme-elevation-50)',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: 8,
            fontSize: 12,
            maxWidth: '80%',
          }}
        >
          <strong>Navrh stranky:</strong>
          {' '}
          {String((message.previewData as Record<string, unknown>).title ?? '')}
          <br />
          <button
            onClick={() => onApprove(message.previewData)}
            style={{
              marginTop: 6,
              padding: '4px 10px',
              background: 'var(--theme-success-500, #22c55e)',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            Vytvorit koncept
          </button>
        </div>
      )}

      <span style={{ fontSize: 10, color: 'var(--theme-elevation-400)', marginTop: 2 }}>
        {clientTime}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main AIChatModal component
// ---------------------------------------------------------------------------

export const AIChatModal: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isOpen, messages, loading, close, clearChat, currentDocument, setCurrentDocument } = useAIChatStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const docCtx = parseDocContextFromPath(pathname);

  // Titulek stránky z currentDocument, fallback na původní pageTitle
  let pageTitle: string | undefined = undefined;
  if (currentDocument && currentDocument.title) {
    pageTitle = `${currentDocument.title.substring(0, 15)}${currentDocument.title.length > 15 ? '…' : ''}`;
  } else if (docCtx) {
    pageTitle = `${docCtx.collection}/${docCtx.docId}`;
  }

  // Načti titulek stránky při změně docCtx
  useEffect(() => {
    const fetchTitle = async () => {
      if (docCtx) {
        try {
          const res = await fetch(`/api/${docCtx.collection}/${docCtx.docId}`);
          if (res.ok) {
            const data = await res.json();
            setCurrentDocument({
              id: docCtx.docId,
              collection: docCtx.collection,
              title: data.title || '',
            });
          } else {
            setCurrentDocument(null);
          }
        } catch {
          setCurrentDocument(null);
        }
      } else {
        setCurrentDocument(null);
      }
    };
    fetchTitle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docCtx?.collection, docCtx?.docId]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setInputValue('');

      const userMessage: ChatMessage = {
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      addAIChatMessage(userMessage);
      setAIChatState({ loading: true });

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            message: trimmed,
            history: messages.slice(-4),
            currentDocumentId: docCtx?.docId,
            collection: docCtx?.collection,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Request failed.' }));
          addAIChatMessage({
            role: 'assistant',
            content: (err as Record<string, unknown>).error as string ?? 'Pozadavek selhal. Zkuste to znovu.',
            timestamp: new Date().toISOString(),
            type: 'text',
          });
          return;
        }

        const data = (await res.json()) as ChatMessage & { type?: string; previewData?: unknown };
        addAIChatMessage({
          role: 'assistant',
          content: data.content,
          timestamp: data.timestamp ?? new Date().toISOString(),
          type: (data.type as ChatMessage['type']) ?? 'text',
          previewData: data.previewData ?? undefined,
        });
      } catch {
        addAIChatMessage({
          role: 'assistant',
          content: 'Pozadavek selhal. Zkuste to znovu.',
          timestamp: new Date().toISOString(),
          type: 'text',
        });
      } finally {
        setAIChatState({ loading: false });
      }
    },
    [loading, messages, docCtx],
  );

  const handleApprove = useCallback(async (previewData: unknown) => {
    const data = previewData as Record<string, unknown>;
    try {
      const res = await fetch('/api/ai/create-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: data.title,
          slug: data.slug,
          blocks: data.blocks,
        }),
      });

      if (!res.ok) {
        addAIChatMessage({
          role: 'assistant',
          content: 'Vytvoreni stranky se nezdarilo. Zkontrolujte duplicitni slug.',
          timestamp: new Date().toISOString(),
          type: 'text',
        });
        return;
      }

      const result = (await res.json()) as { id: string; adminUrl: string };
      addAIChatMessage({
        role: 'assistant',
        content: `Stranka vytvorena jako koncept. Otevrit v editoru: ${result.adminUrl}`,
        timestamp: new Date().toISOString(),
        type: 'text',
      });
    } catch {
      addAIChatMessage({
        role: 'assistant',
        content: 'Vytvoreni stranky se nezdarilo.',
        timestamp: new Date().toISOString(),
        type: 'text',
      });
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        void sendMessage(inputValue);
      }
    },
    [inputValue, sendMessage],
  );

  // pageTitle je nyní určeno výše

  if (!mounted || !isOpen) return null;
  if (typeof document === 'undefined') return null;

  const modal = (
    <div
      style={{
        position: 'fixed',
        left: 'var(--app-nav-width, 275px)',
        bottom: 0,
        height: '78vh',
        width: 460,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        background: '#1f1f1f',
        boxShadow: '0 -4px 32px 0 rgba(0,0,0,0.18)',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
        border: '1px solid #6a6969',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--theme-elevation-200)',
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--theme-text)' }}>
            AI Chat
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={clearChat}
            title="+ Nový chat"
            style={{
              padding: '4px 8px',
              fontSize: 11,
              border: '1px solid var(--theme-elevation-300)',
              borderRadius: 4,
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--theme-text)',
            }}
          >
            + Nový chat
          </button>
          <button
            onClick={close}
            title="Zavřít"
            style={{
              padding: '4px 8px',
              fontSize: 11,
              border: '1px solid var(--theme-elevation-300)',
              borderRadius: 4,
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--theme-text)',
            }}
          >
            &lt;
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--theme-elevation-400)',
              fontSize: 13,
              marginTop: 32,
            }}
          >
            Jak vam mohu pomoci?
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            onApprove={msg.type === 'page-creation-preview' ? handleApprove : undefined}
          />
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '12px 12px 12px 2px',
                background: 'var(--theme-elevation-100)',
                color: 'var(--theme-elevation-500)',
                fontSize: 13,
                fontStyle: 'italic',
              }}
            >
              Premyslim...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          borderTop: '1px solid var(--theme-elevation-200)',
          padding: '8px 12px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 4, marginBottom: 6, flexWrap: 'wrap' }}>
          <div>
            {pageTitle && (
              <div style={{ fontSize: 11, color: 'var(--theme-elevation-500)', marginBottom: 6 }}>
                Stránka v kontextu:
                <span
                  style={{
                    border: '1px solid var(--theme-elevation-200)',
                    borderRadius: 4,
                    background: 'var(--theme-elevation-100)',
                    padding: '0px 4px',
                  }}
                >
                  {pageTitle}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
              {(docCtx && (docCtx.collection === 'pages' || docCtx.collection === 'articles')
                ? PAGE_ARTICLE_ACTIONS
                : DEFAULT_ACTIONS
              ).map((action) => (
                <button
                  key={action.label}
                  onClick={() => void sendMessage(action.prompt)}
                  style={{
                    fontSize: 10,
                    padding: '2px 7px',
                    border: '1px solid var(--theme-elevation-300)',
                    borderRadius: 12,
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--theme-elevation-600)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'stretch', flexDirection: 'column' }}>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder="Napište zprávu... (Enter = odeslat, Shift+Enter = nový řádek)"
            rows={1}
            style={{
              flex: 1,
              resize: 'none',
              padding: '7px 10px',
              borderRadius: 8,
              border: '1px solid var(--theme-elevation-300)',
              background: 'var(--theme-input-bg, var(--theme-elevation-50))',
              color: 'var(--theme-text)',
              fontSize: 13,
              lineHeight: 1.4,
              minHeight: 150,
              maxHeight: 300,
              overflow: 'auto',
              outline: 'none',
            }}
          />
          <button
            onClick={() => void sendMessage(inputValue)}
            disabled={loading || !inputValue.trim()}
            style={{
              padding: '7px 14px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--theme-success-500, #22c55e)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 13,
              cursor: loading || !inputValue.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !inputValue.trim() ? 0.5 : 1,
              flexShrink: 0,
              alignSelf: 'flex-end',
            }}
          >
            Odeslat
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};
