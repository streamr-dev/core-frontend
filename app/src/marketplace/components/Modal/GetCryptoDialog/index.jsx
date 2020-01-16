// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

// import WalletNoEthPng from '../../../assets/wallet_no_eth.png'
// import WalletNoEthPng2x from '../../../assets/wallet_no_eth@2x.png'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import ExternalLinkButton from '$shared/components/Buttons/ExternalLinkButton'

import styles from './getCryptoDialog.pcss'

export type Props = {
    onCancel: () => void,
}

const GetCryptoDialog = ({ onCancel }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.getCryptoDialog.title')}
            onClose={onCancel}
        >
            {/* <img className={styles.icon} src={WalletNoEthPng} srcSet={`${WalletNoEthPng2x} 2x`} alt={I18n.t('error.wallet')} /> */}
            <Translate value="modal.getCryptoDialog.message" className={styles.message} />

            <div className={styles.buttonContainer}>
                <ExternalLinkButton
                    textI18nKey="modal.getCryptoDialog.link.coinbase"
                    href="https://www.coinbase.com/"
                    className={styles.button}
                />
                <ExternalLinkButton
                    textI18nKey="modal.getCryptoDialog.link.bitfinex"
                    href="https://www.bitfinex.com/"
                    className={styles.button}
                />
                <ExternalLinkButton
                    textI18nKey="modal.getCryptoDialog.link.poloniex"
                    href="https://poloniex.com/"
                    className={styles.button}
                />
            </div>
        </Dialog>
    </ModalPortal>
)

export default GetCryptoDialog
