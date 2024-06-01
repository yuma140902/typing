import { type ResourceLoader } from '../engine';

export type GameResources = [FontFace, FontFace, unknown];

export const resourceLoader: ResourceLoader<GameResources> = () => {
  let f1 = new FontFace('IBMPlexSans', 'url(/IBMPlexSans-Regular.woff2)');
  let f2 = new FontFace('IBMPlexSansJP', 'url(/IBMPlexSansJP-Regular.woff2)');
  let r = new Promise((resolve) => setTimeout(() => resolve(42), 1000));
  return Promise.all([f1.load(), f2.load(), r]);
};
