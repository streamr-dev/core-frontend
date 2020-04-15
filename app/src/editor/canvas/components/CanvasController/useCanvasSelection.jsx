import { useEffect } from 'react'
import { useSelectionContext, SelectionProvider } from '$shared/hooks/useSelection'

import { hasModule } from '../../state'
import useCanvas from './useCanvas'

export { SelectionProvider }

// deselect module if it does not exist
function useCanvasSelectionUpdateEffect() {
    const selection = useSelectionContext()
    const canvas = useCanvas()
    useEffect(() => {
        selection.selection.forEach((moduleHash) => {
            if (!hasModule(canvas, moduleHash)) {
                selection.remove(moduleHash)
            }
        })
    }, [canvas, selection])
}

export function useCanvasSelection() {
    const context = useSelectionContext()
    useCanvasSelectionUpdateEffect()
    return context
}
