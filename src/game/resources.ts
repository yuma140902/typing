import { type ResourceLoader } from '../engine';

export type GameResources = [FontFace, FontFace];

export const resourceLoader: ResourceLoader<GameResources> = () => {
  let f1 = new FontFace('IBMPlexSans', 'url(/IBMPlexSans-Regular.woff2)');
  let f2 = new FontFace('IBMPlexSansJP', 'url(/IBMPlexSansJP-Regular.woff2)');
  return Promise.all([f1.load(), f2.load()]);
};

export const onResourceLoaded = (resource: GameResources) => {
  const [f1, f2] = resource;
  document.fonts.add(f1);
  document.fonts.add(f2);
};
