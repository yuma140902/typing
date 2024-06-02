import {
  sceneIsFixed,
  sceneRemoveDisappearedObjects,
  type Scene,
} from './scene';
import { GetRenderableObjects } from './engine';
import { time } from '../util';
import { createFpsCounter } from '../util/fps';

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

export type Renderer<S, O> = {
  renderScene: (state: S, scene: Scene<O>) => void;
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

export const createRenderer = <S, O>(
  ctx: CanvasRenderingContext2D,
  getRenderableObjects: GetRenderableObjects<S, O>,
): Renderer<S, O> => {
  let prevTime = time.now();
  let frame = 0;
  const fpsCounter = createFpsCounter();
  let objects: RenderableObject[] = [];
  let needsAnimation = false;

  const renderDebugInfo = (info: { label: string; value: string }[]) => {
    const font = ctx.font;
    const fillStyle = ctx.fillStyle;
    ctx.font = '12px monospace';
    ctx.fillStyle = '#abb2bf';
    info.forEach(({ label, value }, i) => {
      const text = `${label}: ${value}`;
      const width = ctx.measureText(text).width;
      ctx.fillText(text, ctx.canvas.width - width - 8, 12 * (i + 1));
    });
    ctx.font = font;
    ctx.fillStyle = fillStyle;
  };

  const checkNeedAnimation = () => objects.some((obj) => obj.needsAnimation);

  const renderScene = (state: S, scene: Scene<O>) => {
    const now = time.now();
    const deltaTime = time.duration(now, prevTime);
    prevTime = now;
    frame += 1;

    sceneRemoveDisappearedObjects(scene, now);
    objects = getRenderableObjects(state, scene, deltaTime, now, ctx);
    renderObjects(ctx, objects);
    needsAnimation = checkNeedAnimation() || !sceneIsFixed(scene, now);

    fpsCounter.addSample();
    renderDebugInfo([
      { label: 'frame', value: frame.toString() },
      { label: 'deltaTime (ms)', value: deltaTime.toFixed(2) },
      { label: 'FPS', value: fpsCounter.getFps().toFixed(2) },
      {
        label: 'rendering loop',
        value: needsAnimation ? 'running' : 'suspended',
      },
    ]);
  };

  return {
    renderScene,
    needsAnimation: () => needsAnimation,
  };
};

let animationLoop = false;

export const scheduleRendering = <S, O>(
  renderer: Renderer<S, O>,
  state: S,
  scene: Scene<O>,
  reason: 'animation' | 'message' = 'message',
) => {
  if (animationLoop && reason === 'message') {
    return;
  }
  window.requestAnimationFrame(() => {
    renderer.renderScene(state, scene);
    if (renderer.needsAnimation()) {
      animationLoop = true;
      scheduleRendering(renderer, state, scene, 'animation');
    } else {
      animationLoop = false;
    }
  });
};
