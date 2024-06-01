import { Scene, sceneAddObject } from '../engine';
import { time } from '../util';
import { EasingValue } from '../util/easing';
import { Duration, Time } from '../util/time';
import { GameObject } from './objects';

const linear = <T>(
  from: T,
  to: T,
  start: Time,
  duration: Duration,
): EasingValue<T> => {
  return {
    from,
    to,
    easing: {
      type: {
        tag: 'linear',
        sanitizer: { tag: 'clamp' },
      },
      start,
      duration,
    },
  };
};

const fixed = <T>(value: T): EasingValue<T> => {
  return {
    from: value,
    to: value,
    easing: {
      type: {
        tag: 'fixed',
      },
      start: time.now(),
      duration: time.ms(Infinity),
    },
  };
};

export const addTitleText = (
  scene: Scene<GameObject>,
  ctx: CanvasRenderingContext2D,
  text: string,
  start: Time,
  canvasWidth: number,
  canvasHeight: number,
) => {
  /** 1文字表示するのにかける時間 */
  const delay: Duration = time.ms(250);
  /** カーソルが動いている時間の割合 */
  const cursorRatio = 0.75;
  /** フォントサイズ */
  const fontSize = 48;
  /** カーソルの高さ */
  const cursorHeight = Math.floor(fontSize / 0.8);
  /** カーソルの幅 */
  const cursorWidth = Math.floor(cursorHeight / 15);

  const font = `${fontSize}px IBMPlexSans, IBMPlexSansJP`;
  ctx.font = font;

  const textWidth = ctx.measureText(text).width;
  const baseX = canvasWidth / 2 - textWidth / 2;
  const cursorY = canvasHeight / 2 - 48;
  const textY = canvasHeight / 2;

  const letters = text.split('');
  let xs: number[] = [];
  {
    let s = '';
    for (let i = 0; i < letters.length; i++) {
      const w = ctx.measureText(s).width;
      xs[i] = baseX + w;
      s += letters[i];
    }
    xs.push(baseX + textWidth);
  }
  let timings: {
    cursorAppear: Time;
    cursorDisappear: Time;
    cursorStart: Time;
    cursorDuration: Duration;
    textAppear: Time;
  }[] = [];
  {
    for (let i = 0; i < letters.length; i++) {
      timings.push({
        cursorAppear: time.after(start, time.ms(i * delay)),
        cursorDisappear:
          i === letters.length - 1
            ? time.after(start, time.ms(Infinity))
            : time.after(start, time.ms(i * delay + delay)),
        cursorStart: time.after(start, time.ms(i * delay)),
        cursorDuration: time.ms(delay * cursorRatio),
        textAppear: time.after(
          start,
          time.ms(i * delay + delay * (cursorRatio / 2)),
        ),
      });
    }
  }

  for (let i = 0; i < letters.length; i++) {
    const timing = timings[i];
    sceneAddObject(
      scene,
      {
        tag: 'Rectangle',
        fill: 'primary',
        x: linear(xs[i], xs[i + 1], timing.cursorStart, timing.cursorDuration),
        y: fixed(cursorY),
        width: fixed(cursorWidth),
        height: fixed(cursorHeight),
      },
      timing.cursorAppear,
      timing.cursorDisappear,
      2,
    );
  }
  for (let i = 0; i < letters.length; i++) {
    const timing = timings[i];
    sceneAddObject(
      scene,
      {
        tag: 'Text',
        fill: 'foreground',
        font,
        x: xs[i],
        y: textY,
        text: letters[i],
      },
      timing.textAppear,
      time.after(start, time.ms(Infinity)),
      1,
    );
  }
};
