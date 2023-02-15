import React, {createContext, FunctionComponent, ReactNode, useCallback, useEffect, useState} from "react"
import useIsMounted from "$shared/hooks/useIsMounted"
import Web3Poller, {events} from "$shared/web3/Web3Poller"
import {useStateContainer} from "$shared/hooks/useStateContainer"
import {getEnsDomains} from "$shared/modules/user/services"
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
        method: storedAuth ? storedAuth.method : undefined,
        address: storedAuth ? storedAuth.address : undefined,
        ensName: storedAuth ? storedAuth.ensName : undefined
    }
    const isMounted = useIsMounted()
    const {state: auth, updateState: setAuth} = useStateContainer<Authentication>(initialState)

    const updateSession = useCallback<(session: Authentication) => Promise<void>>(async (session) => {
        if (isMounted()) {
            let ensName: string
            if (session.address !== auth.address) {
                const addressesResponse = await getEnsDomains({addresses: [session.address]})
                ensName = addressesResponse.data.domains && addressesResponse.data.domains.length
                    ? addressesResponse.data.domains[0].name
                    : undefined
            }
            setAuth({...session, ensName})
            setAuthenticationInStorage(session)

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
