import './style.css';
import 'ress/ress.css';
import { start } from './game';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas" width="${window.innerWidth}" height="${window.innerHeight}">
      canvas not supported
    </canvas>
  </div>
`;

start();
