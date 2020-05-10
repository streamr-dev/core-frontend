// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import PngIcon from '$shared/components/PngIcon'
import Dialog from '$shared/components/Dialog'
import Button from '$shared/components/Button'
import Link from '$shared/components/Link'

import styles from '$shared/components/Web3ErrorDialog/Web3NotDetectedDialog/web3NotDetectedDialog.pcss'

export type Props = {
    onCancel: () => void,
}

const GetCryptoDialog = ({ onCancel }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.getCryptoDialog.title')}
            onClose={onCancel}
            renderActions={() => (
                <div className={styles.buttonContainer}>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://coinbase.com"
                        target="_blank"
                    >
                        <Translate value="modal.getCryptoDialog.link.coinbase" />
                    </Button>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://binance.com"
                        target="_blank"
                    >
                        <Translate value="modal.getCryptoDialog.link.binance" />
                    </Button>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://uniswap.io"
                        target="_blank"
                    >
                        <Translate value="modal.getCryptoDialog.link.uniswap" />
                    </Button>
                </div>
            )}
        >
            <PngIcon
                className={styles.icon}
                name="walletNoEth"
                alt={I18n.t('modal.getCryptoDialog.title')}
            />
            <Translate value="modal.getCryptoDialog.message" tag="p" dangerousHTML className={styles.message} />
            <Translate value="modal.getCryptoDialog.mobileMessage" tag="p" dangerousHTML className={styles.mobileMessage} />
        </Dialog>
    </ModalPortal>
)

export default GetCryptoDialog
