import React, { useContext } from 'react'
import * as RouterContext from '$editor/shared/components/RouterContext'
import LoadingIndicator from '$userpages/components/LoadingIndicator'

import * as CanvasLoadingContext from './LoadingContext'
import * as CanvasContext from './CanvasContext'
import CanvasCreator from './Create'
import CanvasLoader from './Load'

import styles from './CanvasController.pcss'

export { Context } from './CanvasContext'

function CanvasLoadingIndicator() {
    const [pending] = useContext(CanvasLoadingContext.Context)
    return (
        <LoadingIndicator className={styles.LoadingIndicator} loading={pending} />
    )
}

const CanvasControllerProvider = ({ children }) => (
    <RouterContext.Provider>
        <CanvasLoadingContext.Provider>
            <CanvasContext.Provider>
                <CanvasLoadingIndicator />
                <CanvasCreator />
                <CanvasLoader />
                {children || null}
            </CanvasContext.Provider>
        </CanvasLoadingContext.Provider>
    </RouterContext.Provider>
)

export { CanvasControllerProvider as Provider }
