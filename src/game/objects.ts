import { type Point } from '../util/point';

export type GameObject = Text;

export type Text = {
  tag: 'Text';
  position: Point;
  text: string;
};
