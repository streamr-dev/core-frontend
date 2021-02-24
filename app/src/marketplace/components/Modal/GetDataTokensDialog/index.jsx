// @flow

import React from 'react'

import ModalPortal from '$shared/components/ModalPortal'
import NoDataPng from '$shared/assets/images/wallet_no_data.png'
import NoDataPng2x from '$shared/assets/images/wallet_no_data@2x.png'
import Dialog from '$shared/components/Dialog'
import Button from '$shared/components/Button'
import Link from '$shared/components/Link'

import styles from '$shared/components/Web3ErrorDialog/Web3NotDetectedDialog/web3NotDetectedDialog.pcss'

export type Props = {
    onCancel: () => void,
}

const GetDataTokensDialog = ({ onCancel }: Props) => (
    <ModalPortal>
        <Dialog
            title="No DATA balance"
            onClose={onCancel}
            renderActions={() => (
                <div className={styles.buttonContainer}>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://uniswap.io"
                        target="_blank"
                    >
                        Uniswap
                    </Button>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://www.bancor.network/"
                        target="_blank"
                    >
                        Bancor
                    </Button>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://binance.com"
                        target="_blank"
                    >
                        Binance
                    </Button>
                </div>
            )}
        >
            <img className={styles.icon} src={NoDataPng} srcSet={`${NoDataPng2x} 2x`} alt="Wallet error" />
            <p className={styles.message}>
                DATA is currently required to subscribe to products on the Marketplace. Please purchase some and try again
            </p>
            <p className={styles.mobileMessage}>
                DATA is currently required to subscribe
                <br />
                to products on the Marketplace.
                <br />
                Please purchase some and try again
            </p>
        </Dialog>
    </ModalPortal>
)

export default GetDataTokensDialog
