'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDocumentInfo } from '@payloadcms/ui';

interface SEOResult {
  score: number;
  issues: string[];
  fixes: string[];
}

interface GEOResult {
  entityClarity: number;
  aiReadability: number;
  snippetQuality: number;
  issues: string[];
  recommendations: string[];
}

interface ValidationState {
  seo: SEOResult | null;
  geo: GEOResult | null;
  loading: 'seo' | 'geo' | null;
  error: string | null;
}

async function runValidation(
  action: 'seo' | 'geo',
  docId: string,
  collectionSlug: string,
): Promise<SEOResult | GEOResult> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      action: action === 'seo' ? 'run-seo-validation' : 'run-geo-validation',
      docId,
      collectionSlug,
      locale: 'cs',
    }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({ error: 'Neznámá chyba' }))) as {
      error?: string;
    };
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }

  const data = (await res.json()) as { result: SEOResult | GEOResult };
  return data.result;
}

/**
 * PageAIValidationField — custom UI field component for the "Validace" tab.
 *
 * Renders "Run SEO" and "Run GEO" buttons that call the AI validation API
 * and display results inline.
 */
export const PageAIValidationField: React.FC = () => {
  const { id, collectionSlug, data } = useDocumentInfo();
  // Extract last validation and doc updatedAt
  const aiValidation = data?.aiValidation || {};
  const docUpdatedAt = data?.updatedAt ? new Date(data.updatedAt) : null;
  const validationUpdatedAt = aiValidation?.updatedAt ? new Date(aiValidation.updatedAt) : null;
  const [state, setState] = useState<ValidationState>({
    seo: aiValidation?.seo || null,
    geo: aiValidation?.geo || null,
    loading: null,
    error: null,
  });

  const handleRun = useCallback(
    async (type: 'seo' | 'geo') => {
      if (!id || !collectionSlug) {
        setState((s) => ({
          ...s,
          error: 'Uložte stránku před spuštěním validace.',
        }));
        return;
      }

      setState((s) => ({ ...s, loading: type, error: null }));

      try {
        const result = await runValidation(type, String(id), collectionSlug);
        setState((s) => ({
          ...s,
          loading: null,
          [type]: result,
        }));
      } catch (err) {
        setState((s) => ({
          ...s,
          loading: null,
          error: `Validace selhala: ${err instanceof Error ? err.message : 'Neznámá chyba'}`,
        }));
      }
    },
    [id, collectionSlug],
  );

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    border: '1px solid var(--theme-elevation-300)',
    borderRadius: 6,
    background: disabled ? 'var(--theme-elevation-100)' : 'var(--theme-bg)',
    color: disabled ? 'var(--theme-elevation-400)' : 'var(--theme-text)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 13,
    fontWeight: 500,
  });

  const scoreColor = (score: number) =>
    score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';

  // Helper: format date
  const formatDate = (date: Date | null) =>
    date ? date.toLocaleString('cs-CZ', { dateStyle: 'short', timeStyle: 'short' }) : '-';

  // Helper: check if doc was changed after validation (tolerance 1s)
  const changedAfterValidation =
    docUpdatedAt && validationUpdatedAt && (docUpdatedAt.getTime() - validationUpdatedAt.getTime() > 1000);

  return (
    <div style={{ padding: '24px 0' }}>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 16,
          color: 'var(--theme-text)',
        }}
      >
        AI Validace
      </h3>

      {/* --- Validation meta info --- */}
      <div style={{ marginBottom: 16, fontSize: 13 }}>
        <div>
          <b>Poslední validace:</b> {formatDate(validationUpdatedAt)}
        </div>
        <div>
          <b>Poslední úprava obsahu:</b> {formatDate(docUpdatedAt)}
        </div>
        {changedAfterValidation && (
          <div style={{ color: '#ef4444', fontWeight: 500, marginTop: 4 }}>
            ⚠️ Obsah byl změněn po poslední validaci. Proveďte validaci znovu.
          </div>
        )}
      </div>

      {state.error && (
        <div
          style={{
            padding: '8px 12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 6,
            color: '#b91c1c',
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {state.error}
        </div>
      )}

      {/* ---- Buttons ---- */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <button
          onClick={() => void handleRun('seo')}
          disabled={state.loading !== null}
          style={btnStyle(state.loading !== null)}
        >
          {state.loading === 'seo' ? 'Spouštím SEO…' : '▶ Spustit SEO validaci'}
        </button>
        <button
          onClick={() => void handleRun('geo')}
          disabled={state.loading !== null}
          style={btnStyle(state.loading !== null)}
        >
          {state.loading === 'geo' ? 'Spouštím GEO…' : '▶ Spustit GEO validaci'}
        </button>
      </div>

      {/* ---- SEO Results ---- */}
      {state.seo && (
        <div
          style={{
            marginBottom: 24,
            padding: 16,
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>SEO analýza</h4>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: scoreColor(state.seo.score),
              }}
            >
              {state.seo.score}
              /100
            </span>
          </div>

          {state.seo.issues.length > 0 && (
            <>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', margin: '8px 0 4px' }}>
                Problémy:
              </p>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {state.seo.issues.map((issue, i) => (
                  <li key={i} style={{ fontSize: 12, color: 'var(--theme-elevation-600)', marginBottom: 2 }}>
                    {issue}
                  </li>
                ))}
              </ul>
            </>
          )}

          {state.seo.fixes.length > 0 && (
            <>
              <p
                style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', margin: '8px 0 4px' }}
              >
                Doporučené opravy:
              </p>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {state.seo.fixes.map((fix, i) => (
                  <li key={i} style={{ fontSize: 12, color: 'var(--theme-elevation-600)', marginBottom: 2 }}>
                    {fix}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* ---- GEO Results ---- */}
      {state.geo && (
        <div
          style={{
            padding: 16,
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: 8,
          }}
        >
          <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>GEO analýza</h4>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Jasnost entit', value: state.geo.entityClarity },
              { label: 'AI čitelnost', value: state.geo.aiReadability },
              { label: 'Kvalita snippetu', value: state.geo.snippetQuality },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center', minWidth: 80 }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: scoreColor(value),
                  }}
                >
                  {value}
                </div>
                <div style={{ fontSize: 11, color: 'var(--theme-elevation-500)' }}>{label}</div>
              </div>
            ))}
          </div>

          {state.geo.issues.length > 0 && (
            <>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', margin: '8px 0 4px' }}>
                Problémy:
              </p>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {state.geo.issues.map((issue, i) => (
                  <li key={i} style={{ fontSize: 12, color: 'var(--theme-elevation-600)', marginBottom: 2 }}>
                    {issue}
                  </li>
                ))}
              </ul>
            </>
          )}

          {state.geo.recommendations.length > 0 && (
            <>
              <p
                style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', margin: '8px 0 4px' }}
              >
                Doporučení:
              </p>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {state.geo.recommendations.map((r, i) => (
                  <li key={i} style={{ fontSize: 12, color: 'var(--theme-elevation-600)', marginBottom: 2 }}>
                    {r}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};
