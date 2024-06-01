// https://zenn.dev/pixiv/articles/phantom_type_in_typescript
export type Branded<T, U extends string> = T & { [key in U]: never };
