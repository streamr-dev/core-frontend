import { useEffect, useContext, useCallback } from 'react'
import * as RouterContext from '$editor/shared/components/RouterContext'
import useIsMountedRef from '$shared/utils/useIsMountedRef'

import * as CanvasState from '../../state'
import * as services from '../../services'

import * as CanvasLoadingContext from './LoadingContext'
import * as CanvasContext from './CanvasContext'

export default function CanvasLoader() {
    const { match } = useContext(RouterContext.Context)
    const { canvas, api: canvasApi } = useContext(CanvasContext.Context)
    const [pending, { start, end }] = useContext(CanvasLoadingContext.Context)
    const isMountedRef = useIsMountedRef()
    const { id: urlId } = match.params
    const currentCanvasRootId = canvas && CanvasState.getRootCanvasId(canvas)
    const canvasId = currentCanvasRootId || urlId

    const load = useCallback(async (canvasId) => { // eslint-disable-line semi-style
        if (pending) { return }
        try {
            start()
            const canvas = await services.loadRelevantCanvas({ id: canvasId })
            if (isMountedRef.current) {
                canvasApi.replaceCanvas(() => canvas)
            }
        } finally {
            end()
        }
    }, [pending, start, end, isMountedRef, canvasApi])

    useEffect(() => {
        if (!urlId) { return } // do nothing if no url id
        if (canvasId && currentCanvasRootId !== canvasId && !pending) {
            // load canvas if needed and not already loading
            load(canvasId)
        }
    }, [urlId, canvasId, currentCanvasRootId, load, canvas, pending])
    return null
}
