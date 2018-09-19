// @flow

import React from 'react'
import WalletIconPng from '../../../assets/wallet_error.png'
import WalletIconPng2x from '../../../assets/wallet_error@2x.png'
import styles from './walletErrorIcon.pcss'

const WalletErrorIcon = () => (
    <img className={styles.icon} src={WalletIconPng} srcSet={`${WalletIconPng2x} 2x`} alt="Error" />
)

export default WalletErrorIcon
