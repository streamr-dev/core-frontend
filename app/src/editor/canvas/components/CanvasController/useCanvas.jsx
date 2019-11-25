import { useContext } from 'react'

import { Context as UndoContext } from '$shared/contexts/Undo'

export default function useCanvas() {
    const { state } = useContext(UndoContext)
    return state
}
