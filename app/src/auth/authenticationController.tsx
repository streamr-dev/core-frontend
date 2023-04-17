import React, {createContext, FunctionComponent, ReactNode, useCallback, useEffect} from "react"
import useIsMounted from "$shared/hooks/useIsMounted"
import Web3Poller, {events} from "$shared/web3/Web3Poller"
import {useStateContainer} from "$shared/hooks/useStateContainer"
import {lookupEnsName} from "$shared/modules/user/services"
import {Authentication} from "./authModel"
import {
    getAuthenticationFromStorage,
    removeAuthenticationFromStorage,
    setAuthenticationInStorage
} from "./authenticationStorage"

export interface AuthenticationController {
    currentAuthSession: Authentication,
    updateAuthSession: (session: Authentication) => Promise<void>,
    removeAuthSession: () => void
}

const useSessionController = (): AuthenticationController => {
    const storedAuth = getAuthenticationFromStorage()
    const initialState: Authentication = {
        method: storedAuth ? storedAuth.method : '',
        address: storedAuth ? storedAuth.address : '',
        ensName: storedAuth ? storedAuth.ensName : ''
    }
    const isMounted = useIsMounted()
    const {state: auth, updateState: setAuth} = useStateContainer<Authentication>(initialState)

    const updateSession = useCallback<(session: Authentication) => Promise<void>>(async (session) => {
        if (isMounted()) {
            const newSession = {...session}
            if (session.address !== auth?.address) {
                const addressesResponse = await lookupEnsName(session.address)
                newSession.ensName = addressesResponse || ''
            }
            setAuth(newSession)
            setAuthenticationInStorage(newSession)

        }
    }, [setAuth, isMounted, auth])

    const removeSession = useCallback<() => void>(() => {
        if (isMounted()) {
            setAuth({method: undefined, address: undefined, ensName: undefined})
            removeAuthenticationFromStorage()
        }
    }, [setAuth, isMounted])

    const pollSuccessCallback = useCallback<(address: string) => void>((address) => {
        if (auth?.address) {
            updateSession({method: 'metamask', address, ensName: auth.ensName})
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
    }, [pollSuccessCallback, pollErrorCallback])

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
