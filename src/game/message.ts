import { MessageHandler } from '../engine';
import { time } from '../util';
import { GameObject } from './objects';
import { GameResources, onResourceLoaded } from './resources';
import { enterLoadingScreen } from './screen/loading';
import { enterPlayingScreen } from './screen/playing';
import { enterTitleScreen } from './screen/title';
import { GameState } from './state';

export const getMessageHandler = (
  ctx: CanvasRenderingContext2D,
): MessageHandler<GameState, GameObject, GameResources> => {
  const messageHandler: MessageHandler<GameState, GameObject, GameResources> = (
    state,
    message,
    mutableScene,
  ) => {
    if (message.tag === 'GameInitialized') {
      enterLoadingScreen(ctx, mutableScene, time.now());
      return {
        ...state,
      };
    } else if (message.tag === 'ResourceLoaded') {
      onResourceLoaded(message.resource);
      enterTitleScreen(ctx, mutableScene, time.now());
      return {
        ...state,
        phase: { tag: 'title' },
      };
    } else if (message.tag === 'WindowResized') {
      return {
        ...state,
        width: message.width,
        height: message.height,
      };
    } else if (message.tag === 'KeyEvent') {
      if (state.phase.tag === 'title') {
        if (message.event.key === ' ') {
          enterPlayingScreen(ctx, mutableScene, time.now());
          return {
            ...state,
            phase: { tag: 'playing' },
          };
        }
      }
    }
  };

  return messageHandler;
};
