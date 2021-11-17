import React, { useMemo, useContext, useEffect, useState, useReducer } from 'react'

import { Provider as PendingProvider } from '$shared/contexts/Pending'
import { usePending } from '$shared/hooks/usePending'
import useIsMounted from '$shared/hooks/useIsMounted'

import useLoadStreamCallback from './useLoadStreamCallback'

const StreamrControllerContext = React.createContext({})

function LoadStreamEffect({ id, ignoreUnauthorized }) {
    const [loadedOnce, setLoadedOnce] = useState(false)
    const loadStream = useLoadStreamCallback()
    const { isPending } = usePending('stream.LOAD')
    const isMounted = useIsMounted()

    useEffect(() => {
        if (id && !loadedOnce && !isPending) {
            (async () => {
                setLoadedOnce(true)

                await loadStream({
                    id,
                    ignoreUnauthorized,
                })
            })()
        }
    }, [
        id,
        ignoreUnauthorized,
        loadedOnce,
        loadStream,
        isPending,
        isMounted,
    ])

    return null
}

export function useController() {
    return useContext(StreamrControllerContext)
}

function useStreamController() {
    const [{ stream, permissions, hasLoaded }, setStream] = useReducer((state, { stream, permissions }) => ({
        stream,
        permissions,
        hasLoaded: true,
    }), {
        hasLoaded: false,
    })
    const loadStream = useLoadStreamCallback()

    return useMemo(() => ({
        hasLoaded,
        loadStream,
        setStream,
        stream,
        permissions,
    }), [
        hasLoaded,
        loadStream,
        setStream,
        stream,
        permissions,
    ])
}

function ControllerProvider({ children }) {
    return (
        <StreamrControllerContext.Provider value={useStreamController()}>
            {children}
        </StreamrControllerContext.Provider>
    )
}

const StreamrController = ({ children, autoLoadStreamId, ignoreUnauthorized }) => (
    <PendingProvider name="stream">
        <ControllerProvider>
            {!!autoLoadStreamId && (
                <LoadStreamEffect id={autoLoadStreamId} ignoreUnauthorized={!!ignoreUnauthorized} />
            )}
            {children || null}
        </ControllerProvider>
    </PendingProvider>
)

export default StreamrController
