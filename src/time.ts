import { type Branded } from './util_types';

/**
 * 1970/01/01深夜0時からの経過時間 (ミリ秒)
 */
export type TimeMs = Branded<number, 'TimeMs'>;

/**
 * 時間の長さ (ミリ秒)
 */
export type DurationMs = Branded<number, 'DurationMs'>;

/**
 * 現在時刻を取得する
 */
export const timeNow = (): TimeMs => Date.now() as TimeMs;

/**
 * 経過時間を計算する
 */
export const durationBetween = (
  current: TimeMs,
  previous: TimeMs,
): DurationMs => (current - previous) as DurationMs;

/**
 * 現在時刻から一定時間後の時刻を計算する
 */
export const timeAfter = (current: TimeMs, duration: DurationMs): TimeMs =>
  (current + duration) as TimeMs;

export const msAsDuration = (ms: number): DurationMs => ms as DurationMs;
