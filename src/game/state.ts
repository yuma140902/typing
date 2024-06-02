import { Theme, themeOnedark } from '../theme';
import { GenerationalId } from '../util/generational_array';
import { Time } from '../util/time';

export type GameState = {
  phase: GamePhase;
  width: number;
  height: number;
  theme: Theme;
  // TODO: テーマ切り替え機能を用意する
  debugThemeId: number;
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
export const getInitialGameState = (): GameState => {
  return {
    phase: { tag: 'loading' },
    width: window.innerWidth,
    height: window.innerHeight,
    theme: themeOnedark,
    debugThemeId: 0,
  };
};
