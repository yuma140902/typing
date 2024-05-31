import { type DurationMs, type TimeMs } from './time';

/**
 * イージング
 */
export type Easing = {
  // イージングの開始時刻
  start: TimeMs;
  // イージングの長さ
  duration: DurationMs;
  type: EasingType;
};

/**
 * イージング関数の種類
 */
export type EasingType =
  | 'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad';

/**
 * 時間によって変化する値
 */
export type EasingValue<T> = {
  easing: Easing;
  from: T;
  to: T;
};

/**
 * 時間をもとにイージング関数を適用して値を計算する
 * @param from - 最初の値
 * @param to - 最後の値
 * @param easing - イージング
 * @param now - 現在時刻
 */
export const easing = (
  from: number,
  to: number,
  easing: Easing,
  now: TimeMs,
): number => {
  const current = Math.min(1, (now - easing.start) / easing.duration);
  if (easing.type === 'linear') {
    return from + (to - from) * current;
  } else if (easing.type === 'easeInQuad') {
    return from + (to - from) * current ** 2;
  } else if (easing.type == 'easeOutQuad') {
    return from + (to - from) * (1 - (1 - current) ** 2);
  } else if (easing.type == 'easeInOutQuad') {
    if (current < 0.5) {
      return from + (to - from) * (2 * current ** 2);
    } else {
      return from + (to - from) * (1 - (2 * (1 - current)) ** 2);
    }
  } else {
    // unreachable
    return from;
  }
};

export const animateNumber = (
  value: EasingValue<number>,
  now: TimeMs,
): number => {
  return easing(value.from, value.to, value.easing, now);
};

export const animatePoint = (
  value: EasingValue<{ x: number; y: number }>,
  now: TimeMs,
): { x: number; y: number } => {
  return {
    x: easing(value.from.x, value.to.x, value.easing, now),
    y: easing(value.from.y, value.to.y, value.easing, now),
  };
};
