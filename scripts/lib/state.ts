import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const STATE_FILE = path.resolve(
  import.meta.dirname || process.cwd(),
  '../demo-state.json',
);

export interface DemoState {
  pageId: number | null;
  mediaCache: Record<string, number>; // url/name → CMS media ID
  processedBlocks: string[]; // slugs of blocks already added to page
  processedPositions: number[]; // positions already added to page
}

function defaultState(): DemoState {
  return {
    pageId: null,
    mediaCache: {},
    processedBlocks: [],
    processedPositions: [],
  };
}

export function loadState(): DemoState {
  if (!existsSync(STATE_FILE)) {
    return defaultState();
  }
  try {
    const raw = readFileSync(STATE_FILE, 'utf-8');
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

export function saveState(state: DemoState): void {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function resetState(): void {
  writeFileSync(STATE_FILE, JSON.stringify(defaultState(), null, 2));
}

export function getCachedMediaId(
  state: DemoState,
  key: string,
): number | undefined {
  return state.mediaCache[key];
}

export function setCachedMediaId(
  state: DemoState,
  key: string,
  id: number,
): void {
  state.mediaCache[key] = id;
}

export function markBlockProcessed(state: DemoState, slug: string): void {
  if (!state.processedBlocks.includes(slug)) {
    state.processedBlocks.push(slug);
  }
}

export function markPositionProcessed(state: DemoState, position: number): void {
  if (!state.processedPositions.includes(position)) {
    state.processedPositions.push(position);
  }
}

