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
    onCancel: () => void
    nativeTokenName: string
}

const GetCryptoDialog = ({ onCancel, nativeTokenName }: Props) => (
    <ModalPortal>
        <Dialog
            title={`No ${nativeTokenName} balance`}
            onClose={onCancel}
            renderActions={() => (
                <div className={styles.buttonContainer}>
                    <Button kind="secondary" tag={Link} href="https://ramp.network/" target="_blank">
                        Ramp
                    </Button>
                    <Button kind="secondary" tag={Link} href="https://coinbase.com" target="_blank">
                        Coinbase
                    </Button>
                    <Button kind="secondary" tag={Link} href="https://binance.com" target="_blank">
                        Binance
                    </Button>
                </div>
            )}
        >
            <PngIcon className={styles.icon} name="walletError" alt={`No ${nativeTokenName} balance`} />
            <Message data-testid={'get-crypto-dialog'}>
                <span>{nativeTokenName} is needed for gas, </span>
                <span>but you don&apos;t have any. </span>
            </Message>
            <p>Please get some and try again</p>
        </Dialog>
    </ModalPortal>
)

export default GetCryptoDialog
