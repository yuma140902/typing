import { fps_counter } from './util';
import {
  type Easing,
  animatePoint,
  EasingValue,
  animateNumber,
} from './easing';
import { type Rectangle, type GameObject, type TextBlock } from './game_object';
import { type GameState } from './game_state';
import { type Theme } from './theme';
import { time } from './util';
import {
  type Timeline,
  listTimelineElements,
  maintainTimeline,
} from './timeline';
import { type Time, type Duration } from './util/time';

const needAnimation = (state: GameState) => {
  return state.phase.tag === 'title';
};

const buildLetterTimeline = (
  ctx: CanvasRenderingContext2D,
  text: string,
  start: Time,
  canvasWidth: number,
  canvasHeight: number,
  delay: time.Duration,
): Timeline<GameObject> => {
  const letters = text.split('');

  const widthAll = ctx.measureText(text).width;
  const x = canvasWidth / 2 - widthAll / 2;
  const y = canvasHeight / 2;

  let s = '';
  let elements = [];
  let prevPos = { x, y: y - 48 };

  const linear = (start: Time, duration: Duration): Easing => ({
    type: {
      tag: 'linear',
      sanitizer: { tag: 'clamp' },
    },
    start,
    duration,
  });
  const fixed = <T>(value: T): EasingValue<T> => {
    return {
      from: value,
      to: value,
      easing: { type: { tag: 'fixed' }, start, duration: time.ms(0) },
    };
  };
  const font = '48px IBMPlexSans, IBMPlexSansJP';

  for (let i = 0; i < letters.length; i++) {
    const width = ctx.measureText(s).width;
    const nextX = x + width;
    const nextPos = { x: nextX, y: prevPos.y };

    const rect: Rectangle = {
      tag: 'rectangle',
      width: fixed(4),
      height: fixed(60),
      fillColor: 'primary',
      position: {
        from: prevPos,
        to: nextPos,
        easing: linear(
          time.after(start, time.ms(i * delay)),
          time.ms(delay * 0.75),
        ),
      },
    };
    elements.push({
      appearAt: time.after(start, time.ms(i * delay)),
      disappearAt: time.after(start, time.ms(i * delay + delay)),
      obj: rect,
    });

    const chara: TextBlock = {
      tag: 'text-block',
      fillColor: 'foreground',
      font,
      position: fixed({ x: nextX, y: y }),
      text: letters[i],
    };
    elements.push({
      appearAt: time.after(start, time.ms(i * delay + delay * (1 + 0.75 / 2))),
      disappearAt: time.after(start, time.ms(Infinity)),
      obj: chara,
    });

    prevPos = nextPos;
    s += letters[i];
  }

  const widthLast = ctx.measureText(s).width;
  const lastCursor: Rectangle = {
    tag: 'rectangle',
    width: fixed(4),
    height: fixed(60),
    fillColor: 'primary',
    position: {
      from: prevPos,
      to: {
        x: x + widthLast,
        y: prevPos.y,
      },
      easing: linear(
        time.after(start, time.ms(letters.length * delay)),
        time.ms(delay),
      ),
    },
  };
  elements.push({
    appearAt: time.after(start, time.ms(letters.length * delay)),
    disappearAt: time.after(start, time.ms(letters.length * delay + 1000)),
    obj: lastCursor,
  });

  const startText = 'スペースキーを押してスタート';
  const startTextWidth = ctx.measureText(startText).width;
  const startTextBlock: TextBlock = {
    tag: 'text-block',
    fillColor: 'background',
    position: fixed({
      x: canvasWidth / 2 - startTextWidth / 2,
      y: (canvasHeight * 3) / 4,
    }),
    text: startText,
  };

  const startTextRect: Rectangle = {
    tag: 'rectangle',
    width: {
      from: 4,
      to: startTextWidth,
      easing: linear(
        time.after(start, time.ms(letters.length * delay + 1000)),
        time.ms(delay),
      ),
    },
    height: fixed(60),
    fillColor: 'primary',
    position: {
      from: { x: x + widthLast, y: prevPos.y },
      to: {
        x: canvasWidth / 2 - startTextWidth / 2,
        y: (canvasHeight * 3) / 4 - 48,
      },
      easing: linear(
        time.after(start, time.ms(letters.length * delay + 1000)),
        time.ms(delay),
      ),
    },
  };
  elements.push({
    appearAt: time.after(start, time.ms(letters.length * delay + 1000)),
    disappearAt: time.after(start, time.ms(Infinity)),
    obj: startTextRect,
  });
  elements.push({
    appearAt: time.after(start, time.ms(letters.length * delay + 1000)),
    disappearAt: time.after(start, time.ms(Infinity)),
    obj: startTextBlock,
  });

  return { elements };
};

