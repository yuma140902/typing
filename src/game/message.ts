import { MessageHandler } from '../engine';
import { debugNextTheme } from '../theme';
import { time } from '../util';
import { GameObject } from './objects';
import { GameResources, onResourceLoaded } from './resources';
import { enterLoadingScreen } from './screen/loading';
import { enterPlayingScreen, getRandomText, onType } from './screen/playing';
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
      document.body.style.backgroundColor = state.theme.background;
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
      console.log('resized', message.width, message.height);
      return {
        ...state,
        width: message.width,
        height: message.height,
      };
    } else if (message.tag === 'KeyEvent' && !message.event.altKey) {
      if (state.phase.tag === 'title') {
        if (message.event.key === ' ') {
          const phase: PlayingPhase = {
            tag: 'playing',
            correctText: getRandomText(),
            typingText: '',
            wrongText: '',
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
        if (message.event.key === 'Enter') {
          const phase: PlayingPhase = {
            tag: 'playing',
            correctText: getRandomText(),
            typingText: '',
            wrongText: '',
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
        } else {
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
      }
    } else if (message.tag === 'Custom') {
    }

    if (message.tag === 'KeyEvent' && message.event.altKey) {
      if (message.event.key.toLowerCase() === 't') {
        const { theme, themeId } = debugNextTheme(state.debugThemeId);
        document.body.style.backgroundColor = state.theme.background;
        return {
          ...state,
          theme,
          debugThemeId: themeId,
        };
      }
    }
  };

  return messageHandler;
};
