// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'
import WalletIconPng from '$shared/assets/images/wallet_error.png'
import WalletIconPng2x from '$shared/assets/images/wallet_error@2x.png'
import styles from './walletErrorIcon.pcss'

const WalletErrorIcon = () => (
    <img className={styles.icon} src={WalletIconPng} srcSet={`${WalletIconPng2x} 2x`} alt={I18n.t('error.wallet')} />
)

export default WalletErrorIcon
