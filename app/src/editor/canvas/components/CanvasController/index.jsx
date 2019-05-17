import React, { useContext, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import LoadingIndicator from '$userpages/components/LoadingIndicator'

import * as RouterContext from '$editor/shared/components/RouterContext'
import usePending, { useAnyPending, Provider as PendingProvider } from '$editor/shared/hooks/usePending'

import * as CanvasState from '../../state'

import useCanvas from './useCanvas'
import useCanvasLoadCallback from './useCanvasLoadCallback'
import useCanvasCreateCallback from './useCanvasCreateCallback'
import useCanvasRemoveCallback from './useCanvasRemoveCallback'
import useCanvasDuplicateCallback from './useCanvasDuplicateCallback'
import useModuleLoadCallback from './useModuleLoadCallback'

import styles from './CanvasController.pcss'

function useCanvasLoadEffect() {
    const canvas = useCanvas()
    const load = useCanvasLoadCallback()
    const { match } = useContext(RouterContext.Context)
    const { isPending } = usePending('LOAD')

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

export function useController() {
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

function useCanvasCreateEffect() {
    const { match } = useContext(RouterContext.Context)
    const { isPending } = usePending('CREATE')

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

    const { isPending: isPendingCreate } = usePending('CREATE')
    const { isPending: isPendingLoad } = usePending('LOAD')
    const { isPending: isPendingRemove } = usePending('REMOVE')
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

const CanvasControllerProvider = ({ children }) => (
    <RouterContext.Provider>
        <PendingProvider>
            <CanvasLoadingIndicator />
            <CanvasEffects />
            {children || null}
        </PendingProvider>
    </RouterContext.Provider>
)

export { CanvasControllerProvider as Provider }
