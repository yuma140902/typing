import { type Branded } from '../util';

/**
 * 1970/01/01深夜0時からの経過時間 (ミリ秒)
 */
export type Time = Branded<number, 'TimeMs'>;

/**
 * 時間の長さ (ミリ秒)
 */
export type Duration = Branded<number, 'DurationMs'>;

/**
 * 現在時刻を取得する
 */
export const now = (): Time => Date.now() as Time;

/**
 * 経過時間を計算する
 */
export const duration = (current: Time, previous: Time): Duration =>
  (current - previous) as Duration;

/**
 * 現在時刻から一定時間後の時刻を計算する
 */
export const after = (current: Time, duration: Duration): Time =>
  (current + duration) as Time;

export const ms = (ms: number): Duration => ms as Duration;
