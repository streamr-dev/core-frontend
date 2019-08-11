import React, { useContext, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import LoadingIndicator from '$userpages/components/LoadingIndicator'

import * as RouterContext from '$shared/components/RouterContextProvider'
import { Provider as PendingProvider } from '$shared/components/PendingContextProvider'
import { usePending, useAnyPending } from '$shared/hooks/usePending'
import { Provider as PermissionsProvider } from '$editor/canvas/hooks/useCanvasPermissions'

import * as CanvasState from '../../state'

import useCanvas from './useCanvas'
import useCanvasLoadCallback from './useCanvasLoadCallback'
import useCanvasCreateCallback from './useCanvasCreateCallback'
import useCanvasRemoveCallback from './useCanvasRemoveCallback'
import useCanvasDuplicateCallback from './useCanvasDuplicateCallback'
import useModuleLoadCallback from './useModuleLoadCallback'

import styles from './CanvasController.pcss'

const CanvasControllerContext = React.createContext()

function useCanvasLoadEffect() {
    const canvas = useCanvas()
    const load = useCanvasLoadCallback()
    const { match } = useContext(RouterContext.Context)
    const { isPending } = usePending('canvas.LOAD')

    const { id: urlId } = match.params
    const currentCanvasRootId = canvas && CanvasState.getRootCanvasId(canvas)
    const canvasId = currentCanvasRootId || urlId

    useEffect(() => {
        if (!urlId) { return } // do nothing if no url id
        if (canvasId && currentCanvasRootId !== canvasId && !isPending) {
            // load canvas if needed and not already loading
            load(canvasId)
        }
    }, [urlId, canvasId, currentCanvasRootId, load, canvas, isPending])
}

function useCanvasCreateEffect() {
    const { match } = useContext(RouterContext.Context)
    const { isPending } = usePending('canvas.CREATE')

    const create = useCanvasCreateCallback()
    const { id } = match.params

    useEffect(() => {
        if (id || isPending) { return }
        create({ replace: true })
    }, [id, create, isPending])
}

function CanvasEffects() {
    useCanvasCreateEffect()
    useCanvasLoadEffect()

    const { isPending: isPendingCreate } = usePending('canvas.CREATE')
    const { isPending: isPendingLoad } = usePending('canvas.LOAD')
    const { isPending: isPendingRemove } = usePending('canvas.REMOVE')
    return (
        <React.Fragment>
            {!!isPendingCreate && <Helmet title="Creating New Canvas..." />}
            {!!isPendingLoad && <Helmet title="Loading Canvas..." />}
            {!!isPendingRemove && <Helmet title="Removing Canvas..." />}
        </React.Fragment>
    )
}

function CanvasLoadingIndicator() {
    const isPending = useAnyPending()
    return (
        <LoadingIndicator className={styles.LoadingIndicator} loading={isPending} />
    )
}

export function useController() {
    return useContext(CanvasControllerContext)
}

function useCanvasController() {
    const create = useCanvasCreateCallback()
    const load = useCanvasLoadCallback()
    const remove = useCanvasRemoveCallback()
    const duplicate = useCanvasDuplicateCallback()
    const loadModule = useModuleLoadCallback()
    return useMemo(() => ({
        load,
        create,
        remove,
        duplicate,
        loadModule,
    }), [load, create, remove, duplicate, loadModule])
}

function ControllerProvider({ children }) {
    return (
        <CanvasControllerContext.Provider value={useCanvasController()}>
            {children}
        </CanvasControllerContext.Provider>
    )
}

const CanvasControllerProvider = ({ children }) => (
    <RouterContext.Provider>
        <PendingProvider>
            <PermissionsProvider>
                <ControllerProvider>
                    <CanvasLoadingIndicator />
                    <CanvasEffects />
                    {children || null}
                </ControllerProvider>
            </PermissionsProvider>
        </PendingProvider>
    </RouterContext.Provider>
)

export { CanvasControllerProvider as Provider }
