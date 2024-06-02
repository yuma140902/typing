import {
  Scene,
  sceneAddObject,
  sceneClearObjects,
  sceneGetObject,
} from '../../engine';
import { time } from '../../util';
import { GenerationalId } from '../../util/generational_array';
import { Time } from '../../util/time';
import { GameObject, Rectangle } from '../objects';
import { easeOut, fixed, linear } from '../scene';
import { PlayingPhase } from '../state';

const font = '48px IBMPlexSans, IBMPlexSansJP';
const textX = 100;
const textY = 100;
const cursorWidth = 4;
const cursorHeight = 60;
const cursorX = textX;
const cursorY = textY - 48;
const correctTextLayer = 0;
const typingTextLayer = 1;
const cursorLayer = 2;

export const enterPlayingScreen = (
  _ctx: CanvasRenderingContext2D,
  mutableScene: Scene<GameObject>,
  now: Time,
  cursorId: GenerationalId | undefined,
  state: PlayingPhase,
) => {
  const lastCursorScene = cursorId
    ? sceneGetObject(mutableScene, cursorId)
    : undefined;
  const lastCursor =
    lastCursorScene &&
    lastCursorScene.appear <= now &&
    now < lastCursorScene.disappear
      ? (lastCursorScene.value as Rectangle)
      : undefined;

  sceneClearObjects(mutableScene);

  const correctText: GameObject = {
    tag: 'Text',
    text: state.correctText,
    font,
    fill: 'dimmed',
    x: textX,
    y: textY,
  };
  sceneAddObject(
    mutableScene,
    correctText,
    now,
    time.after(now, time.ms(Infinity)),
    correctTextLayer,
  );

  const cursorDuration = time.ms(120);
  const cursor: GameObject = {
    tag: 'Rectangle',
    fill: 'primary',
    x: lastCursor
      ? easeOut(lastCursor.x.to, cursorX, now, cursorDuration)
      : fixed(cursorX),
    y: lastCursor
      ? easeOut(lastCursor.y.to, cursorY, now, cursorDuration)
      : fixed(cursorY),
    width: lastCursor
      ? easeOut(lastCursor.width.to, cursorWidth, now, cursorDuration)
      : fixed(cursorWidth),
    height: lastCursor
      ? easeOut(lastCursor.height.to, cursorHeight, now, cursorDuration)
      : fixed(cursorHeight),
  };
  sceneAddObject(
    mutableScene,
    cursor,
    now,
    time.after(now, time.ms(Infinity)),
    cursorLayer,
  );
};

export const onType = (
  ctx: CanvasRenderingContext2D,
  mutableScene: Scene<GameObject>,
  now: Time,
  state: PlayingPhase,
  event: KeyboardEvent,
): PlayingPhase => {
  sceneClearObjects(mutableScene);

  const correctText: GameObject = {
    tag: 'Text',
    text: state.correctText,
    font,
    fill: 'dimmed',
    x: textX,
    y: textY,
  };
  sceneAddObject(
    mutableScene,
    correctText,
    now,
    time.after(now, time.ms(Infinity)),
    correctTextLayer,
  );

  const prevTypingTextWidth = ctx.measureText(state.typingText).width;
  if (state.correctText.startsWith(state.typingText + event.key)) {
    state = {
      ...state,
      typingText: state.typingText + event.key,
    };
  }
  const currentTypingTextWidth = ctx.measureText(state.typingText).width;

  const typingText: GameObject = {
    tag: 'Text',
    text: state.typingText,
    font,
    fill: 'foreground',
    x: textX,
    y: textY,
  };
  sceneAddObject(
    mutableScene,
    typingText,
    now,
    time.after(now, time.ms(Infinity)),
    typingTextLayer,
  );

  const cursor: GameObject = {
    tag: 'Rectangle',
    fill: 'primary',
    x: linear(
      cursorX + prevTypingTextWidth,
      cursorX + currentTypingTextWidth,
      now,
      time.ms(100),
    ),
    y: fixed(cursorY),
    width: fixed(cursorWidth),
    height: fixed(cursorHeight),
  };
  sceneAddObject(
    mutableScene,
    cursor,
    now,
    time.after(now, time.ms(Infinity)),
    cursorLayer,
  );

  return state;
};
