import { useCallback, useReducer } from 'react'

export type StateContainerProps<T> = {
    state: T,
    updateState: (state: Partial<T>) => void
}

export const useStateContainer = <T>(defaultValue?: T): StateContainerProps<T> => {
    // In case uf you are wondering why there is a useReducer hook instead of useState?
    // The answer is - useState was causing consistency issues when changes were happening too fast
    const reducer = (state: T, action: {payload: Partial<T>}) => ({...state, ...action.payload})
    const [state, dispatch] = useReducer(reducer, defaultValue || {} as T)
    const updateState = useCallback((value: Partial<T>) => {
        dispatch({payload: value})
        // Disabled because: React Hook useCallback has a missing dependency: 'T'
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    return {
        state,
        updateState
    }
}
