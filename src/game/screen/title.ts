import { Scene, sceneAddObject, sceneClearObjects } from '../../engine';
import { time } from '../../util';
import { Time } from '../../util/time';
import { GameObject } from '../objects';
import { addTitleText, linear } from '../scene';

export const enterTitleScreen = (
  ctx: CanvasRenderingContext2D,
  mutableScene: Scene<GameObject>,
  now: Time,
) => {
  sceneClearObjects(mutableScene);

  const { end, lastCursor } = addTitleText(
    mutableScene,
    ctx,
    'タイピングゲーム: Mini Typing (仮称)',
    now,
    ctx.canvas.width,
    ctx.canvas.height,
  );

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
    x: linear(lastCursor.x, startTextX, rectStart, rectDuration),
    y: linear(lastCursor.y, startTextY - 48, rectStart, rectDuration),
    width: linear(lastCursor.width, startTextWidth, rectStart, rectDuration),
    height: linear(lastCursor.height, 60, rectStart, rectDuration),
  };
  sceneAddObject(
    mutableScene,
    startRect,
    end,
    time.after(end, time.ms(Infinity)),
    0,
  );
};
