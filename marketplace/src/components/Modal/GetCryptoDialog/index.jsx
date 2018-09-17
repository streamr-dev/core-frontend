// @flow

import React from 'react'
import { Translate } from '@streamr/streamr-layout'

import WalletNoEthPng from '../../../../assets/wallet_no_eth.png'
import WalletNoEthPng2x from '../../../../assets/wallet_no_eth@2x.png'
import Dialog from '../Dialog'
import withI18n from '../../../containers/WithI18n'
import ExternalLinkButton from '../../../components/Buttons/ExternalLinkButton'

import styles from './getCryptoDialog.pcss'

export type Props = {
    onCancel: () => void,
    translate: (key: string, options: any) => string,
}

const GetCryptoDialog = ({ onCancel, translate }: Props) => (
    <Dialog
        title={translate('modal.getCryptoDialog.title')}
        onClose={onCancel}
    >
        <img className={styles.icon} src={WalletNoEthPng} srcSet={`${WalletNoEthPng2x} 2x`} alt="Wallet Icon" />
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
)

export default withI18n(GetCryptoDialog)
