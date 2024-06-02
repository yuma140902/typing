import { MessageHandler } from '../engine';
import { time } from '../util';
import { GameObject } from './objects';
import { GameResources, onResourceLoaded } from './resources';
import { enterLoadingScreen } from './screen/loading';
import { enterPlayingScreen, onType } from './screen/playing';
import { enterTitleScreen } from './screen/title';
import { GameState, PlayingPhase } from './state';

export type GameCustomMessage = never;

export const getMessageHandler = (
  ctx: CanvasRenderingContext2D,
): MessageHandler<GameState, GameObject, GameResources, GameCustomMessage> => {
  const messageHandler: MessageHandler<
    GameState,
    GameObject,
    GameResources,
    GameCustomMessage
  > = (state, message, mutableScene) => {
    if (message.tag === 'GameInitialized') {
      enterLoadingScreen(ctx, mutableScene, time.now());
      return {
        ...state,
      };
    } else if (message.tag === 'ResourceLoaded') {
      onResourceLoaded(message.resource);
      const cursorId = enterTitleScreen(ctx, mutableScene, time.now());
      return {
        ...state,
        phase: { tag: 'title', cursorId },
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
          const phase: PlayingPhase = {
            tag: 'playing',
            correctText: 'apple banana cherry',
            typingText: '',
          };
          const cursorId = enterPlayingScreen(
            ctx,
            mutableScene,
            time.now(),
            state.phase.cursorId,
            phase,
          );
          phase.cursorId = cursorId;
          return {
            ...state,
            phase,
          };
        }
      } else if (state.phase.tag === 'playing') {
        const phase = onType(
          ctx,
          mutableScene,
          time.now(),
          state.phase,
          message.event,
        );
        return {
          ...state,
          phase,
        };
      }
    } else if (message.tag === 'Custom') {
    }
  };

  return messageHandler;
};
