import { createContext } from 'react'

export const initialAction = {
    type: '__INIT',
}

export type Action = {
    type: string
    [key: string]: any
}

export type HistoryItem = {
    action: Action
    state: Record<string, any>
}

export type UndoContextProps = {
    history: Array<HistoryItem>
    pointer: number
    undo: (...args: Array<any>) => any
    redo: (...args: Array<any>) => any
    push: (
        action: Action | string,
        fn: (...args: Array<any>) => any,
        done?: ((...args: Array<any>) => any) | null | undefined,
    ) => any
    replace: (fn: (...args: Array<any>) => any, done?: ((...args: Array<any>) => any) | null | undefined) => any
    reset: (...args: Array<any>) => any
    action: Action
    state: Record<string, any> | null | undefined
    initialState?: any
    setInitialState: (fn: (...args: Array<any>) => any, done?: ((...args: Array<any>) => any) | null | undefined) => any
}

const UndoContext = createContext<UndoContextProps>({
    action: initialAction,
    initialState: undefined,
    state: undefined,
    history: [],
    pointer: 0,
    undo: () => {},
    redo: () => {},
    push: () => {},
    replace: () => {},
    reset: () => {},
    setInitialState: () => {},
})

export default UndoContext