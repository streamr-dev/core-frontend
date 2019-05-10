import { useContext, useCallback } from 'react'

import useIsMountedRef from '$shared/utils/useIsMountedRef'
import * as RouterContext from '$editor/shared/components/RouterContext'
import usePending from '$editor/shared/hooks/usePending'

import links from '../../../../links'
import * as services from '../../services'

export default function useCanvasRemoveCallback() {
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
