import { useContext, useCallback } from 'react'
import * as RouterContext from '$editor/shared/components/RouterContext'
import useIsMountedRef from '$shared/utils/useIsMountedRef'

import links from '../../../../links'
import * as services from '../../services'
import usePending from './usePending'

export default function useCanvasRemove() {
    const { history } = useContext(RouterContext.Context)
    const { isPending, wrap } = usePending('REMOVE')
    const isMountedRef = useIsMountedRef()

    return useCallback(async ({ id }) => {
        if (isPending) { return }
        return wrap(async () => {
            await services.deleteCanvas({ id })
            if (!isMountedRef.current) { return }
            history.push(links.userpages.canvases)
        })
    }, [wrap, isPending, history, isMountedRef])
}
