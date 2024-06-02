import {
  Scene,
  sceneAddObject,
  sceneClearObjects,
  sceneGetObject,
} from '../../engine';
import { time } from '../../util';
import { GenerationalId } from '../../util/generational_array';
import { Duration, Time } from '../../util/time';
import { GameObject, Rectangle } from '../objects';
import { easeOut, fixed, linear } from '../scene';

const addTitleText = (
  scene: Scene<GameObject>,
  ctx: CanvasRenderingContext2D,
  text: string,
  start: Time,
  canvasWidth: number,
  canvasHeight: number,
): GenerationalId => {
  /** 1文字表示するのにかける時間 */
  const delay: Duration = time.ms(240);
  /** カーソルが動いている時間の割合 */
  const cursorRatio = 0.75;
  /** フォントサイズ */
  const fontSize = 48;
  /** カーソルの高さ */
  const cursorHeight = Math.floor(fontSize / 0.8);
  /** カーソルの幅 */
  const cursorWidth = Math.floor(cursorHeight / 15);
  /** 最後のカーソルの表示時間 */
  const lastCursorDuration = time.ms(480);

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
            ? time.after(start, time.ms(i * delay + delay + lastCursorDuration))
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

  let lastCursorId: GenerationalId | undefined = undefined;
  for (let i = 0; i < letters.length; i++) {
    const timing = timings[i];
    lastCursorId = sceneAddObject(
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

  return lastCursorId!; // タイトルが1文字以上ならundefinedにならない
};

export const enterTitleScreen = (
  ctx: CanvasRenderingContext2D,
  mutableScene: Scene<GameObject>,
  now: Time,
): GenerationalId => {
  sceneClearObjects(mutableScene);

  const lastCursorId = addTitleText(
    mutableScene,
    ctx,
    'Typing Game (タイトル未定)',
    now,
    ctx.canvas.width,
    ctx.canvas.height,
  );

  const lastCursor = sceneGetObject(mutableScene, lastCursorId)!;
  const end = lastCursor.disappear;
  const lastCursorValue = lastCursor.value as Rectangle;

  const font = '48px IBMPlexSans, IBMPlexSansJP';
  const startMessage = 'スペースキーを押してスタート';
  ctx.font = font;
  const startTextWidth = ctx.measureText(startMessage).width;
  const startTextX = (ctx.canvas.width - startTextWidth) / 2;
  const startTextY = ctx.canvas.height * 0.75;
  const startText: GameObject = {
    tag: 'Text',
    text: startMessage,
    font,
    fill: 'background',
    x: startTextX,
    y: startTextY,
  };
  sceneAddObject(
    mutableScene,
    startText,
    end,
    time.after(end, time.ms(Infinity)),
    1,
  );

  const rectStart = end;
  const rectDuration = time.ms(480);
  const startRect: GameObject = {
    tag: 'Rectangle',
    fill: 'primary',
    x: easeOut(lastCursorValue.x.to, startTextX, rectStart, rectDuration),
    y: easeOut(lastCursorValue.y.to, startTextY - 48, rectStart, rectDuration),
    width: easeOut(
      lastCursorValue.width.to,
      startTextWidth,
      rectStart,
      rectDuration,
    ),
    height: easeOut(lastCursorValue.height.to, 60, rectStart, rectDuration),
  };
  return sceneAddObject(
    mutableScene,
    startRect,
    end,
    time.after(end, time.ms(Infinity)),
    0,
  );
};
