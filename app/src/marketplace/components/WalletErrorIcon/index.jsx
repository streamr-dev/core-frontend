// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'
import PngIcon from '$shared/components/PngIcon'
import styles from './walletErrorIcon.pcss'

const WalletErrorIcon = () => (
    <PngIcon
        className={styles.icon}
        name="walletError"
        alt={I18n.t('error.wallet')}
    />
)

export default WalletErrorIcon
