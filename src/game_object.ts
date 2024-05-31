import { type EasingValue } from './easing';
import { type Theme } from './theme';

export type GameObject = Rectangle | TextBlock;

export type Rectangle = {
  tag: 'rectangle';
  position: EasingValue<{ x: number; y: number }>;
  strokeColor?: keyof Theme;
  fillColor?: keyof Theme;
  width: EasingValue<number>;
  height: EasingValue<number>;
};

export type TextBlock = {
  tag: 'text-block';
  position: EasingValue<{ x: number; y: number }>;
  strokeColor?: keyof Theme;
  fillColor?: keyof Theme;
  align?: CanvasTextAlign;
  font?: string;
  text: string;
};
