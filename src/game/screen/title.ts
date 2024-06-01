import { Scene, sceneClearObjects } from '../../engine';
import { Time } from '../../util/time';
import { GameObject } from '../objects';
import { addTitleText } from '../scene';

export const enterTitleScreen = (
  ctx: CanvasRenderingContext2D,
  mutableScene: Scene<GameObject>,
  now: Time,
) => {
  sceneClearObjects(mutableScene);

  addTitleText(
    mutableScene,
    ctx,
    'タイピングゲーム: Mini Typing (仮称)',
    now,
    ctx.canvas.width,
    ctx.canvas.height,
  );
};
