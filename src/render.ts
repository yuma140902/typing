import { getFpsCounter } from './debug_fps';
import { type Easing, animatePoint } from './easing';
import {
  type Rectangle,
  type GameObject,
  type TitleCharacter,
  type TextBlock,
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
  canvasWidth: number,
  canvasHeight: number,
  delay: DurationMs,
): Timeline<GameObject> => {
  const letters = text.split('');

  const widthAll = ctx.measureText(text).width;
  const x = canvasWidth / 2 - widthAll / 2;
  const y = canvasHeight / 2;

  let s = '';
  let elements = [];
  let prevPos = { x, y: y - 48 };

  const linear = (start: TimeMs, duration: DurationMs): Easing => ({
    type: {
      tag: 'linear',
      sanitizer: { tag: 'clamp' },
    },
    start,
    duration,
  });

  for (let i = 0; i < letters.length; i++) {
    const width = ctx.measureText(s).width;
    const nextX = x + width;
    const nextPos = { x: nextX, y: prevPos.y };

    const rect: Rectangle = {
      tag: 'rectangle',
      width: 4,
      height: 60,
      color: 'primary',
      position: {
        from: prevPos,
        to: nextPos,
        easing: linear(timeAfter(start, ms(i * delay)), ms(delay * 0.75)),
      },
    };
    elements.push({
      appearAt: timeAfter(start, ms(i * delay)),
      disappearAt: timeAfter(start, ms(i * delay + delay)),
      obj: rect,
    });

    const chara: TitleCharacter = {
      tag: 'title-character',
      position: { x: nextX, y },
      character: letters[i],
    };
    elements.push({
      appearAt: timeAfter(start, ms(i * delay + delay * (1 + 0.75 / 2))),
      disappearAt: timeAfter(start, ms(Infinity)),
      obj: chara,
    });

    prevPos = nextPos;
    s += letters[i];
  }

  const widthLast = ctx.measureText(s).width;
  const rect: Rectangle = {
    tag: 'rectangle',
    width: 4,
    height: 60,
    color: 'primary',
    position: {
      from: prevPos,
      to: {
        x: x + widthLast,
        y: prevPos.y,
      },
      easing: linear(timeAfter(start, ms(letters.length * delay)), ms(delay)),
    },
  };
  elements.push({
    appearAt: timeAfter(start, ms(letters.length * delay)),
    disappearAt: timeAfter(start, ms(Infinity)),
    obj: rect,
  });

  const startText = 'スペースキーを押してスタート';
  const startTextWidth = ctx.measureText(startText).width;
  const startTextBlock: TextBlock = {
    tag: 'text-block',
    position: {
      x: canvasWidth / 2 - startTextWidth / 2,
      y: (canvasHeight * 3) / 4,
    },
    text: startText,
  };
  elements.push({
    appearAt: timeAfter(start, ms(letters.length * delay + delay)),
    disappearAt: timeAfter(start, ms(Infinity)),
    obj: startTextBlock,
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
      'タイピングゲーム: Mini Typing (仮称)',
      timeAfter(timeNow(), ms(0)),
      canvas.width,
      canvas.height,
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
          ctx.fillStyle = theme[element.color];
          const { x, y } = animatePoint(element.position, timeNow());
          ctx.fillRect(x, y, element.width, element.height);
        } else if (element.tag === 'text-block') {
          ctx.fillStyle = theme.foreground;
          ctx.fillText(element.text, element.position.x, element.position.y);
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
