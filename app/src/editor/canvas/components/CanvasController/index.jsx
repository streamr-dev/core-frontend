import React, { useContext, useEffect, useMemo } from 'react'
import * as RouterContext from '$editor/shared/components/RouterContext'
import { Helmet } from 'react-helmet'
import LoadingIndicator from '$userpages/components/LoadingIndicator'

import * as CanvasState from '../../state'

import useCanvas from './useCanvas'
import useCanvasLoader from './useCanvasLoader'
import useCanvasCreate from './useCanvasCreate'
import usePending, { useAnyPending, Provider as PendingProvider } from './usePending'

import styles from './CanvasController.pcss'

function useCanvasLoadEffect() {
    const canvas = useCanvas()
    const load = useCanvasLoader()
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
    const create = useCanvasCreate()
    const load = useCanvasLoader()
    return useMemo(() => ({
        load,
        create,
    }), [load, create])
}

function useCanvasCreateEffect() {
    const { match } = useContext(RouterContext.Context)
    const { isPending } = usePending('CREATE')

    const create = useCanvasCreate()
    const { id } = match.params

    useEffect(() => {
        if (id || isPending) { return }
        create()
    }, [id, create, isPending])
}

function CanvasEffects() {
    useCanvasCreateEffect()
    useCanvasLoadEffect()

    let newTitle = null
    const { isPending: isPendingCreate } = usePending('CREATE')
    const { isPending: isPendingLoad } = usePending('LOAD')
    if (isPendingCreate) {
        // set new title if creating new canvas
        newTitle = <Helmet title="Creating New Canvas..." />
    }

    if (isPendingLoad) {
        // set new title if loading canvas
        newTitle = <Helmet title="Loading Canvas..." />
    }

    return (
        <React.Fragment>
            {newTitle}
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
