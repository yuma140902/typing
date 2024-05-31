import { type TimeMs } from './time';

export type Timeline<T> = {
  elements: TimelineElement<T>[];
};

export type TimelineElement<T> = {
  appearAt: TimeMs;
  disappearAt: TimeMs;
  obj: T;
};

/**
 * タイムラインから有効な要素を取得する
 */
export const listTimelineElements = <T>(now: TimeMs) => {
  return (timeline: Timeline<T>) =>
    timeline.elements.filter(
      (element) => element.appearAt <= now && now < element.disappearAt,
    );
};

/**
 * タイムラインから時間が過ぎた要素を削除する
 */
export const maintainTimeline = <T>(now: TimeMs) => {
  return (timeline: Timeline<T>) => {
    timeline.elements = timeline.elements.filter(
      (element) => element.disappearAt > now,
    );
  };
};
