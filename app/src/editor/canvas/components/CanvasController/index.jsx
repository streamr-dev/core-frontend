import React, { useContext } from 'react'
import * as RouterContext from '$editor/shared/components/RouterContext'
import LoadingIndicator from '$userpages/components/LoadingIndicator'

import * as CanvasLoadingContext from './LoadingContext'
import CanvasCreator from './Create'
import CanvasLoader from './Load'

import styles from './CanvasController.pcss'

function CanvasLoadingIndicator() {
    const [pending] = useContext(CanvasLoadingContext.Context)
    return (
        <LoadingIndicator className={styles.LoadingIndicator} loading={pending} />
    )
}

const CanvasControllerProvider = ({ children }) => (
    <RouterContext.Provider>
        <CanvasLoadingContext.Provider>
            <CanvasLoadingIndicator />
            <CanvasCreator />
            <CanvasLoader />
            {children || null}
        </CanvasLoadingContext.Provider>
    </RouterContext.Provider>
)

export { CanvasControllerProvider as Provider }
