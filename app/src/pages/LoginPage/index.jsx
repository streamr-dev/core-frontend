import React, { Fragment, useReducer, useRef } from 'react'
import { useDispatch } from 'react-redux'
import styled, { createGlobalStyle } from 'styled-components'
import { Logo, Auth, SignInMethod, LoadingIndicator } from '@streamr/streamr-layout'
import { Link as PrestyledLink } from 'react-router-dom'
import Button from '$shared/components/Button'
import { TABLET, MEDIUM } from '$shared/utils/styled'
import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'
import useInterrupt from '$shared/hooks/useInterrupt'
import { getUserData } from '$shared/modules/user/actions'
import { setupSession } from '$shared/reducers/session'
import InterruptionError from '$shared/errors/InterruptionError'
import routes from '$routes'
import reducer, { Connect, Fail, initialState } from './reducer'
import Metamask from './adapters/Metamask'
import WalletConnect from './adapters/WalletConnect'

const methods = [Metamask, WalletConnect]

function UnstyledUnwrappedLoginPage({ className }) {
    const [{ method, connecting, error }, trigger] = useReducer(reducer, initialState)

    const dispatch = useDispatch()

    const itp = useInterrupt()

    const cancelPromiseRef = useRef()

    function cancel() {
        const { current: { reject } = {} } = cancelPromiseRef

        if (typeof reject === 'function') {
            reject(new Error('User cancelled action'))
        }
    }

    async function connect(newMethod) {
        const { requireUninterrupted } = itp('connect')

        trigger([Connect, newMethod])

        const cancelPromise = new Promise((resolve, reject) => {
            cancelPromiseRef.current = {
                resolve,
                reject,
            }
        })

        try {
            let token

            try {
                try {
                    token = await Promise.race([
                        newMethod.connect(),
                        cancelPromise,
                    ])
                } finally {
                    requireUninterrupted()
                }
            } catch (e) {
                if (e instanceof InterruptionError) {
                    return
                }

                throw e
            }

            cancelPromiseRef.current = undefined

            if (!token) {
                throw new Error('No token')
            }

            dispatch(setupSession([token, newMethod.id]))

            let user

            try {
                try {
                    // This will redirect the user from the login page if succesful.
                    // @FIXME: That magic is confusing. — Mariusz.
                    user = await dispatch(getUserData())
                } finally {
                    requireUninterrupted()
                }
            } catch (e) {
                if (e instanceof InterruptionError) {
                    return
                }

                throw e
            }

            if (!user) {
                throw new Error('No user data')
            }
        } catch (e) {
            console.warn(e)

            trigger([Fail, e])
        }
    }

    function label(m) {
        if (m === method && error) {
            return `Couldn't connect to ${m.label}`
        }

        if (m === method && connecting) {
            return 'Connecting…'
        }

        return m.label
    }

    return (
        <Fragment>
            <GlobalStyle />
            <div className={className}>
                <div>
                    <Link to={routes.root()}>
                        <Logo />
                    </Link>
                </div>
                <TitleBar>Streamr Core</TitleBar>
                <Panel>
                    <Auth>
                        <Auth.Panel>
                            <LoadingIndicator loading={connecting} />
                            <Auth.PanelRow>
                                <Auth.Header>Connect a wallet</Auth.Header>
                            </Auth.PanelRow>
                            {methods.map((m) => (
                                <Auth.PanelRow key={m.id}>
                                    <SignInMethod
                                        disabled={connecting}
                                        onClick={() => connect(m)}
                                        theme={error && method === m ? SignInMethod.themes.Error : undefined}
                                    >
                                        <SignInMethod.Title>
                                            {label(m)}
                                        </SignInMethod.Title>
                                        <SignInMethod.Icon>
                                            {m.icon}
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
                                            onClick={cancel}
                                            type="button"
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                    {!!error && !connecting && (
                                        <Button
                                            kind="secondary"
                                            size="mini"
                                            onClick={() => connect(method)}
                                            disabled={connecting}
                                            waiting={connecting}
                                            type="button"
                                        >
                                            Try again
                                        </Button>
                                    )}
                                </Auth.Footer>
                            </Auth.PanelRow>
                        </Auth.Panel>
                    </Auth>

                </Panel>
                <Footer>
                    <span>
                        By connecting your wallet and using Streamr <br />
                        you agree to our
                        {' '}
                        <a href={routes.tos()} target="_blank" rel="nofollow noopener noreferrer">
                            Terms of Service
                        </a>
                    </span>
                </Footer>
            </div>
        </Fragment>

    )
}

const GlobalStyle = createGlobalStyle`
    html,
    body {
        background: #F8F8F8;
        color: #323232;
    }
`

const Panel = styled.div`
    margin-top: 40px;

    @media ${TABLET} {
        margin-top: 110px;
    }
`

const Link = styled(PrestyledLink)`
    display: block;
    margin: 0 auto;
    user-select: none;
    width: 32px;
    outline: 0 !important;

    svg {
        color: #FF5C00;
        display: block;
    }
`

const TitleBar = styled.div`
    font-size: 18px;
    font-weight: ${MEDIUM};
    line-height: 48px;
    text-align: center;

    @media ${TABLET} {
        font-size: 24px;
    }
`

const Footer = styled.div`
    color: #ADADAD;
    font-size: 12px;
    margin: 60px auto 0;
    max-width: 432px;
    text-align: center;

    @media ${TABLET} {
        margin-top: 120px;

        br {
            display: none;
        }
    }
`

const UnwrappedLoginPage = styled(UnstyledUnwrappedLoginPage)`
    display: flex;
    flex-direction: column;
    flex-grow: 0.8;
    justify-content: center;
    padding: 0 1em;
    margin: 48px auto 88px;
    color: #323232;

    @media ${TABLET} {
        margin: 152px auto 192px;
    }
`

const LoginPage = userIsNotAuthenticated(UnwrappedLoginPage)

export default LoginPage
