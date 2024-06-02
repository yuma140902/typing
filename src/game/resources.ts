import { type ResourceLoader } from '../engine';
import font from '../assets/IBMPlexSans-Regular.woff2?url';
import fontJp from '../assets/IBMPlexSansJP-Regular.woff2?url';

export type GameResources = [FontFace, FontFace];

export const resourceLoader: ResourceLoader<GameResources> = () => {
  let f1 = new FontFace('IBMPlexSans', `url(${font})`);
  let f2 = new FontFace('IBMPlexSansJP', `url(${fontJp})`);
  return Promise.all([f1.load(), f2.load()]);
};

export const onResourceLoaded = (resource: GameResources) => {
  const [f1, f2] = resource;
  document.fonts.add(f1);
  document.fonts.add(f2);
};
