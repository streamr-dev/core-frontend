import { useCallback, useState } from 'react'

export type StateContainerProps<T> = {
    state: T | null
    updateState: (state: Partial<T>) => void
    replaceState: (state: T) => void
}

export const useStateContainer = <T>(defaultValue?: T): StateContainerProps<T> => {
    const [internalState, setInternalState] = useState<T>(defaultValue || {} as T)
    const updateState = useCallback((value: Partial<T>) => {
        setInternalState({...internalState, ...value})
    }, [internalState, setInternalState])
    return {
        state: internalState,
        updateState,
        replaceState: setInternalState
    }
}
