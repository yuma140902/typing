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
export const listTimelineElements = <T>(
  timeline: Timeline<T>,
  now: TimeMs,
): T[] =>
  timeline.elements
    .filter((element) => element.appearAt <= now && now < element.disappearAt)
    .map((element) => element.obj);

/**
 * タイムラインから時間が過ぎた要素を削除する
 */
export const maintainTimeline = <T>(timeline: Timeline<T>, now: TimeMs) => {
  timeline.elements = timeline.elements.filter(
    (element) => element.disappearAt > now,
  );
};
