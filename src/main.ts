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

/*const theme: Theme = {
  foreground: '#abb2bf',
  background: '#282c34',
  primary: '#61afef',
};*/
start();
