import { useContext, useCallback } from 'react'

import useIsMountedRef from '$shared/utils/useIsMountedRef'
import { RouterContext } from '$shared/components/RouterContextProvider'
import usePending from '$editor/shared/hooks/usePending'

import links from '../../../../links'
import * as services from '../../services'

export default function useCanvasRemoveCallback() {
    const { history } = useContext(RouterContext)
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
