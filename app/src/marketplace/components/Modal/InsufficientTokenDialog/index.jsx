// @flow

import React from 'react'

import ModalPortal from '$shared/components/ModalPortal'
import WalletNoEthPng from '$shared/assets/images/wallet_no_eth.png'
import WalletNoEthPng2x from '$shared/assets/images/wallet_no_eth@2x.png'
import Dialog from '$shared/components/Dialog'

import styles from './insufficientTokenDialog.pcss'

export type Props = {
    onCancel: () => void,
    tokenSymbol: string,
}

const InsufficientTokenDialog = ({ onCancel, tokenSymbol }: Props) => (
    <ModalPortal>
        <Dialog
            title={`Insufficient ${tokenSymbol}`}
            onClose={onCancel}
        >
            <img className={styles.icon} src={WalletNoEthPng} srcSet={`${WalletNoEthPng2x} 2x`} alt="Wallet error" />
            <p className={styles.message}>
                You don&apos;t have enough {tokenSymbol} to subscribe
                <br />
                to this product. Please get some and try again
            </p>
        </Dialog>
    </ModalPortal>
)

export default InsufficientTokenDialog
