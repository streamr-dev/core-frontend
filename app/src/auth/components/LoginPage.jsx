import React, { useCallback, useReducer, useContext, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Auth, SignInMethod, LoadingIndicator } from '@streamr/streamr-layout'

import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'
import Button from '$shared/components/Button'
import { getUserData } from '$shared/modules/user/actions'
import useIsMounted from '$shared/hooks/useIsMounted'

import useMetamask from '../hooks/useMetamask'
import useWalletConnect from '../hooks/useWalletConnect'
import SessionContext from '../contexts/Session'

import SessionProvider from './SessionProvider'
import AuthLayout from './AuthLayout'

const METAMASK = 'metamask'
const WALLET_CONNECT = 'walletConnect'

const handlers = {
    start: (state, { method }) => ({
        ...state,
        method,
        connecting: true,
        error: undefined,
    }),

    success: (state) => ({
        ...state,
        connecting: false,
    }),

    error: (state, { error }) => ({
        ...state,
        connecting: false,
        error,
    }),
}

const methods = [{
    id: METAMASK,
    title: 'MetaMask',
    icon: (<SignInMethod.Icon.Metamask />),
    enabled: true,
}, {
    id: WALLET_CONNECT,
    title: 'WalletConnect',
    icon: (<SignInMethod.Icon.WalletConnect />),
    enabled: true,
}]

const LoginPage = () => {
    const dispatch = useDispatch()
    const [{ method, connecting, error }, setState] = useReducer((state, action) => (
        (typeof handlers[action.type] === 'function') ? handlers[action.type](state, action) : state
    ), {
        method: undefined,
        connecting: false,
        error: undefined,
    })
    const isMounted = useIsMounted()

    const connectMethods = {
        [METAMASK]: useMetamask(),
        [WALLET_CONNECT]: useWalletConnect(),
    }

    const { setSessionToken } = useContext(SessionContext)
    const cancelPromiseRef = useRef(undefined)

    const cancel = useCallback(() => {
        if (cancelPromiseRef.current) {
            cancelPromiseRef.current.reject(new Error('User cancelled action'))
        }
    }, [])

    const connect = useCallback(async (nextMethod) => {
        setState({
            type: 'start',
            method: nextMethod,
        })

        try {
            const cancelPromise = new Promise((resolve, reject) => {
                cancelPromiseRef.current = {
                    resolve,
                    reject,
                }
            })

            const fallbackGetter = async () => {
                throw new Error('Unknow method')
            }

            const token = await Promise.race([
                (connectMethods[nextMethod] || fallbackGetter)(),
                cancelPromise,
            ])

            if (!isMounted()) { return }

            cancelPromiseRef.current = undefined

            if (token) {
                setSessionToken({
                    token,
                    method: nextMethod,
                })

                // This will redirect the user from the login page if succesful
                const user = await dispatch(getUserData())

                if (!user && isMounted()) {
                    throw new Error('No user data')
                }
            } else {
                throw new Error('No token')
            }
        } catch (e) {
            console.warn(e)

            if (!isMounted()) { return }

            setState({
                type: 'error',
                error: e && e.message,
            })
        }
    }, [
        connectMethods,
        setSessionToken,
        dispatch,
        isMounted,
    ])

    const allDisabled = !!(connecting)

    return (
        <AuthLayout>
            <Auth>
                <Auth.Panel>
                    <LoadingIndicator loading={connecting} />
                    <Auth.PanelRow>
                        <Auth.Header>Connect a wallet</Auth.Header>
                    </Auth.PanelRow>
                    {methods.map(({ id, title, icon, enabled }) => (
                        <Auth.PanelRow key={id}>
                            <SignInMethod
                                disabled={allDisabled || !enabled}
                                onClick={() => connect(id)}
                                data-active-method={method === id && !!connecting}
                                theme={!!error && !connecting && method === id && SignInMethod.themes.Error}
                            >
                                <SignInMethod.Title>
                                    {method === id && !!connecting && 'Connecting...'}
                                    {!!error && method === id && !connecting && `Couldn't connect to ${title}`}
                                    {(method !== id || (!connecting && !error)) && title}
                                </SignInMethod.Title>
                                <SignInMethod.Icon>
                                    {icon}
                                </SignInMethod.Icon>
                            </SignInMethod>
                        </Auth.PanelRow>
                    ))}
                    <Auth.PanelRow>
                        <Auth.Footer>
                            {!error && !connecting && (
                                <span>
                                    Need an Ethereum wallet?
                                    {' '}
                                    <a href="https://ethereum.org/en/wallets/" target="_blank" rel="nofollow noopener noreferrer">
                                        Learn more here
                                    </a>
                                </span>
                            )}
                            {!!connecting && (
                                <Button
                                    kind="link"
                                    size="mini"
                                    onClick={() => cancel()}
                                >
                                    Cancel
                                </Button>
                            )}
                            {!!error && !connecting && (
                                <Button
                                    kind="secondary"
                                    size="mini"
                                    onClick={() => connect(method)}
                                    disabled={allDisabled}
                                    waiting={connecting}
                                >
                                    Try again
                                </Button>
                            )}
                        </Auth.Footer>
                    </Auth.PanelRow>
                </Auth.Panel>
            </Auth>
        </AuthLayout>
    )
}

export { LoginPage }

export default userIsNotAuthenticated((props) => (
    <SessionProvider>
        <LoginPage {...props} />
    </SessionProvider>
))
