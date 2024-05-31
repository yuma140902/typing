import { type Rectangle } from './game_object';

/**
 * ゲームの状態
 */
export type GameState = {
  phase: GamePhase;
};

export type GamePhase = LoadingPhase | TitlePhase | PlayingPhase;
export type LoadingPhase = { tag: 'loading' };
export type TitlePhase = { tag: 'title' };
export type PlayingPhase = { tag: 'playing' };

/**
 *ゲームの初期状態を返す
 */
export const initialGameState = (): GameState => {
  return {
    phase: { tag: 'loading' },
  };
};
