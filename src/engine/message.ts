export type Message<R, M> =
  | GameInitializedMessage
  | WindowResizedMessage
  | ResourceLoadedMessage<R>
  | KeyEventMessage
  | CustomMessage<M>;

export type GameInitializedMessage = {
  tag: 'GameInitialized';
};

export type WindowResizedMessage = {
  tag: 'WindowResized';
  width: number;
  height: number;
};

export type ResourceLoadedMessage<R> = {
  tag: 'ResourceLoaded';
  resource: R;
};

export type KeyEventMessage = {
  tag: 'KeyEvent';
  event: KeyboardEvent;
};

export type CustomMessage<M> = {
  tag: 'Custom';
  value: M;
};

export const customEventName = 'customMessage';

export const dispatchCustomMessage = <M>(value: M) => {
  const event = new CustomEvent(customEventName, { detail: value });
  window.dispatchEvent(event);
};
