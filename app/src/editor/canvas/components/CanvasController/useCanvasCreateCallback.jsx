import { useContext, useCallback } from 'react'

import useIsMountedRef from '$shared/utils/useIsMountedRef'
import { RouterContext } from '$shared/components/RouterContextProvider'
import usePending from '$editor/shared/hooks/usePending'

import links from '../../../../links'
import * as services from '../../services'

export default function useCanvasCreateCallback() {
    const { history } = useContext(RouterContext)
    const { isPending, wrap } = usePending('CREATE')
    const isMountedRef = useIsMountedRef()

    return useCallback(async ({ replace = true } = {}) => {
        if (isPending) { return }
        return wrap(async () => {
            const newCanvas = await services.create()
            if (!isMountedRef.current) { return }
            const dest = `${links.editor.canvasEditor}/${newCanvas.id}`
            if (replace) {
                history.replace(dest)
            } else {
                history.push(dest)
            }
        })
    }, [wrap, isPending, history, isMountedRef])
}
