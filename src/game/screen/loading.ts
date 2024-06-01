import { Scene, sceneAddObject, sceneClearObjects } from '../../engine';
import { time } from '../../util';
import { Time } from '../../util/time';
import { GameObject } from '../objects';

export const enterLoadingScreen = (
  ctx: CanvasRenderingContext2D,
  mutableScene: Scene<GameObject>,
  now: Time,
) => {
  const text = 'Loading...';
  const textWidth = ctx.measureText(text).width;
  const x = (ctx.canvas.width - textWidth) / 2;
  const y = ctx.canvas.height / 2;

  const obj: GameObject = {
    tag: 'Text',
    text,
    fill: 'foreground',
    font: '24px IBMPlexSans, IBMPlexSansJP, monospace',
    x,
    y,
  };

  sceneClearObjects(mutableScene);
  sceneAddObject(mutableScene, obj, now, time.after(now, time.ms(Infinity)), 0);
};
