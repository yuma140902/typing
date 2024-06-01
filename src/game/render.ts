import {
  GetRenderableObjects,
  RenderableObject,
  sceneForEachAppearingObjects,
} from '../engine';
import { time } from '../util';
import { EasingValue, animateNumber } from '../util/easing';
import { Time } from '../util/time';
import { GameObject } from './objects';
import { GameState } from './state';

const allFixed = <T>(values: EasingValue<T>[], now: Time): boolean => {
  return values.every((v) => {
    if (v.easing.type.tag === 'fixed') {
      return true;
    } else if (time.after(v.easing.start, v.easing.duration) < now) {
      return true;
    }
    return false;
  });
};

export const getRenderableObjects: GetRenderableObjects<
  GameState,
  GameObject
> = (state, scene, _deltaTime, now, _ctx) => {
  let rs: RenderableObject[] = [];

  rs.push({
    needsAnimation: false,
    layer: 0,
    tag: 'rectangle',
    x: 0,
    y: 0,
    width: state.width,
    height: state.height,
    fillColor: state.theme.background,
  });

  sceneForEachAppearingObjects(scene, now, (obj, layer) => {
    if (obj.tag === 'Text') {
      rs.push({
        needsAnimation: false,
        layer,
        tag: 'text',
        x: obj.x,
        y: obj.y,
        align: 'start',
        text: obj.text,
        font: obj.font,
        fillColor: state.theme[obj.fill],
      });
    } else if (obj.tag === 'Rectangle') {
      rs.push({
        needsAnimation: !allFixed([obj.x, obj.y, obj.width, obj.height], now),
        layer,
        tag: 'rectangle',
        x: animateNumber(obj.x, now),
        y: animateNumber(obj.y, now),
        width: animateNumber(obj.width, now),
        height: animateNumber(obj.height, now),
        fillColor: state.theme[obj.fill],
      });
    }
  });
  return rs;
};
