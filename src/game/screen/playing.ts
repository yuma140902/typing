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

const font = '24px IBMPlexSans, IBMPlexSansJP';
const textX = 100;
const textY = 150;
const cursorWidth = 4;
const cursorHeight = 30;
const cursorYDiff = 24;
const cursorX = textX;
const cursorY = textY - cursorYDiff;
const correctTextLayer = 0;
const typingTextLayer = 1;
const cursorLayer = 2;
const timerX = 100;
const timerY = 100;
const retryX = 100;
const retryY = 200;
const retryLayer = 3;

export const getRandomText = (): string => {
  const texts = [
    'Hello, World!',
    'print("Hello, World!")',
    'System.out.println("Hello, World!");',
    'console.log("Hello, World!");',
    'puts "Hello, World!"',
    'echo "Hello, World!";',
    'fmt.Println("Hello, World!")',
    'println!("Hello, World!");',
    '#define ptr_ok(x) ((x) > PAGE_OFFSET && (x) < PAGE_OFFSET + MAXMEM)',
    '#define BITBIT_SIZE(nr)	(BITBIT_NR(nr) * sizeof(long))',
    '#define __const_min(x, y) ((x) < (y) ? (x) : (y))',
    'extern void fpu_idle_fpregs(void);',
    'globals().update(http.HTTPStatus.__members__)',
    'git diff -a --stat',
    'git push --force-with-lease',
    'git checkout master',
    'git switch -c feature-pr9821',
    'git branch -d tuple-branch',
    'git rebase -i HEAD~3',
    'git commit --amend --no-edit',
    'git log --oneline --graph --all',
    'ls -R .',
    'npm install --save-dev typescript',
    'npm run build',
    'cargo run --release',
    'docker build -t myimage .',
    'docker compose up -d',
    'const result = originalCompile.apply(this, arguments)',
    'fs.rmSync(tmpdir, { recursive: true, force: true })',
    'const el2 = createScriptElement()',
    'Promise.resolve(42).then(console.log)',
    'All human beings are born free and equal in dignity and rights.',
    'Everyone has the right to life, liberty and security of person.',
    'No one may be compelled to belong to an association.',
    'To be, or not to be, that is the question.',
    'There is always light behind the clouds.',
    'Is it just me, or is it getting crazier out there?',
    'I just hope my death makes more cents than my life.',
    'There is more to life than increasing its speed.',
    'Do one thing everyday that scares you.',
    'If you want to be happy, be.',
    'Thou shouldst eat to live; not live to eat.',
    'Drive thy business; let it not drive thee.',
    'Good artists copy, great artists steal.',
    'I walk slowly, but I never walk backward.',
    'The first duty of love is to listen.',
    'Man errs as long as he strives.',
  ];
  return texts[Math.floor(Math.random() * texts.length)];
};

export const enterPlayingScreen = (
  _ctx: CanvasRenderingContext2D,
  mutableScene: Scene<GameObject>,
  now: Time,
  cursorId: GenerationalId | undefined,
  state: PlayingPhase,
): GenerationalId => {
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

  const timer: GameObject = {
    tag: 'Text',
    text: '00:00:000',
    font,
    fill: 'dimmed',
    x: timerX,
    y: timerY,
  };
  sceneAddObject(
    mutableScene,
    timer,
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
  return sceneAddObject(
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
  if (state.end) {
    return state;
  }

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

  if (!state.start) {
    state.start = now;
  }
  const timer: GameObject = {
    tag: 'Timer',
    since: state.start ?? now,
    font,
    fill: 'dimmed',
    x: timerX,
    y: timerY,
  };
  sceneAddObject(
    mutableScene,
    timer,
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
  const cursorId = sceneAddObject(
    mutableScene,
    cursor,
    now,
    time.after(now, time.ms(Infinity)),
    cursorLayer,
  );
  state.cursorId = cursorId;

  if (state.correctText === state.typingText) {
    state = onFinished(ctx, mutableScene, now, state);
  }

  return state;
};

export const onFinished = (
  ctx: CanvasRenderingContext2D,
  mutableScene: Scene<GameObject>,
  now: Time,
  state: PlayingPhase,
): PlayingPhase => {
  let lastCursor = sceneGetObject(mutableScene, state.cursorId!)!
    .value as Rectangle;

  sceneClearObjects(mutableScene);

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

  const timer: GameObject = {
    tag: 'Timer',
    since: state.start ?? now,
    end: state.end ?? now,
    font,
    fill: 'dimmed',
    x: timerX,
    y: timerY,
  };
  sceneAddObject(
    mutableScene,
    timer,
    now,
    time.after(now, time.ms(Infinity)),
    correctTextLayer,
  );

  const keyPerSec =
    (state.correctText.length /
      time.duration(state.end ?? now, state.start ?? now)) *
    1000;
  const retryStr = `${keyPerSec.toFixed(2)} key/sec. Enterキーでリトライ`;
  const retryWidth = ctx.measureText(retryStr).width;
  const retryText: GameObject = {
    tag: 'Text',
    text: retryStr,
    font,
    fill: 'background',
    x: retryX,
    y: retryY,
  };
  sceneAddObject(
    mutableScene,
    retryText,
    now,
    time.after(now, time.ms(Infinity)),
    retryLayer,
  );

  const cursor: GameObject = {
    tag: 'Rectangle',
    fill: 'primary',
    x: easeOut(lastCursor.x.to, retryX, now, time.ms(200)),
    y: easeOut(lastCursor.y.to, retryY - cursorYDiff, now, time.ms(200)),
    width: easeOut(lastCursor.width.to, retryWidth, now, time.ms(200)),
    height: fixed(cursorHeight),
  };
  const cursorId = sceneAddObject(
    mutableScene,
    cursor,
    now,
    time.after(now, time.ms(Infinity)),
    cursorLayer,
  );

  return {
    ...state,
    cursorId,
    end: now,
  };
};