const renderGameObject = (
  ctx: CanvasRenderingContext2D,
  theme: Theme,
  obj: GameObject,
  now: Time,
) => {
  if (obj.strokeColor) {
    ctx.strokeStyle = theme[obj.strokeColor];
  }
  if (obj.fillColor) {
    ctx.fillStyle = theme[obj.fillColor];
  }

  if (obj.tag === 'rectangle') {
    renderRectangle(ctx, obj, now);
  } else if (obj.tag === 'text-block') {
    renderTextBlock(ctx, obj, now);
  }
};

const renderRectangle = (
  ctx: CanvasRenderingContext2D,
  rect: Rectangle,
  now: Time,
) => {
  const { x, y } = animatePoint(rect.position, now);
  const width = animateNumber(rect.width, now);
  const height = animateNumber(rect.height, now);
  ctx.fillRect(x, y, width, height);
};

const renderTextBlock = (
  ctx: CanvasRenderingContext2D,
  textBlock: TextBlock,
  now: Time,
) => {
  if (textBlock.font) {
    ctx.font = textBlock.font;
  }
  if (textBlock.align) {
    ctx.textAlign = textBlock.align;
  } else {
    ctx.textAlign = 'start';
  }
  const { x, y } = animatePoint(textBlock.position, now);
  ctx.fillText(textBlock.text, x, y);
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
  //const initialTime = timeNow();
  const fpsCounter = fps_counter.create();
  let prevTime = time.now();
  let tick = 0;
  let renderLoadingScreen: (() => void) | undefined;
  let renderTitleScreen: (() => void) | undefined;
  let renderPlayScreen: (() => void) | undefined;

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
      time.after(time.now(), time.ms(0)),
      canvas.width,
      canvas.height,
      time.ms(250),
    );

    return () => {
      ctx.font = '48px IBMPlexSans, IBMPlexSansJP';
      maintainTimeline(timeline, time.now());
      for (const obj of listTimelineElements(timeline, time.now())) {
        renderGameObject(ctx, theme, obj, time.now());
      }
    };
  };

  const playScreenRenderer = () => {
    return () => {
      ctx.font = '24px IBMPlexSans, IBMPlexSansJP';
      ctx.fillStyle = theme.foreground;
      ctx.textAlign = 'center';
      ctx.fillText('未実装', canvas.width / 2, canvas.height / 2);
      ctx.textAlign = 'start';
    };
  };

  const render = () => {
    const now = time.now();
    const deltaTimeMs = time.duration(now, prevTime);
    prevTime = now;
    tick += 1;

    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme.foreground;

    if (gameState.phase.tag === 'loading') {
      renderTitleScreen = undefined;
      renderPlayScreen = undefined;
      if (!renderLoadingScreen) {
        renderLoadingScreen = loadingScreenRenderer();
      }
      renderLoadingScreen();
    } else if (gameState.phase.tag === 'title') {
      renderLoadingScreen = undefined;
      renderPlayScreen = undefined;
      if (!renderTitleScreen) {
        renderTitleScreen = titleScreenRenderer();
      }
      renderTitleScreen();
    } else if (gameState.phase.tag === 'playing') {
      renderLoadingScreen = undefined;
      renderTitleScreen = undefined;
      if (!renderPlayScreen) {
        renderPlayScreen = playScreenRenderer();
      }
      renderPlayScreen();
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
