export type GameState = {
  phase: 'title' | 'playing';
};

export const initialGameState = (): GameState => {
  return {
    phase: 'title',
  };
};
