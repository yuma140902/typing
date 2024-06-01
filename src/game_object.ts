import { type Point, type EasingValue } from './engine';
import { type Theme } from './theme';

export type GameObject = Rectangle | TextBlock;

export type Rectangle = {
  tag: 'rectangle';
  position: EasingValue<Point>;
  strokeColor?: keyof Theme;
  fillColor?: keyof Theme;
  width: EasingValue<number>;
  height: EasingValue<number>;
};

export type TextBlock = {
  tag: 'text-block';
  position: EasingValue<Point>;
  strokeColor?: keyof Theme;
  fillColor?: keyof Theme;
  align?: CanvasTextAlign;
  font?: string;
  text: string;
};
