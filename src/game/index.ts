import {
  type GetRenderableObjects,
  type MessageHandler,
  type RenderableObject,
  startEngine,
  sceneAddObject,
  sceneClearObjects,
  sceneForEachAppearingObjects,
} from '../engine';
import { time } from '../util';
import { EasingValue, animateNumber } from '../util/easing';
import { Time } from '../util/time';
import { addTitleText, type GameObject, type Text } from './objects';
import { resourceLoader, type GameResources } from './resources';
import { getInitialGameState, type GameState } from './state';

export const start = () => {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
  const ctx = canvas.getContext('2d')!;

  const messageHandler: MessageHandler<GameState, GameObject, GameResources> = (
    state,
    message,
    mutableScene,
  ) => {
    if (message.tag === 'GameInitialized') {
      const text: Text = {
        tag: 'Text',
        text: 'Loading...',
        fill: 'foreground',
        font: '24px IBMPlexSans, IBMPlexSansJP, monospace',
        x: 100,
        y: 100,
      };
      sceneAddObject(
        mutableScene,
        text,
        time.now(),
        time.after(time.now(), time.ms(Infinity)),
        1,
      );
      return {
        ...state,
      };
    } else if (message.tag === 'ResourceLoaded') {
      const [f1, f2, _] = message.resource;
      document.fonts.add(f1);
      document.fonts.add(f2);

      sceneClearObjects(mutableScene);

      addTitleText(
        mutableScene,
        ctx,
        'タイピングゲーム: Mini Typing (仮称)',
        time.now(),
        state.width,
        state.height,
      );

      return {
        ...state,
        phase: { tag: 'title' },
      };
    } else if (message.tag === 'WindowResized') {
      return {
        ...state,
        width: message.width,
        height: message.height,
      };
    } else if (message.tag === 'KeyEvent') {
      if (state.phase.tag === 'title') {
        if (message.event.key === ' ') {
          sceneClearObjects(mutableScene);
          return {
            ...state,
            phase: { tag: 'playing' },
          };
        }
      }
    }
  };

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

  const getRenderableObjects: GetRenderableObjects<GameState, GameObject> = (
    state,
    scene,
    _deltaTime,
    now,
    _ctx,
  ) => {
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

    sceneForEachAppearingObjects(scene, now, (obj) => {
      if (obj.tag === 'Text') {
        rs.push({
          needsAnimation: false,
          layer: 1,
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
          layer: 1,
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

  startEngine(
    ctx,
    resourceLoader,
    getInitialGameState(),
    messageHandler,
    getRenderableObjects,
  );
};
