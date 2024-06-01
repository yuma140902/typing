import { type Duration, type Time } from '../util';

/**
 * イージング
 */
export type Easing = {
  type: EasingType;
  // イージングの開始時刻
  start: Time;
  // イージングの長さ
  duration: Duration;
};

/**
 * イージング関数の種類
 */
export type EasingType =
  | {
      tag: 'fixed';
    }
  | {
      tag: 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad';
      sanitizer: {
        tag: 'clamp' | 'wrap';
      };
    };

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
  now: Time,
): number => {
  if (easing.type.tag === 'fixed') {
    return from;
  }

  const currentUnsanitized = (now - easing.start) / easing.duration;
  const current =
    easing.type.sanitizer.tag === 'clamp'
      ? Math.min(1, Math.max(0, currentUnsanitized))
      : currentUnsanitized % 1;

  if (easing.type.tag === 'linear') {
    return from + (to - from) * current;
  } else if (easing.type.tag === 'easeInQuad') {
    return from + (to - from) * current ** 2;
  } else if (easing.type.tag == 'easeOutQuad') {
    return from + (to - from) * (1 - (1 - current) ** 2);
  } else if (easing.type.tag == 'easeInOutQuad') {
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
  now: Time,
): number => {
  return easing(value.from, value.to, value.easing, now);
};

export const animatePoint = (
  value: EasingValue<{ x: number; y: number }>,
  now: Time,
): { x: number; y: number } => {
  return {
    x: easing(value.from.x, value.to.x, value.easing, now),
    y: easing(value.from.y, value.to.y, value.easing, now),
  };
};
