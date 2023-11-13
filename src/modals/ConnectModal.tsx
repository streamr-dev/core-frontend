import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDiscardableEffect, defer, Deferral, toaster } from 'toasterhea'
import { Link as PrestyledLink } from 'react-router-dom'
import { Logo, Auth, SignInMethod, LoadingIndicator } from '@streamr/streamr-layout'
import { MEDIUM, TABLET } from '~/shared/utils/styled'
import Button from '~/shared/components/Button'
import useIsMounted from '~/shared/hooks/useIsMounted'
import TimeoutError from '~/shared/errors/TimeoutError'
import { getWalletAccount, useWalletAccount } from '~/shared/stores/wallet'
import isCodedError from '~/utils/isCodedError'
import routes from '~/routes'
import { Layer } from '~/utils/Layer'
import { RejectionReason } from './BaseModal'

const Root = styled.div`
    background: #f8f8f8;
    color: #323232;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
`

const Inner = styled.div`
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
        color: #ff5c00;
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
    color: #adadad;
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

interface Props {
    onResolve?: (account: string | undefined) => void
    onReject?: (reason?: unknown) => void
}

function ConnectModal({ onReject, onResolve }: Props) {
    const [connectDeferral, setConnectDeferral] = useState<Deferral<string | undefined>>()

    const connecting = !!connectDeferral

    const [error, setError] = useState<unknown>()

    const isMounted = useIsMounted()

    function label() {
        if (error) {
            if (isCodedError(error) && error.code === -32002) {
                return 'Already processing. Please wait.'
            }

            return "Couldn't connect to MetaMask"
        }

        if (connecting) {
            return 'Connecting…'
        }

        return 'MetaMask'
    }

    useDiscardableEffect()

    useEffect(() => {
        function onKeyDown({ key }: KeyboardEvent) {
            if (key === 'Escape') {
                onReject?.(RejectionReason.EscapeKey)
            }
        }

        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [onReject])

    useEffect(
        () => () => {
            connectDeferral?.reject()
        },
        [connectDeferral],
    )

    const account = useWalletAccount()

    useEffect(() => {
        if (account) {
            onResolve?.(account)
        }
    }, [onResolve, account])

    return (
        <Root>
            <Inner>
                <div>
                    <Link to={routes.root()}>
                        <Logo />
                    </Link>
                </div>
                <TitleBar>Streamr Hub</TitleBar>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault()

                        if (connectDeferral) {
                            return
                        }

                        try {
                            const deferral = defer<string | undefined>()

                            setError(undefined)

                            setConnectDeferral(deferral)

                            const currentAccount = await Promise.race([
                                getWalletAccount({
                                    connect: true,
                                }),
                                deferral.promise,
                                new Promise<string | undefined>(
                                    (resolve, reject) =>
                                        void setTimeout(
                                            () => void reject(new TimeoutError()),
                                            120000,
                                        ),
                                ),
                            ])

                            onResolve?.(currentAccount)
                        } catch (e) {
                            console.warn('Wallet connecting failed', e)

                            if (isMounted()) {
                                setError(e)
                            }
                        } finally {
                            if (isMounted()) {
                                setConnectDeferral(undefined)
                            }
                        }
                    }}
                >
                    <Panel>
                        <Auth>
                            <Auth.Panel>
                                <LoadingIndicator loading={connecting} />
                                <Auth.PanelRow>
                                    <Auth.Header>Connect a wallet</Auth.Header>
                                </Auth.PanelRow>
                                <Auth.PanelRow>
                                    <SignInMethod
                                        disabled={connecting}
                                        type="submit"
                                        theme={
                                            error ? SignInMethod.themes.Error : undefined
                                        }
                                    >
                                        <SignInMethod.Title>{label()}</SignInMethod.Title>
                                        <SignInMethod.Icon>
                                            <SignInMethod.Icon.Metamask />
                                        </SignInMethod.Icon>
                                    </SignInMethod>
                                </Auth.PanelRow>
                                <Auth.PanelRow>
                                    <Auth.Footer>
                                        {!error && !connecting && (
                                            <span>
                                                Need an Ethereum wallet?{' '}
                                                <a
                                                    href="https://ethereum.org/en/wallets/"
                                                    target="_blank"
                                                    rel="nofollow noopener noreferrer"
                                                >
                                                    Learn more here
                                                </a>
                                            </span>
                                        )}
                                        {!!connecting && (
                                            <Button
                                                kind="link"
                                                size="mini"
                                                onClick={() =>
                                                    void connectDeferral.reject()
                                                }
                                                type="button"
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        {!!error && !connecting && (
                                            <Button
                                                kind="secondary"
                                                size="mini"
                                                disabled={connecting}
                                                waiting={connecting}
                                                type="submit"
                                            >
                                                Try again
                                            </Button>
                                        )}
                                    </Auth.Footer>
                                </Auth.PanelRow>
                            </Auth.Panel>
                        </Auth>
                    </Panel>
                </form>
                <Footer>
                    <span>
                        By connecting your wallet and using Streamr <br />
                        you agree to our{' '}
                        <a
                            href={routes.tos()}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                        >
                            Terms of Service
                        </a>
                    </span>
                </Footer>
            </Inner>
        </Root>
    )
}

export const connectModal = toaster(ConnectModal, Layer.Modal)
