/**
 * # ゲームエンジン
 *
 * 描画、イベントの処理、状態の管理等のために独自のゲームエンジンを使用している。
 *
 * ## 主要概念と全体の処理の流れ
 *
 * ゲームエンジンに登場する主要な概念として以下のものがある。
 *
 * - `GameState`
 * - {@linkcode engine/message!Message Message}
 * - {@linkcode engine/scene!Scene Scene}
 * - {@linkcode engine/renderer!RenderableObject RenderableObject}
 * - {@linkcode engine/renderer!Renderer Renderer}
 *
 * キーボード入力やウィンドウのリサイズなどのイベントが発生すると、ユーザーが用意したメッセージハンドラに{@linkcode engine/message.Message Message}が送られる。メッセージハンドラは{@linkcode engine/message.Message Message}を受け取り、`GameState`と{@linkcode engine/scene.Scene Scene}を更新する。
 *
 * 画面を描画するときは、{@linkcode engine/scene.Scene Scene}をもとに{@linkcode engine/renderer.RenderableObject RenderableObject}のリストが作られ、{@linkcode engine/renderer.Renderer Renderer}によって画面上のCanvasに描画される。
 *
 * ## Message
 *
 * {@linkcode engine/message.Message Message}はエンジンによって定義されている型で、イベントを表す。キーボード入力やウィンドウのリサイズなどいくつかのMessageが定義されている。
 *
 * ## GameState
 *
 * `GameState`はユーザーが定義する型である。ゲームの状態を表現するために使用する。
 *
 * 例えば、現在のプレイヤーの得点やゲームのフェーズ(タイトル画面、ステージ1、2、リザルト画面など)を記録しておくことを想定している。
 *
 * ## GameObject
 *
 * `GameObject`はユーザーが定義する型である。ゲーム内に登場するものを表す。
 *
 * 例えば、自機を表すゲームオブジェクト、敵を表すゲームオブジェクト、マップを表すゲームオブジェクトなどを定義することを想定している。
 *
 * ## Scene
 *
 * {@linkcode engine/scene.Scene Scene}は`GameObject`を格納するためのコンテナである。
 *
 * ## RenderableObject
 *
 * {@linkcode engine/renderer.RenderableObject RenderableObject}はエンジンによって定義されている型で、描画可能なオブジェクトを表す。長方形やテキストなどのプリミティブである。
 *
 * ## MessageHandler
 *
 * {@linkcode MessageHandler}はユーザーが定義する関数である。{@linkcode engine/message.Message Message}が発生したときに呼び出され、`GameState`と{@linkcode engine/scene.Scene Scene}を更新する。
 *
 * ## GetRenderableObjects
 *
 * {@linkcode GetRenderableObjects}はユーザーが定義する関数である。描画が必要になったタイミングで呼び出され、{@linkcode engine/scene.Scene Scene}とそこに格納されている`GameObject`達をもとに{@linkcode engine/renderer.RenderableObject RenderableObject}のリストを生成する。
 *
 * @module engine
 */

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
      scheduleRendering(renderer, () => state, scene);
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
    event.preventDefault();
    sendMessage({ tag: 'KeyEvent', event });
  });

  window.addEventListener(customEventName, (event) => {
    const customEvent = event as CustomEvent<M>;
    sendMessage({ tag: 'Custom', value: customEvent.detail });
  });
};
