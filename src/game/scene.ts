import { time } from '../util';
import { EasingValue } from '../util/easing';
import { Duration, Time } from '../util/time';

export const linear = <T>(
  from: T,
  to: T,
  start: Time,
  duration: Duration,
): EasingValue<T> => {
  return {
    from,
    to,
    easing: {
      type: {
        tag: 'linear',
        sanitizer: { tag: 'clamp' },
      },
      start,
      duration,
    },
  };
};

export const fixed = <T>(value: T): EasingValue<T> => {
  return {
    from: value,
    to: value,
    easing: {
      type: {
        tag: 'fixed',
      },
      start: time.now(),
      duration: time.ms(Infinity),
    },
  };
};

export const easeIn = <T>(
  from: T,
  to: T,
  start: Time,
  duration: Duration,
): EasingValue<T> => {
  return {
    from,
    to,
    easing: {
      type: {
        tag: 'easeInQuad',
        sanitizer: { tag: 'clamp' },
      },
      start,
      duration,
    },
  };
};

export const easeOut = <T>(
  from: T,
  to: T,
  start: Time,
  duration: Duration,
): EasingValue<T> => {
  return {
    from,
    to,
    easing: {
      type: {
        tag: 'easeOutQuad',
        sanitizer: { tag: 'clamp' },
      },
      start,
      duration,
    },
  };
};

export const easeInOut = <T>(
  from: T,
  to: T,
  start: Time,
  duration: Duration,
): EasingValue<T> => {
  return {
    from,
    to,
    easing: {
      type: {
        tag: 'easeInOutQuad',
        sanitizer: { tag: 'clamp' },
      },
      start,
      duration,
    },
  };
};
