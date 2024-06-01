import {
  type GetRenderableObjects,
  type MessageHandler,
  type RenderableObject,
  startEngine,
  sceneAddObject,
  sceneClearObjects,
  sceneForEachAppearingObjects,
} from '../engine';
import * as time from '../util/time';
import { type GameObject, type Text } from './objects';
import { resourceLoader, type GameResources } from './resources';
import { getInitialGameState, type GameState } from './state';

export const start = () => {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;

  const messageHandler: MessageHandler<GameState, GameObject, GameResources> = (
    state,
    message,
    mutableScene,
  ) => {
    if (message.tag === 'GameInitialized') {
      const text: Text = {
        tag: 'Text',
        text: 'Loading...',
        position: { x: 10, y: 10 },
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

      const text: Text = {
        tag: 'Text',
        text: 'タイピングゲーム: Mini Typing (仮称)',
        position: { x: 10, y: 10 },
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

  const getRenderableObjects: GetRenderableObjects<GameObject> = (
    scene,
    _deltaTime,
    now,
    _ctx,
  ) => {
    let rs: RenderableObject[] = [];
    sceneForEachAppearingObjects(scene, now, (obj) => {
      if (obj.tag === 'Text') {
        rs.push({
          needsAnimation: false,
          layer: 1,
          tag: 'text',
          x: obj.position.x,
          y: obj.position.y,
          align: 'start',
          text: obj.text,
          font: '48px IBMPlexSans, IBMPlexSansJP',
          fillColor: 'black',
        });
      }
    });
    return rs;
  };

  startEngine(
    canvas,
    resourceLoader,
    getInitialGameState(),
    messageHandler,
    getRenderableObjects,
  );
};
