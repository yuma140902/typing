// TODO: fp-ts, newtype-tsを使う
/**
 * newtypeパターンを実現する型。ランタイムでは`T`そのものだが、型システム上は`T`とは異なる型を生成する。
 *
 * @see [TypeScript で幽霊型っぽいものをつくる](https://zenn.dev/pixiv/articles/phantom_type_in_typescript)
 *
 * @typeParam T - inner type
 * @typeParam U - "brand" or identifier for the new type. Usually a string literal.
 *
 * @example
 * type UserId = Branded<number, 'UserId'>;
 * type GroupId = Branded<number, 'GroupId'>;
 */
export type Branded<T, U extends string> = T & { [key in U]: never };
