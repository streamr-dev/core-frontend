import React, { useCallback, useReducer, useContext, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'
import UnstyledLoadingIndicator from '$shared/components/LoadingIndicator'
import Button from '$shared/components/Button'
import { getUserData } from '$shared/modules/user/actions'
import useIsMounted from '$shared/hooks/useIsMounted'

import useMetamask from '../hooks/useMetamask'
import useWalletConnect from '../hooks/useWalletConnect'
import SessionContext from '../contexts/Session'
import metamaskLogo from '../assets/Metamask.png'
import metamaskLogo2x from '../assets/Metamask@2x.png'
import walletConnectLogo from '../assets/WalletConnect.png'
import walletConnectLogo2x from '../assets/WalletConnect@2x.png'

import SessionProvider from './SessionProvider'
import AuthLayout from './AuthLayout'
import SignInMethod from './SignInMethod'

const Panel = styled.div`
    background: #FFFFFF;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
`

const PanelRow = styled.div`
    height: 80px;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const Header = styled.span`
    font-size: 18px;
`

const LoadingIndicator = styled(UnstyledLoadingIndicator)`
    position: absolute;
    top: 81px;
`

const AuthPanel = styled.div`
    margin: 0 auto;
    max-width: 432px;
    width: 100%;

    ${Panel} {
        position: relative;
    }

    ${PanelRow} + ${PanelRow} {
        border-top: 1px solid #F2F1F1;
    }
`

const Footer = styled.div`
    font-size: 14px;
    flex-grow: 1;
    margin: auto 32px;

    button {
        float: right;
    }
`

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
    image: metamaskLogo,
    image2x: metamaskLogo2x,
    enabled: true,
}, {
    id: WALLET_CONNECT,
    title: 'WalletConnect',
    image: walletConnectLogo,
    image2x: walletConnectLogo2x,
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

    const { connect: getMetamaskToken } = useMetamask()
    const { connect: getWalletConnectToken } = useWalletConnect()
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
            let token
            const cancelPromise = new Promise((resolve, reject) => {
                cancelPromiseRef.current = {
                    resolve,
                    reject,
                }
            })

            if (nextMethod === METAMASK) {
                token = await Promise.race([
                    getMetamaskToken(),
                    cancelPromise,
                ])
            } else if (nextMethod === WALLET_CONNECT) {
                token = await Promise.race([
                    getWalletConnectToken(),
                    cancelPromise,
                ])
            } else {
                throw new Error('Unknow method')
            }

            if (!isMounted()) { return }

            cancelPromiseRef.current = undefined

            if (token) {
                setSessionToken(token)

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
        getMetamaskToken,
        getWalletConnectToken,
        setSessionToken,
        dispatch,
        isMounted,
    ])

    const allDisabled = !!(connecting)

    return (
        <AuthLayout>
            <AuthPanel>
                <Panel>
                    <LoadingIndicator loading={connecting} />
                    <PanelRow>
                        <Header>{I18n.t('auth.connectWallet')}</Header>
                    </PanelRow>
                    {methods.map(({
                        id,
                        title,
                        image,
                        image2x,
                        enabled,
                    }) => (
                        <PanelRow key={id}>
                            <SignInMethod
                                disabled={allDisabled || !enabled}
                                onClick={() => connect(id)}
                                data-active-method={method === id && !!connecting}
                                theme={!!error && !connecting && method === id && SignInMethod.themes.Error}
                            >
                                <SignInMethod.Title>
                                    {method === id && !!connecting && I18n.t('auth.connecting')}
                                    {!!error && method === id && !connecting && I18n.t('auth.couldNotConnect', {
                                        method: title,
                                    })}
                                    {(method !== id || (!connecting && !error)) && title}
                                </SignInMethod.Title>
                                <SignInMethod.Icon>
                                    <img
                                        src={image}
                                        srcSet={`${image2x} 2x`}
                                        alt={title}
                                    />
                                </SignInMethod.Icon>
                            </SignInMethod>
                        </PanelRow>
                    ))}
                    <PanelRow>
                        <Footer>
                            {!error && !connecting && (
                                <Translate
                                    value="auth.help.wallet"
                                    dangerousHTML
                                />
                            )}
                            {!!connecting && (
                                <Button
                                    kind="link"
                                    size="mini"
                                    onClick={() => cancel()}
                                >
                                    {I18n.t('auth.cancel')}
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
                                    {I18n.t('auth.tryAgain')}
                                </Button>
                            )}
                        </Footer>
                    </PanelRow>
                </Panel>
            </AuthPanel>
        </AuthLayout>
    )
}

export { LoginPage }

export default userIsNotAuthenticated((props) => (
    <SessionProvider>
        <LoginPage {...props} />
    </SessionProvider>
))
