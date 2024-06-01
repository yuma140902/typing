import { type Time } from './util/time';

export type Timeline<T> = {
  elements: TimelineElement<T>[];
};

export type TimelineElement<T> = {
  appearAt: Time;
  disappearAt: Time;
  obj: T;
};

/**
 * タイムラインから有効な要素を取得する
 */
export const listTimelineElements = <T>(
  timeline: Timeline<T>,
  now: Time,
): T[] =>
  timeline.elements
    .filter((element) => element.appearAt <= now && now < element.disappearAt)
    .map((element) => element.obj);

/**
 * タイムラインから時間が過ぎた要素を削除する
 */
export const maintainTimeline = <T>(timeline: Timeline<T>, now: Time) => {
  timeline.elements = timeline.elements.filter(
    (element) => element.disappearAt > now,
  );
};
