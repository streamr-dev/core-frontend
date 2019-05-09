import { useContext } from 'react'

import UndoContainer from '$editor/shared/components/UndoContainer'

export default function useCanvas() {
    const { state } = useContext(UndoContainer.Context)
    return state
}
