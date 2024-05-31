// 移動平均を使ってFPSを計算する

import { durationBetween, timeNow } from './time';

export type FpsCounter = {
  addSample: () => void;
  getFps: () => number;
};

export const getFpsCounter = (): FpsCounter => {
  let prevSampleTime = timeNow();
  let fpsSamples: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let fpsSamplesSum = 0;

  const addSample = () => {
    const now = timeNow();
    const deltaTimeMs = durationBetween(now, prevSampleTime);
    prevSampleTime = now;
    if (deltaTimeMs === 0) return;

    const fpsCurrent = 1000 / deltaTimeMs;
    fpsSamplesSum -= fpsSamples.shift()!;
    fpsSamples.push(fpsCurrent);
    fpsSamplesSum += fpsCurrent;
  };

  const getFps = () => {
    return fpsSamplesSum / fpsSamples.length;
  };

  return {
    addSample,
    getFps,
  };
};
