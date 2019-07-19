import React, { useContext, useEffect, useMemo, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import LoadingIndicator from '$userpages/components/LoadingIndicator'

import * as RouterContext from '$shared/components/RouterContextProvider'
import usePending, { useAnyPending, Provider as PendingProvider } from '$editor/shared/hooks/usePending'
import { Provider as PermissionsProvider } from '$editor/canvas/hooks/useCanvasPermissions'

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

export function useChangedModuleLoader() {
    const [changed, setChanged] = useState(new Set())
    const markChanged = useCallback((id) => {
        setChanged((changed) => {
            if (changed.has(id)) { return changed }
            return new Set([...changed, id])
        })
    }, [setChanged])

    const loadChanged = useCallback((prevChanged, canvas, updatedCanvas) => {
        prevChanged.forEach((hash) => {
            if (changed.has(hash)) {
                // item changed again, don't update this round
                return
            }
            canvas = CanvasState.updateModule(canvas, hash, () => (
                CanvasState.getModule(updatedCanvas, hash)
            ))
        })
        return canvas
    }, [changed])

    const resetChanged = useCallback(() => {
        const prev = changed
        setChanged(new Set())
        return prev
    }, [changed])

    return useMemo(() => ({
        resetChanged,
        markChanged,
        loadChanged,
    }), [resetChanged, markChanged, loadChanged])
}

export function useController() {
    const create = useCanvasCreateCallback()
    const load = useCanvasLoadCallback()
    const remove = useCanvasRemoveCallback()
    const duplicate = useCanvasDuplicateCallback()
    const loadModule = useModuleLoadCallback()
    const changedLoader = useChangedModuleLoader()
    return useMemo(() => ({
        load,
        create,
        remove,
        duplicate,
        loadModule,
        changedLoader,
    }), [load, create, remove, duplicate, loadModule, changedLoader])
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
            <PermissionsProvider>
                <CanvasLoadingIndicator />
                <CanvasEffects />
                {children || null}
            </PermissionsProvider>
        </PendingProvider>
    </RouterContext.Provider>
)

export { CanvasControllerProvider as Provider }
