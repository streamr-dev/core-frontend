// src - https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
type Prev = [never, 0, 1, 2, 3, 4, ...0[]]
type Join<K, P> = K extends string | number
    ? P extends string | number
        ? `${K}${'' extends P ? '' : '.'}${P}`
        : never
    : never
export type ObjectPaths<T, D extends number = 10> = [D] extends [never]
    ? never
    : T extends object
    ? {
          [K in keyof T]-?: K extends string | number
              ? `${K}` | Join<K, ObjectPaths<T[K], Prev[D]>>
              : never
      }[keyof T]
    : ''
