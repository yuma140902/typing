// https://zenn.dev/pixiv/articles/phantom_type_in_typescript
// TODO: fp-ts, newtype-tsを使う
export type Branded<T, U extends string> = T & { [key in U]: never };

export * as time from './time';
export * as fps_counter from './fps_counter';
export type * from './time';
export type * from './fps_counter';
