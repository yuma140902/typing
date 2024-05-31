import { type GameState } from './game_state';

export const initEventHandlers = (
  gameState: GameState,
  notifyGameStateUpdate: () => void,
) => {
  window.addEventListener('resize', () => {
    const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    notifyGameStateUpdate();
  });

  window.addEventListener('keydown', (event) => {
    console.log('keydown', event);
    if (event.key === ' ' && gameState.phase.tag === 'title') {
      gameState.phase = { tag: 'playing' };
      notifyGameStateUpdate();
    } else if (event.key === 'a' && gameState.phase.tag === 'playing') {
      notifyGameStateUpdate();
    }
  });
};
