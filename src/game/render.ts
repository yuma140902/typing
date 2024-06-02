import {
  GetRenderableObjects,
  RenderableObject,
  sceneForEachAppearingObjects,
} from '../engine';
import { time } from '../util';
import { EasingValue, animateNumber } from '../util/easing';
import { Duration, Time } from '../util/time';
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

const formatDuration = (duration: Duration): string => {
  const ms = duration % 1000;
  const s = Math.floor(duration / 1000) % 60;
  const m = Math.floor(duration / 60000);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${ms
    .toString()
    .padStart(2, '0')}`;
};

export const getRenderableObjects: GetRenderableObjects<
  GameState,
  GameObject
> = (state, scene, _deltaTime, now, ctx) => {
  let rs: RenderableObject[] = [];

  rs.push({
    needsAnimation: false,
    layer: 0,
    tag: 'rectangle',
    x: 0,
    y: 0,
    width: ctx.canvas.width,
    height: ctx.canvas.height,
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
    } else if (obj.tag === 'Timer') {
      rs.push({
        needsAnimation: !obj.end,
        layer,
        tag: 'text',
        x: obj.x,
        y: obj.y,
        align: 'start',
        text: formatDuration(time.duration(obj.end ?? now, obj.since)),
        font: obj.font,
        fillColor: state.theme[obj.fill],
      });
    }
  });
  return rs;
};
