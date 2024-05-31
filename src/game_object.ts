import { type EasingValue } from './easing';
import { type Theme } from './theme';

export type GameObject = Rectangle | TitleCharacter | TextBlock;

export type Rectangle = {
  tag: 'rectangle';
  position: EasingValue<{ x: number; y: number }>;
  color: keyof Theme;
  width: number;
  height: number;
};

export type TitleCharacter = {
  tag: 'title-character';
  position: { x: number; y: number };
  character: string;
};

export type TextBlock = {
  tag: 'text-block';
  position: { x: number; y: number };
  text: string;
};
