export type Message<R> =
  | GameInitializedMessage
  | WindowResizedMessage
  | ResourceLoadedMessage<R>
  | KeyEventMessage;

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
