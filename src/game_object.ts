import { type EasingValue } from './easing';

export type GameObject = Rectangle | TitleCharacter;

export type Rectangle = {
  tag: 'rectangle';
  position: EasingValue<{ x: number; y: number }>;
  width: number;
  height: number;
};

export type TitleCharacter = {
  tag: 'title-character';
  position: { x: number; y: number };
  character: string;
};
