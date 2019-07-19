import { useContext, useCallback } from 'react'

import useIsMountedRef from '$shared/utils/useIsMountedRef'
import { RouterContext } from '$shared/components/RouterContextProvider'
import usePending from '$editor/shared/hooks/usePending'

import links from '../../../../links'
import * as services from '../../services'

export default function useCanvasDuplicateCallback() {
    const { history } = useContext(RouterContext)
    const { isPending, wrap } = usePending('DUPLICATE')
    const isMountedRef = useIsMountedRef()

    return useCallback(async (canvas) => {
        if (isPending) { return }
        return wrap(async () => {
            const newCanvas = await services.duplicateCanvas(canvas)
            if (!isMountedRef.current) { return }
            history.push(`${links.editor.canvasEditor}/${newCanvas.id}`)
        })
    }, [wrap, isPending, history, isMountedRef])
}
