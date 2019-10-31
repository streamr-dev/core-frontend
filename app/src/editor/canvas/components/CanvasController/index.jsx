import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'

import * as RouterContext from '$shared/components/RouterContextProvider'
import { usePending } from '$shared/hooks/usePending'

import * as CanvasState from '../../state'
import useCanvas from './useCanvas'
import useCanvasLoadCallback from './useCanvasLoadCallback'
import useCanvasCreateCallback from './useCanvasCreateCallback'
import useCanvasRemoveCallback from './useCanvasRemoveCallback'
import useCanvasDuplicateCallback from './useCanvasDuplicateCallback'
import useModuleLoadCallback from './useModuleLoadCallback'
import { EmbedModeContext } from './useEmbedMode'
import { Provider as PermissionsProvider } from './useCanvasPermissions'

const CanvasControllerContext = React.createContext()

export function useController() {
    return useContext(CanvasControllerContext)
}

function useCanvasLoadEffect() {
    const canvas = useCanvas()
    const load = useCanvasLoadCallback()
    const { error, setError } = useController()
    const { match } = useContext(RouterContext.Context)
    const { isPending } = usePending('canvas.LOAD')

    const { id: urlId } = match.params
    const currentCanvasRootId = canvas && CanvasState.getRootCanvasId(canvas)
    const canvasId = currentCanvasRootId || urlId
    const shouldLoad = !error && urlId && canvasId && currentCanvasRootId !== canvasId && !isPending

    useEffect(() => {
        // load canvas if needed and not already loading
        if (shouldLoad) {
            load(canvasId).catch(setError)
        }
    }, [shouldLoad, canvasId, load, setError])
}

function useCanvasCreateEffect() {
    const { match } = useContext(RouterContext.Context)
    const { isPending } = usePending('canvas.CREATE')

    const { error, setError } = useController()
    const create = useCanvasCreateCallback()
    const { id } = match.params
    const shouldCreate = !error && !id && !isPending
    useEffect(() => {
        if (shouldCreate) {
            create({ replace: true }).catch(setError)
        }
    }, [shouldCreate, create, setError])
}

function CanvasEffects() {
    useCanvasCreateEffect()
    useCanvasLoadEffect()

    const { isPending: isPendingCreate } = usePending('canvas.CREATE')
    const { isPending: isPendingLoad } = usePending('canvas.LOAD')
    const { isPending: isPendingRemove } = usePending('canvas.REMOVE')
    const { isPending: isPendingLoadPermissions } = usePending('canvas.PERMISSIONS')
    return (
        <React.Fragment>
            {!!isPendingCreate && <Helmet title="Creating New Canvas..." />}
            {!!(isPendingLoad || isPendingLoadPermissions) && <Helmet title="Loading Canvas..." />}
            {!!isPendingRemove && <Helmet title="Removing Canvas..." />}
        </React.Fragment>
    )
}

function useError() {
    const [error, setError] = useState()
    const { match } = useContext(RouterContext.Context)
    useEffect(() => {
        // remove error on route change
        setError(undefined)
    }, [match.path])
    if (error) {
        // propagate error to error boundary
        throw error
    }
    return [error, setError]
}

function useCanvasController() {
    const create = useCanvasCreateCallback()
    const load = useCanvasLoadCallback()
    const remove = useCanvasRemoveCallback()
    const duplicate = useCanvasDuplicateCallback()
    const loadModule = useModuleLoadCallback()
    const [error, setError] = useError()
    return useMemo(() => ({
        error,
        setError,
        load,
        create,
        remove,
        duplicate,
        loadModule,
    }), [load, create, remove, duplicate, loadModule, error, setError])
}

function ControllerProvider({ children }) {
    return (
        <CanvasControllerContext.Provider value={useCanvasController()}>
            {children}
        </CanvasControllerContext.Provider>
    )
}

const CanvasControllerProvider = ({ children, embed }) => (
    <RouterContext.Provider>
        <EmbedModeContext.Provider value={!!embed}>
            <PermissionsProvider>
                <ControllerProvider embed={embed}>
                    <CanvasEffects />
                    {children || null}
                </ControllerProvider>
            </PermissionsProvider>
        </EmbedModeContext.Provider>
    </RouterContext.Provider>
)

export { CanvasControllerProvider as Provider }
