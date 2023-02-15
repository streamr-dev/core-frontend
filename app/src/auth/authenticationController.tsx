import React, {createContext, FunctionComponent, ReactNode, useCallback, useEffect, useState} from "react"
import useIsMounted from "$shared/hooks/useIsMounted"
import Web3Poller, {events} from "$shared/web3/Web3Poller"
import {Authentication} from "./authModel"
import {
    getAuthenticationFromStorage,
    removeAuthenticationFromStorage,
    setAuthenticationInStorage
} from "./authenticationStorage"

export interface AuthenticationController {
    currentAuthSession: Authentication,
    updateAuthSession: (session: Authentication) => void,
    removeAuthSession: () => void
}

const useSessionController = (): AuthenticationController => {
    const storedAuth = getAuthenticationFromStorage()
    const initialState: Authentication = { method: storedAuth ? storedAuth.method : undefined, address: storedAuth ? storedAuth.address : undefined }
    const isMounted = useIsMounted()
    const [auth, setAuth] = useState<Authentication>(initialState)

    const updateSession = useCallback<(session: Authentication) => void>((session) => {
        if (isMounted()) {
            setAuth(session)
            setAuthenticationInStorage(session)
        }
    }, [setAuth, isMounted])

    const removeSession = useCallback<() => void>(() => {
        if (isMounted()) {
            setAuth({method: undefined, address: undefined})
            removeAuthenticationFromStorage()
        }
    }, [setAuth, isMounted])

    const pollSuccessCallback = useCallback<(address: string) => void>((address) => {
        if (auth?.address) {
            updateSession({method: 'metamask', address})
        }
    }, [updateSession, auth])

    const pollErrorCallback = useCallback(() => {
        if (auth?.address) {
            removeSession()
        }
    }, [removeSession, auth])

    useEffect(() => {
        Web3Poller.subscribe(events.ACCOUNT, pollSuccessCallback)
        Web3Poller.subscribe(events.ACCOUNT_ERROR, pollErrorCallback)
        return () => {
            Web3Poller.unsubscribe(events.ACCOUNT, pollSuccessCallback)
            Web3Poller.unsubscribe(events.ACCOUNT_ERROR, pollErrorCallback)
        }
    }, [])

    return {
        currentAuthSession: auth,
        updateAuthSession: updateSession,
        removeAuthSession: removeSession
    }
}

export const AuthenticationControllerContext = createContext<AuthenticationController>(null)

export const AuthenticationControllerContextProvider: FunctionComponent<{ children: ReactNode | ReactNode[]}> = ({children}) => {
    return <AuthenticationControllerContext.Provider value={useSessionController()}>
        {children}
    </AuthenticationControllerContext.Provider>
}
