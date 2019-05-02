import { useContext, useCallback } from 'react'
import * as RouterContext from '$editor/shared/components/RouterContext'
import useIsMountedRef from '$shared/utils/useIsMountedRef'

import links from '../../../../links'
import * as services from '../../services'
import usePending from './usePending'

export default function useCanvasDuplicate() {
    const { history } = useContext(RouterContext.Context)
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
