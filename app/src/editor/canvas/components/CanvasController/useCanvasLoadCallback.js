import { useContext, useCallback } from 'react'

import { Context as RouterContext } from '$shared/components/RouterContextProvider'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import usePending from '$shared/hooks/usePending'

import * as services from '../../services'
import useCanvasUpdater from './useCanvasUpdater'

export default function useCanvasLoadCallback() {
    const { history } = useContext(RouterContext)
    const canvasUpdater = useCanvasUpdater()
    const { wrap } = usePending('canvas.LOAD')
    const isMountedRef = useIsMountedRef()
    return useCallback(async (canvasId) => (
        wrap(async () => {
            let canvas
            try {
                canvas = await services.loadRelevantCanvas({ id: canvasId })
            } catch (err) {
                if (!isMountedRef.current) { return }
                if (!err.response) { throw err } // unexpected error
                history.replace('/404') // 404
                return
            }
            if (!isMountedRef.current) { return }
            canvasUpdater.replaceCanvas(() => canvas)
        })
    ), [wrap, canvasUpdater, history, isMountedRef])
}
