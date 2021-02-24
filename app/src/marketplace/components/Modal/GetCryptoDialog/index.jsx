// @flow

import React from 'react'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import PngIcon from '$shared/components/PngIcon'
import Dialog from '$shared/components/Dialog'
import Button from '$shared/components/Button'
import Link from '$shared/components/Link'
import { MD } from '$shared/utils/styled'

import styles from '$shared/components/Web3ErrorDialog/Web3NotDetectedDialog/web3NotDetectedDialog.pcss'

const Message = styled.p`
    span {
        display: block;
    }

    @media (min-width: ${MD}px) {
        span {
            display: inline;
        }
    }
`

export type Props = {
    onCancel: () => void,
}

const GetCryptoDialog = ({ onCancel }: Props) => (
    <ModalPortal>
        <Dialog
            title="No Ether balance"
            onClose={onCancel}
            renderActions={() => (
                <div className={styles.buttonContainer}>
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
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://uniswap.io"
                        target="_blank"
                    >
                        Uniswap
                    </Button>
                </div>
            )}
        >
            <PngIcon
                className={styles.icon}
                name="walletNoEth"
                alt="No Ether balance"
            />
            <Message>
                <span>Ether is needed for gas, </span>
                <span>but you don&apos;t have any. </span>
            </Message>
            <p>
                Please get some and try again
            </p>
        </Dialog>
    </ModalPortal>
)

export default GetCryptoDialog
