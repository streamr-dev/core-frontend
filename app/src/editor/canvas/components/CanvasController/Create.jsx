import { useEffect, useContext, useCallback } from 'react'
import * as RouterContext from '$editor/shared/components/RouterContext'
import useIsMountedRef from '$shared/utils/useIsMountedRef'

import links from '../../../../links'
import * as services from '../../services'
import * as CanvasLoadingContext from './LoadingContext'

export default function CanvasCreator() {
    const { match, history } = useContext(RouterContext.Context)
    const [pending, { start, end }] = useContext(CanvasLoadingContext.Context)
    const isMountedRef = useIsMountedRef()

    const create = useCallback(async () => { // eslint-disable-line semi-style
        if (pending) { return }
        try {
            start()
            const newCanvas = await services.create()
            if (isMountedRef.current) {
                history.replace(`${links.editor.canvasEditor}/${newCanvas.id}`)
            }
        } finally {
            end()
        }
    }, [pending, start, end, history, isMountedRef])

    const { id } = match.params

    useEffect(() => {
        if (id) { return }
        create()
    }, [id, create])
    return null
}
