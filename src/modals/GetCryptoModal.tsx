import React from 'react'
import styled from 'styled-components'
import PngIcon from '~/shared/components/PngIcon'
import { Button } from '~/components/Button'
import Link from '~/shared/components/Link'
import { Buttons } from '~/components/Buttons'
import Modal from './Modal'
import { Footer } from './BaseModal'

interface Props {
    onReject?: (reason?: unknown) => void
    tokenName: string
}

export default function GetCryptoModal({ tokenName, onReject }: Props) {
    return (
        <Modal onReject={onReject} title={`No ${tokenName} balance`}>
            <Copy>
                <IconWrap>
                    <PngIcon name="walletError" alt={`No ${tokenName} balance`} />
                </IconWrap>
                <p>{tokenName} is needed for gas, but you don&apos;t have any.</p>
                <p>Please get some and try again</p>
            </Copy>
            <Exchanges>
                <Button
                    kind="secondary"
                    tag={Link}
                    href="https://ramp.network/"
                    target="_blank"
                >
                    Ramp
                </Button>
                <Button
                    kind="secondary"
                    tag={Link}
                    href="https://coinbase.com"
                    target="_blank"
                >
                    Coinbase
                </Button>
                <Button
                    kind="secondary"
                    tag={Link}
                    href="https://binance.com"
                    target="_blank"
                >
                    Binance
                </Button>
            </Exchanges>
            <Footer>
                <Buttons
                    actions={{
                        cancel: {
                            title: 'Dismiss',
                            onClick: () => void onReject?.(),
                            kind: 'primary',
                        },
                    }}
                />
            </Footer>
        </Modal>
    )
}

const Copy = styled.div`
    padding: 48px 40px 40px;

    p {
        margin: 0;
        text-align: center;
    }

    p + p {
        margin-top: 0.5em;
    }
`

const Exchanges = styled.div`
    align-items: center;
    border-top: 1px solid #f2f1f1;
    display: grid;
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
    grid-template-columns: 1fr 1fr 1fr;
    justify-content: center;
    padding: 1.5rem 40px;
`

const IconWrap = styled.div`
    width: 98px;
    height: 67px;
    position: relative;
    margin: 0 auto 24px;
    background: red;

    img {
        display: block;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%) translateY(-5%) translateX(-4%);
    }
`
