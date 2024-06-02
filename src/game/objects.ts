import { EasingValue } from '../util/easing';
import { Theme } from './state';

export type GameObject = Text | Rectangle;

// TODO: Cursorを追加する
// TODO: Sceneから現在のカーソル位置を取得できるようにする

export type Rectangle = {
  tag: 'Rectangle';
  fill: keyof Theme;
  x: EasingValue<number>;
  y: EasingValue<number>;
  width: EasingValue<number>;
  height: EasingValue<number>;
};

export type Text = {
  tag: 'Text';
  font: string;
  x: number;
  y: number;
  text: string;
  fill: keyof Theme;
};
