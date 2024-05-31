import { type GameState } from './game_state';
import { timeNow } from './time';

export const initEventHandlers = (
  gameState: GameState,
  notifyGameStateUpdate: () => void,
) => {
  window.addEventListener('resize', () => {
    const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  window.addEventListener('keydown', (event) => {
    console.log('keydown', event);
    if (event.key === ' ' && gameState.phase === 'title') {
      gameState.phase = 'playing';
      notifyGameStateUpdate();
    } else if (event.key === 'a' && gameState.phase === 'playing') {
      notifyGameStateUpdate();
    }
  });
};
