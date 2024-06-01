export type GameState = {
  phase: GamePhase;
  width: number;
  height: number;
};

export type GamePhase = LoadingPhase | TitlePhase | PlayingPhase;
export type LoadingPhase = { tag: 'loading' };
export type TitlePhase = {
  tag: 'title';
};
export type PlayingPhase = { tag: 'playing' };

/**
 *ゲームの初期状態を返す
 */
export const getInitialGameState = (): GameState => {
  return {
    phase: { tag: 'loading' },
    width: window.innerWidth,
    height: window.innerHeight,
  };
};
