import { Scene, sceneClearObjects } from '../../engine';
import { Time } from '../../util/time';
import { GameObject } from '../objects';

export const enterPlayingScreen = (
  _ctx: CanvasRenderingContext2D,
  mutableScene: Scene<GameObject>,
  _now: Time,
) => {
  sceneClearObjects(mutableScene);
};
