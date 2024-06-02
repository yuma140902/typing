import { Theme } from '../theme';
import { GenerationalId } from '../util/generational_array';
import { Time } from '../util/time';

export type GameState = {
  phase: GamePhase;
  width: number;
  height: number;
  theme: Theme;
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
  cursorId?: GenerationalId;
  start?: Time;
  end?: Time;
  wrongText: string;
};

/**
 *ゲームの初期状態を返す
 */
export const getInitialGameState = (theme: Theme): GameState => {
  return {
    phase: { tag: 'loading' },
    width: window.innerWidth,
    height: window.innerHeight,
    theme,
  };
};
