import { sceneRemoveDisappearedObjects, type Scene } from './scene';
import * as time from '../util/time';
import * as fps_counter from '../util/fps_counter';
import { type Duration, type Time } from '../util/time';

export type RenderableObject = {
  needsAnimation: boolean;
  layer: number;
} & (Rectangle | Text);

export type Rectangle = {
  tag: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
};

export type Text = {
  tag: 'text';
  x: number;
  y: number;
  align: CanvasTextAlign;
  text: string;
  font: string;
  fillColor: string;
};

export type Renderer<O> = {
  renderScene: (scene: Scene<O>) => void;
  needsAnimation: () => boolean;
};

const renderObjects = (
  ctx: CanvasRenderingContext2D,
  objects: RenderableObject[],
) => {
  objects.sort((a, b) => a.layer - b.layer);
  for (const obj of objects) {
    if (obj.tag === 'rectangle') {
      ctx.fillStyle = obj.fillColor;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    } else if (obj.tag === 'text') {
      ctx.fillStyle = obj.fillColor;
      ctx.font = obj.font;
      ctx.textAlign = obj.align;
      ctx.fillText(obj.text, obj.x, obj.y);
    }
  }
};

export const createRenderer = <O>(
  canvas: HTMLCanvasElement,
  getRenderableObjects: (
    scene: Scene<O>,
    deltaTime: Duration,
    now: Time,
    ctx: CanvasRenderingContext2D,
  ) => RenderableObject[],
): Renderer<O> => {
  const ctx = canvas.getContext('2d')!;
  let prevTime = time.now();
  let tick = 0;
  const fpsCounter = fps_counter.create();
  let objects: RenderableObject[] = [];

  const renderDebugInfo = (info: { label: string; value: string }[]) => {
    const font = ctx.font;
    const fillStyle = ctx.fillStyle;
    ctx.font = '12px monospace';
    ctx.fillStyle = '#abb2bf';
    info.forEach(({ label, value }, i) => {
      const text = `${label}: ${value}`;
      const width = ctx.measureText(text).width;
      ctx.fillText(text, canvas.width - width - 8, 12 * (i + 1));
    });
    ctx.font = font;
    ctx.fillStyle = fillStyle;
  };

  const needsAnimation = () => objects.some((obj) => obj.needsAnimation);

  const renderScene = (scene: Scene<O>) => {
    const now = time.now();
    const deltaTime = time.duration(now, prevTime);
    prevTime = now;
    tick += 1;

    sceneRemoveDisappearedObjects(scene, now);
    objects = getRenderableObjects(scene, deltaTime, now, ctx);
    renderObjects(ctx, objects);

    fpsCounter.addSample();
    renderDebugInfo([
      { label: 'tick', value: tick.toString() },
      { label: 'deltaTime (ms)', value: deltaTime.toFixed(2) },
      { label: 'FPS', value: fpsCounter.getFps().toFixed(2) },
    ]);
  };

  return { renderScene, needsAnimation };
};

export const scheduleRendering = <O>(
  renderer: Renderer<O>,
  scene: Scene<O>,
) => {
  window.requestAnimationFrame(() => {
    renderer.renderScene(scene);
    if (renderer.needsAnimation()) {
      scheduleRendering(renderer, scene);
    }
  });
};
