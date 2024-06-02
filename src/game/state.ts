import { GenerationalId } from '../util/generational_array';
import { Time } from '../util/time';

export type GameState = {
  phase: GamePhase;
  width: number;
  height: number;
  theme: Theme;
};

export type Theme = {
  foreground: string;
  background: string;
  primary: string;
  dimmed: string;
};

export type GamePhase = LoadingPhase | TitlePhase | PlayingPhase;
export type LoadingPhase = { tag: 'loading' };
export type TitlePhase = {
  tag: 'title';
  cursorId?: GenerationalId;
};
export type PlayingPhase = {
  tag: 'playing';
  correctText: string;
  typingText: string;
};

/**
 *ゲームの初期状態を返す
 */
export const getInitialGameState = (): GameState => {
  return {
    phase: { tag: 'loading' },
    width: window.innerWidth,
    height: window.innerHeight,
    theme: {
      foreground: '#abb2bf',
      background: '#282c34',
      primary: '#61afef',
      dimmed: '#5c6370',
    },
  };
};
