import React, { useCallback, useReducer, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'
import UnstyledLoadingIndicator from '$shared/components/LoadingIndicator'
import Button from '$shared/components/Button'
import { getUserData } from '$shared/modules/user/actions'
import useIsMounted from '$shared/hooks/useIsMounted'
import docsLinks from '$shared/../docsLinks'

import SessionProvider from '../SessionProvider'
import AuthLayout from '../AuthLayout'
import SignInMethod from '../SignInMethod'
import SessionContext from '../../contexts/Session'
import metamaskLogo from '../../assets/Metamask.png'
import metamaskLogo2x from '../../assets/Metamask@2x.png'
import walletConnectLogo from '../../assets/WalletConnect.png'
import walletConnectLogo2x from '../../assets/WalletConnect@2x.png'

import useMetamask from './useMetamask'
import useWalletConnect from './useWalletConnect'

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

    const { connect: getMetamaskToken, enabled: isMetamaskEnabled } = useMetamask()
    const { connect: getWalletConnectToken, enabled: isWalletConnectEnabled } = useWalletConnect()
    const { setSessionToken } = useContext(SessionContext)

    const connect = useCallback(async (nextMethod) => {
        setState({
            type: 'start',
            method: nextMethod,
        })

        try {
            let token

            if (nextMethod === METAMASK) {
                token = await getMetamaskToken()
            } else if (nextMethod === WALLET_CONNECT) {
                token = await getWalletConnectToken()
            } else {
                throw new Error('Unknow method')
            }

            if (!isMounted()) { return }

            if (token) {
                // This will redirect the user from the login page
                setSessionToken(token)
                dispatch(getUserData())
            } else {
                throw new Error('No token')
            }
        } catch (e) {
            console.warn(e)

            if (!isMounted()) { return }

            setState({
                type: 'error',
                error: e.message,
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
                    <PanelRow>
                        <SignInMethod
                            disabled={allDisabled || !isMetamaskEnabled}
                            onClick={() => connect(METAMASK)}
                            data-active-method={method === METAMASK && !!connecting}
                            theme={!!error && !connecting && method === METAMASK && SignInMethod.themes.Error}
                        >
                            <SignInMethod.Title>
                                {method === METAMASK && !!connecting && I18n.t('auth.connecting')}
                                {!!error && method === METAMASK && !connecting && I18n.t('auth.couldNotConnect', {
                                    method: 'MetaMask',
                                })}
                                {(method !== METAMASK || (!connecting && !error)) && 'MetaMask'}
                            </SignInMethod.Title>
                            <SignInMethod.Icon>
                                <img
                                    src={metamaskLogo}
                                    srcSet={`${metamaskLogo2x} 2x`}
                                    alt="MetaMask"
                                />
                            </SignInMethod.Icon>
                        </SignInMethod>
                    </PanelRow>
                    <PanelRow>
                        <SignInMethod
                            disabled={allDisabled || !isWalletConnectEnabled}
                            onClick={() => connect(WALLET_CONNECT)}
                            data-active-method={method === WALLET_CONNECT && !!connecting}
                            theme={!!error && !connecting && method === WALLET_CONNECT && SignInMethod.themes.Error}
                        >
                            <SignInMethod.Title>
                                {method === WALLET_CONNECT && !!connecting && I18n.t('auth.connecting')}
                                {!!error && method === WALLET_CONNECT && !connecting && I18n.t('auth.couldNotConnect', {
                                    method: 'WalletConnect',
                                })}
                                {(method !== WALLET_CONNECT || (!connecting && !error)) && 'WalletConnect'}
                            </SignInMethod.Title>
                            <SignInMethod.Icon>
                                <img
                                    src={walletConnectLogo}
                                    srcSet={`${walletConnectLogo2x} 2x`}
                                    alt="WalletConnect"
                                />
                            </SignInMethod.Icon>
                        </SignInMethod>
                    </PanelRow>
                    <PanelRow>
                        <Footer>
                            {!error && !connecting && (
                                <Translate
                                    value="auth.help.wallet"
                                    docsLink={docsLinks.gettingStarted}
                                    dangerousHTML
                                />
                            )}
                            {/* !!connecting && (
                                <Button
                                    kind="link"
                                    size="mini"
                                    onClick={() => {}}
                                >
                                    {I18n.t('auth.cancel')}
                                </Button>
                            ) */}
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
