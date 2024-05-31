import './style.css';
import 'ress/ress.css';
import { type Theme } from './theme';

type GameState = {
  phase: 'title' | 'playing';
};

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas" width="${window.innerWidth}" height="${window.innerHeight}">
      canvas not supported
    </canvas>
  </div>
`;

const theme: Theme = {
  foreground: '#abb2bf',
  background: '#282c34',
};

let gameState: GameState = {
  phase: 'title',
};

const getRenderer = (
  ctx: CanvasRenderingContext2D,
  theme: Theme,
  gameState: GameState,
) => {
  const initialTime = Date.now();
  let tick = 0;

  const render = () => {
    const deltaTime = Date.now() - initialTime;
    tick += 1;

    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme.foreground;

    if (gameState.phase === 'title') {
      ctx.beginPath();
      ctx.arc(100, 100, 50, 0, 2 * Math.PI);
      ctx.fill();
      ctx.font = '48px IBMPlexSans, IBMPlexSansJP';
      ctx.fillText('タイピングゲーム Typing', 200, 200);
    }
  };
  return render;
};

window.addEventListener('resize', () => {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('2d')!;
const render = getRenderer(ctx, theme, gameState);

let f1 = new FontFace('IBMPlexSans', 'url(/IBMPlexSans-Regular.woff2)');
let f2 = new FontFace('IBMPlexSansJP', 'url(/IBMPlexSansJP-Regular.woff2)');
Promise.all([f1.load(), f2.load()]).then(([f1, f2]) => {
  document.fonts.add(f1);
  document.fonts.add(f2);
  setInterval(() => {
    render();
  }, 1000 / 15); // TODO: 1000 / 60 ?
});
