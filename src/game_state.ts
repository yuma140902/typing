import { type Rectangle } from './game_object';

/**
 * ゲームの状態
 */
export type GameState = {
  phase: 'loading' | 'title' | 'playing';
  obj?: Rectangle;
};

/**
 *ゲームの初期状態を返す
 */
export const initialGameState = (): GameState => {
  return {
    phase: 'loading',
  };
};
