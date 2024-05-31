import './style.css';
import 'ress/ress.css';
import { type Theme } from './theme';
import { initialGameState } from './game_state';
import { getRenderer } from './render';
import { initEventHandlers } from './input';
import { timeNow } from './time';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas" width="${window.innerWidth}" height="${window.innerHeight}">
      canvas not supported
    </canvas>
  </div>
`;

let gameState = initialGameState();

const theme: Theme = {
  foreground: '#abb2bf',
  background: '#282c34',
  primary: '#61afef',
};
const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const renderer = getRenderer(canvas, theme, gameState);
renderer.onGameStateUpdate();

let f1 = new FontFace('IBMPlexSans', 'url(/IBMPlexSans-Regular.woff2)');
let f2 = new FontFace('IBMPlexSansJP', 'url(/IBMPlexSansJP-Regular.woff2)');
let r = new Promise((resolve) => setTimeout(() => resolve(42), 1000));
Promise.all([f1.load(), f2.load(), r]).then(([f1, f2, num]) => {
  document.fonts.add(f1);
  document.fonts.add(f2);
  console.log(num);
  initEventHandlers(gameState, renderer.onGameStateUpdate);
  gameState.phase = { tag: 'title' };
  renderer.onGameStateUpdate();
});
