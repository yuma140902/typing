import { type EasingValue } from './easing';

export type Rectangle = {
  position: EasingValue<{ x: number; y: number }>;
  width: number;
  height: number;
};
