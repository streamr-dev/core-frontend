import React, { useContext } from 'react'
import * as RouterContext from '$editor/shared/components/RouterContext'
import LoadingIndicator from '$userpages/components/LoadingIndicator'

import * as CanvasLoadingContext from './LoadingContext'
import * as CanvasContext from './CanvasContext'
import CanvasCreator from './Create'

import styles from './CanvasController.pcss'

export { Context } from './CanvasContext'

function CanvasLoadingIndicator() {
    const [pending] = useContext(CanvasLoadingContext.Context)
    return (
        <LoadingIndicator className={styles.LoadingIndicator} loading={pending} />
    )
}

export const Provider = ({ children }) => (
    <RouterContext.Provider>
        <CanvasLoadingContext.Provider>
            <CanvasContext.Provider>
                <CanvasLoadingIndicator />
                <CanvasCreator />
                {children || null}
            </CanvasContext.Provider>
        </CanvasLoadingContext.Provider>
    </RouterContext.Provider>
)
