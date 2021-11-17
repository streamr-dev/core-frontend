import { useMemo, useContext } from 'react'

import useOnlyIfMountedCallback from '$shared/hooks/useOnlyIfMountedCallback'
import { Context as UndoContext } from '$shared/contexts/Undo'

function updater(fn) {
    return (state) => {
        const nextState = fn(state)
        if (nextState === null || nextState === state) { return state }
        return {
            ...nextState,
        }
    }
}

export default function useEditableState() {
    const { state, push, replace } = useContext(UndoContext)

    const updateState = useOnlyIfMountedCallback((action, fn, done) => {
        push(action, updater(fn), done)
    }, [push, updater])

    const replaceState = useOnlyIfMountedCallback((fn, done) => {
        replace(updater(fn), done)
    }, [push, updater])

    return useMemo(() => ({
        state,
        updateState,
        replaceState,
    }), [
        state,
        updateState,
        replaceState,
    ])
}
