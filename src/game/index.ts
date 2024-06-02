import { startEngine } from '../engine';
import { resourceLoader } from './resources';
import { getInitialGameState } from './state';
import { getRenderableObjects } from './render';
import { getMessageHandler } from './message';
import { themeOndark } from '../theme';

export const start = () => {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
  const ctx = canvas.getContext('2d')!;

  startEngine(
    ctx,
    resourceLoader,
    getInitialGameState(themeOndark),
    getMessageHandler(ctx),
    getRenderableObjects,
  );
};
