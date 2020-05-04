// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

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
            title={I18n.t('modal.getDataTokensDialog.title')}
            onClose={onCancel}
            renderActions={() => (
                <div className={styles.buttonContainer}>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://uniswap.io"
                        target="_blank"
                    >
                        <Translate value="modal.getCryptoDialog.link.uniswap" />
                    </Button>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://www.bancor.network/"
                        target="_blank"
                    >
                        <Translate value="modal.getDataTokensDialog.link.bancor" />
                    </Button>
                    <Button
                        kind="secondary"
                        tag={Link}
                        href="https://binance.com"
                        target="_blank"
                    >
                        <Translate value="modal.getCryptoDialog.link.binance" />
                    </Button>
                </div>
            )}
        >
            <img className={styles.icon} src={NoDataPng} srcSet={`${NoDataPng2x} 2x`} alt={I18n.t('error.wallet')} />
            <Translate value="modal.getDataTokensDialog.message" tag="p" dangerousHTML className={styles.message} />
            <Translate value="modal.getDataTokensDialog.mobileMessage" tag="p" dangerousHTML className={styles.mobileMessage} />
        </Dialog>
    </ModalPortal>
)

export default GetDataTokensDialog
