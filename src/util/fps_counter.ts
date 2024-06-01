// 移動平均を使ってFPSを計算する

import * as time from '../util/time';

export type FpsCounter = {
  addSample: () => void;
  getFps: () => number;
};

export const create = (): FpsCounter => {
  let prevSampleTime = time.now();
  let fpsSamples: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let fpsSamplesSum = 0;

  const addSample = () => {
    const now = time.now();
    const deltaTimeMs = time.duration(now, prevSampleTime);
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
