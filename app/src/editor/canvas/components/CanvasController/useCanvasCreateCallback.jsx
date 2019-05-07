import { useContext, useCallback } from 'react'
import * as RouterContext from '$editor/shared/components/RouterContext'
import useIsMountedRef from '$shared/utils/useIsMountedRef'

import links from '../../../../links'
import * as services from '../../services'
import usePending from './usePending'

export default function useCanvasCreateCallback() {
    const { history } = useContext(RouterContext.Context)
    const { isPending, wrap } = usePending('CREATE')
    const isMountedRef = useIsMountedRef()

    return useCallback(async () => {
        if (isPending) { return }
        return wrap(async () => {
            const newCanvas = await services.create()
            if (!isMountedRef.current) { return }
            history.push(`${links.editor.canvasEditor}/${newCanvas.id}`)
        })
    }, [wrap, isPending, history, isMountedRef])
}
