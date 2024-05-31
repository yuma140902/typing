import { getFpsCounter } from './debug_fps';
import { animatePoint } from './easing';
import {
  type Rectangle,
  type GameObject,
  type TitleCharacter,
} from './game_object';
import { type GameState } from './game_state';
import { type Theme } from './theme';
import {
  type TimeMs,
  durationBetween,
  ms,
  timeAfter,
  timeNow,
  DurationMs,
} from './time';
import {
  type Timeline,
  listTimelineElements,
  maintainTimeline,
} from './timeline';

const needAnimation = (state: GameState) => {
  return state.phase.tag === 'title';
};

const buildLetterTimeline = (
  ctx: CanvasRenderingContext2D,
  text: string,
  start: TimeMs,
  x: number,
  y: number,
  delay: DurationMs,
): Timeline<GameObject> => {
  const letters = text.split('');

  let s = '';
  let elements = [];
  let prevX = x;

  for (let i = 0; i < letters.length; i++) {
    const width = ctx.measureText(s).width;

    const rect: Rectangle = {
      tag: 'rectangle',
      width: 4,
      height: 60,
      position: {
        from: {
          x: prevX,
          y: y - 48,
        },
        to: {
          x: x + width,
          y: y - 48,
        },
        easing: {
          type: 'easeOutQuad',
          start: timeAfter(start, ms(i * delay)),
          duration: ms(delay),
        },
      },
    };
    elements.push({
      appearAt: timeAfter(start, ms(i * delay)),
      disappearAt: timeAfter(start, ms(i * delay + delay)),
      obj: rect,
    });

    const chara: TitleCharacter = {
      tag: 'title-character',
      position: { x: x + width, y },
      character: letters[i],
    };
    elements.push({
      appearAt: timeAfter(start, ms(i * delay + delay * 1.5)),
      disappearAt: timeAfter(start, ms(Infinity)),
      obj: chara,
    });

    prevX = x + width;
    s += letters[i];
  }

  const width = ctx.measureText(s).width;
  const rect: Rectangle = {
    tag: 'rectangle',
    width: 4,
    height: 60,
    position: {
      from: {
        x: prevX,
        y: y - 48,
      },
      to: {
        x: x + width,
        y: y - 48,
      },
      easing: {
        type: 'linear',
        start: timeAfter(start, ms(letters.length * delay)),
        duration: ms(delay),
      },
    },
  };
  elements.push({
    appearAt: timeAfter(start, ms(letters.length * delay)),
    disappearAt: timeAfter(start, ms(Infinity)),
    obj: rect,
  });
  return { elements };
};

export type Renderer = {
  onGameStateUpdate: () => void;
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
  let renderLoadingScreen: (() => void) | undefined;
  let renderTitleScreen: (() => void) | undefined;

  const renderDebugInfo = (info: { label: string; value: string }[]) => {
    ctx.font = '12px monospace';
    ctx.fillStyle = theme.foreground;
    info.forEach(({ label, value }, i) => {
      const text = `${label}: ${value}`;
      const width = ctx.measureText(text).width;
      ctx.fillText(text, canvas.width - width - 8, 12 * (i + 1));
    });
  };

  const loadingScreenRenderer = () => {
    return () => {
      ctx.font = '24px monospace, IBMPlexSans, IBMPlexSansJP';
      ctx.fillStyle = theme.foreground;
      ctx.textAlign = 'center';
      ctx.fillText('Loading...', canvas.width / 2, canvas.height / 2);
      ctx.textAlign = 'start';
    };
  };

  const titleScreenRenderer = () => {
    ctx.font = '48px IBMPlexSans, IBMPlexSansJP';
    let timeline = buildLetterTimeline(
      ctx,
      'タイピングゲーム: Typing',
      timeAfter(timeNow(), ms(0)),
      200,
      200,
      ms(250),
    );

    return () => {
      ctx.font = '48px IBMPlexSans, IBMPlexSansJP';
      maintainTimeline(timeline, timeNow());
      for (const element of listTimelineElements(timeline, timeNow())) {
        if (element.tag === 'title-character') {
          ctx.fillStyle = theme.foreground;
          ctx.fillText(
            element.character,
            element.position.x,
            element.position.y,
          );
        } else if (element.tag === 'rectangle') {
          ctx.fillStyle = theme.primary;
          const { x, y } = animatePoint(element.position, timeNow());
          ctx.fillRect(x, y, element.width, element.height);
        }
      }
    };
  };

  const render = () => {
    const now = timeNow();
    const deltaTimeMs = durationBetween(now, prevTime);
    prevTime = now;
    tick += 1;

    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme.foreground;

    if (gameState.phase.tag === 'loading') {
      renderTitleScreen = undefined;
      if (!renderLoadingScreen) {
        renderLoadingScreen = loadingScreenRenderer();
      }
      renderLoadingScreen();
    }

    if (gameState.phase.tag === 'title') {
      renderLoadingScreen = undefined;
      if (!renderTitleScreen) {
        renderTitleScreen = titleScreenRenderer();
      }
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
