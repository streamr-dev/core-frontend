export type RecursiveKeyOf<TObj extends object> = {
    [TKey in keyof TObj & (string | number)]:
    TObj[TKey] extends any[] ? `${TKey}` :
        TObj[TKey] extends object
            ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
            : `${TKey}`;
}[keyof TObj & (string | number)];
