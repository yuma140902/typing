import { getFpsCounter } from './debug_fps';
import { type GameState } from './game_state';
import { type Theme } from './theme';
import { durationBetween, timeNow } from './time';

const needAnimation = (state: GameState) => {
  return state.phase.tag === 'title';
};

export const getRenderer = (
  canvas: HTMLCanvasElement,
  theme: Theme,
  gameState: GameState,
) => {
  const ctx = canvas.getContext('2d')!;
  const initialTime = timeNow();
  const fpsCounter = getFpsCounter();
  let prevTime = timeNow();
  let tick = 0;

  const renderDebugInfo = (info: { label: string; value: string }[]) => {
    ctx.font = '12px monospace';
    info.forEach(({ label, value }, i) => {
      const text = `${label}: ${value}`;
      const width = ctx.measureText(text).width;
      ctx.fillText(text, canvas.width - width - 8, 12 * (i + 1));
    });
  };

  const renderTitleScreen = () => {
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, 2 * Math.PI);
    ctx.fill();
    ctx.font = '48px IBMPlexSans, IBMPlexSansJP';
    ctx.fillText('タイピングゲーム: Typing', 200, 200);
  };

  const render = () => {
    const now = timeNow();
    const deltaTimeMs = durationBetween(now, prevTime);
    prevTime = now;
    tick += 1;

    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme.foreground;

    if (gameState.phase.tag === 'title') {
      renderTitleScreen();
    }

    fpsCounter.addSample();
    renderDebugInfo([
      { label: 'tick', value: tick.toString() },
      { label: 'deltaTimeMs', value: deltaTimeMs.toFixed(2) },
      { label: 'FPS', value: fpsCounter.getFps().toFixed(2) },
    ]);
  };

  const onGameStateUpdate = () => {
    window.requestAnimationFrame(() => {
      render();
      // アニメーションが必要なら繰り返しrequestAnimationFrameを呼ぶ
      if (needAnimation(gameState)) {
        onGameStateUpdate();
      }
    });
  };

  return { onGameStateUpdate };
};
