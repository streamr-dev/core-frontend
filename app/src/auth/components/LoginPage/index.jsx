import React, { useMemo, useCallback, useReducer, useContext } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'
import UnstyledLoadingIndicator from '$shared/components/LoadingIndicator'
import Button from '$shared/components/Button'
import { validateWeb3, getWeb3 } from '$shared/web3/web3Provider'
import getSessionToken from '$auth/utils/getSessionToken'
import { getUserData } from '$shared/modules/user/actions'

import SessionProvider from '../SessionProvider'
import AuthLayout from '../AuthLayout'
import SessionContext from '../../contexts/Session'

import metamaskLogo from '../../assets/Metamask.png'
import metamaskLogo2x from '../../assets/Metamask@2x.png'
import walletConnectLogo from '../../assets/WalletConnect.png'
import walletConnectLogo2x from '../../assets/WalletConnect@2x.png'

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
    font-size: 1.125rem;
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

const NormalTheme = {
    color: '#525252',
    background: 'transparent',
    hoverBackground: '#F8F8F8',
    fontSize: 16,
}

const ErrorTheme = {
    color: '#D90C25',
    background: '#FDF3F4',
    hoverBackground: '#FDF3F4',
    fontSize: 14,
}

const SigninMethodTitle = styled.div``

const SigninMethodIcon = styled.div``

const SigninMethodButton = styled.button`
    margin: 16px 12px;
    padding: 0 16px;
    height: 56px;
    border-radius: 4px;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    appearance: none;
    border: 0;
    outline: none;
    text-align: left;
    transition: opacity 0.3s ease;

    background-color: ${({ theme }) => theme.background};

    :not(:disabled):hover {
        background-color: ${({ theme }) => theme.hoverBackground};
    }

    :disabled {
        cursor: not-allowed;
    }

    :not([data-active-method=true]):disabled {
        opacity: 0.5;
    }

    :focus {
        outline: none;
    }

    ${SigninMethodTitle} {
        flex-grow: 1;
        color: ${({ theme }) => theme.color};
        font-size: ${({ theme }) => theme.fontSize}px;
    }

    ${SigninMethodTitle} + ${SigninMethodIcon} {
        margin-left: 16px;
    }
`

const SigninMethod = ({ theme, ...props }) => (
    <SigninMethodButton
        type="button"
        theme={theme || NormalTheme}
        {...props}
    />
)

Object.assign(SigninMethod, {
    Title: SigninMethodTitle,
    Icon: SigninMethodIcon,
})

const Footer = styled.div`
    font-size: 0.875rem;
    flex-grow: 1;
    margin: auto 16px;
    text-align: center;

    button {
        float: right;
    }
`

const METAMASK = 'metamask'
const WALLET_CONNECT = 'walletConnect'

const useMetamask = () => {
    const connect = useCallback(async () => {
        const web3 = getWeb3()

        await validateWeb3({
            web3,
            checkNetwork: false,
        })

        const token = await getSessionToken({
            provider: web3.metamaskProvider,
        })

        return token
    }, [])

    return useMemo(() => ({
        connect,
    }), [
        connect,
    ])
}

const useWalletConnect = () => {
    const connect = useCallback(async () => {
        await new Promise((resolve) => {
            setTimeout(resolve, 3000)
        })

        return 'token'
    }, [])

    return useMemo(() => ({
        connect,
    }), [
        connect,
    ])
}

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

    const { connect: getMetamaskToken } = useMetamask()
    const { connect: getWalletConnectToken } = useWalletConnect()
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

            setState({
                type: 'success',
                token,
            })

            setSessionToken(token)
            dispatch(getUserData())
        } catch (e) {
            console.warn(e)

            setState({
                type: 'error',
                error: e.message,
            })
        }
    }, [getMetamaskToken, getWalletConnectToken, setSessionToken, dispatch])

    const allDisabled = !!(connecting)

    return (
        <AuthLayout>
            <AuthPanel>
                <Panel>
                    <LoadingIndicator loading={connecting} />
                    <PanelRow>
                        <Header>Connect a wallet</Header>
                    </PanelRow>
                    <PanelRow>
                        <SigninMethod
                            disabled={allDisabled}
                            onClick={() => connect(METAMASK)}
                            data-active-method={method === METAMASK && !!connecting}
                            theme={!!error && !connecting && method === METAMASK && ErrorTheme}
                        >
                            <SigninMethod.Title>
                                {method === METAMASK && !!connecting && 'Connecting...'}
                                {!!error && method === METAMASK && !connecting && 'Couldn\'t connect with MetaMask'}
                                {(method !== METAMASK || (!connecting && !error)) && 'MetaMask'}
                            </SigninMethod.Title>
                            <SigninMethod.Icon>
                                <img
                                    src={metamaskLogo}
                                    srcSet={`${metamaskLogo2x} 2x`}
                                    alt="MetaMask"
                                />
                            </SigninMethod.Icon>
                        </SigninMethod>
                    </PanelRow>
                    <PanelRow>
                        <SigninMethod
                            disabled={allDisabled}
                            onClick={() => connect(WALLET_CONNECT)}
                            data-active-method={method === WALLET_CONNECT && !!connecting}
                            theme={!!error && !connecting && method === WALLET_CONNECT && ErrorTheme}
                        >
                            <SigninMethod.Title>
                                {method === WALLET_CONNECT && !!connecting && 'Connecting...'}
                                {!!error && method === WALLET_CONNECT && !connecting && 'Couldn\'t connect with WalletConnect'}
                                {(method !== WALLET_CONNECT || (!connecting && !error)) && 'WalletConnect'}
                            </SigninMethod.Title>
                            <SigninMethod.Icon>
                                <img
                                    src={walletConnectLogo}
                                    srcSet={`${walletConnectLogo2x} 2x`}
                                    alt="WalletConnect"
                                />
                            </SigninMethod.Icon>
                        </SigninMethod>
                    </PanelRow>
                    <PanelRow>
                        <Footer>
                            {!error && !connecting && (
                                <span>Need an Ethereum wallet ? Learn more here</span>
                            )}
                            {!!connecting && (
                                <Button
                                    kind="link"
                                    size="mini"
                                    onClick={() => {}}
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
