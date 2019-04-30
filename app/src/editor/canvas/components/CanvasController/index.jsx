import React, { useContext } from 'react'
import * as RouterContext from '$editor/shared/components/RouterContext'
import LoadingIndicator from '$userpages/components/LoadingIndicator'

import * as CanvasLoadingContext from './LoadingContext'
import CanvasCreator from './Create'

import styles from './CanvasController.pcss'

function CanvasLoadingIndicator() {
    const [pending] = useContext(CanvasLoadingContext.Context)
    return (
        <LoadingIndicator className={styles.LoadingIndicator} loading={pending} />
    )
}

export default ({ children }) => (
    <RouterContext.Provider>
        <CanvasLoadingContext.Provider>
            <CanvasLoadingIndicator />
            <CanvasCreator />
            {children || null}
        </CanvasLoadingContext.Provider>
    </RouterContext.Provider>
)
