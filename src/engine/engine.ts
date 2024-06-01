import { type Duration, type Time } from '../util/time';
import { createEmptyScene, type Scene } from './scene';
import {
  createRenderer,
  scheduleRendering,
  type RenderableObject,
} from './renderer';
import { customEventName, type Message } from './message';

export type ResourceLoader<R> = () => Promise<R>;

export type MessageHandler<S, O, R, M> = (
  state: S,
  message: Message<R, M>,
  mutableScene: Scene<O>,
) => S | undefined;

export type GetRenderableObjects<S, O> = (
  state: S,
  scene: Scene<O>,
  deltaTime: Duration,
  now: Time,
  ctx: CanvasRenderingContext2D,
) => RenderableObject[];

export const startEngine = <S, O, R, M>(
  ctx: CanvasRenderingContext2D,
  resourceLoader: ResourceLoader<R>,
  initialState: S,
  messageHandler: MessageHandler<S, O, R, M>,
  getRenderableObjects: GetRenderableObjects<S, O>,
) => {
  const renderer = createRenderer(ctx, getRenderableObjects);
  let state = initialState;
  let scene = createEmptyScene<O>();

  const sendMessage = (message: Message<R, M>) => {
    let newState = messageHandler(state, message, scene);
    if (newState) {
      state = newState;
      scheduleRendering(renderer, state, scene);
    }
  };

  sendMessage({ tag: 'GameInitialized' });
  sendMessage({
    tag: 'WindowResized',
    width: ctx.canvas.width,
    height: ctx.canvas.height,
  });

  resourceLoader().then((resource) => {
    sendMessage({ tag: 'ResourceLoaded', resource });
  });

  window.addEventListener('resize', () => {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    sendMessage({
      tag: 'WindowResized',
      width: ctx.canvas.width,
      height: ctx.canvas.height,
    });
  });

  window.addEventListener('keydown', (event) => {
    sendMessage({ tag: 'KeyEvent', event });
  });

  window.addEventListener(customEventName, (event) => {
    const customEvent = event as CustomEvent<M>;
    sendMessage({ tag: 'Custom', value: customEvent.detail });
  });
};
