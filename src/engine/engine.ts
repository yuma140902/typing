import { type Duration, type Time } from '../util/time';
import { createEmptyScene, type Scene } from './scene';
import {
  createRenderer,
  scheduleRendering,
  type RenderableObject,
} from './renderer';
import { type Message } from './message';

export type ResourceLoader<R> = () => Promise<R>;

export type MessageHandler<S, O, R> = (
  state: S,
  message: Message<R>,
  mutableScene: Scene<O>,
) => S | undefined;

export type GetRenderableObjects<O> = (
  scene: Scene<O>,
  deltaTime: Duration,
  now: Time,
  ctx: CanvasRenderingContext2D,
) => RenderableObject[];

export const startEngine = <S, O, R>(
  canvas: HTMLCanvasElement,
  resourceLoader: ResourceLoader<R>,
  initialState: S,
  messageHandler: MessageHandler<S, O, R>,
  getRenderableObjects: GetRenderableObjects<O>,
) => {
  const renderer = createRenderer(canvas, getRenderableObjects);
  let state = initialState;
  let scene = createEmptyScene<O>();

  const sendMessage = (message: Message<R>) => {
    let newState = messageHandler(state, message, scene);
    if (newState) {
      state = newState;
      scheduleRendering(renderer, scene);
    }
  };

  sendMessage({ tag: 'GameInitialized' });
  sendMessage({
    tag: 'WindowResized',
    width: canvas.width,
    height: canvas.height,
  });

  resourceLoader().then((resource) => {
    sendMessage({ tag: 'ResourceLoaded', resource });
  });

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    sendMessage({
      tag: 'WindowResized',
      width: canvas.width,
      height: canvas.height,
    });
  });

  window.addEventListener('keydown', (event) => {
    sendMessage({ tag: 'KeyEvent', event });
  });
};
