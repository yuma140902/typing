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
 * - {@link Message}
 * - {@link Scene}
 * - {@link RenderableObject}
 * - {@link Renderer}
 *
 * キーボード入力やウィンドウのリサイズなどのイベントが発生すると、ユーザーが用意したメッセージハンドラに{@link Message}が送られる。メッセージハンドラは{@link Message}を受け取り、`GameState`と{@link Scene}を更新する。
 *
 * 画面を描画するときは、{@link Scene}をもとに{@link RenderableObject}のリストが作られ、{@link Renderer}によって画面上のCanvasに描画される。
 *
 * ## Message
 *
 * {@link Message}はエンジンによって定義されている型で、イベントを表す。キーボード入力やウィンドウのリサイズなどいくつかの{@link Message}が定義されている。
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
 * {@link Scene}は`GameObject`を格納するためのコンテナである。
 *
 * ## RenderableObject
 *
 * {@link RenderableObject}はエンジンによって定義されている型で、描画可能なオブジェクトを表す。長方形やテキストなどのプリミティブである。
 *
 * ## MessageHandler
 *
 * {@link MessageHandler}はユーザーが定義する関数である。{@link Message}が発生したときに呼び出され、`GameState`と{@link Scene}を更新する。
 *
 * ## GetRenderableObjects
 *
 * {@link GetRenderableObjects}はユーザーが定義する関数である。描画が必要になったタイミングで呼び出され、{@link Scene}とそこに格納されている`GameObject`達をもとに{@link RenderableObject}のリストを生成する。
 *
 * @module engine
 */
export * from './engine';
export * from './message';
export * from './renderer';
export * from './scene';
