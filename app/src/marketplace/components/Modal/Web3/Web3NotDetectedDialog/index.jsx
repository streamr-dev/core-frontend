// @flow

import React from 'react'

import InstallMetaMaskDialog from '../InstallMetaMaskDialog/index'
import InstallMobileApplicationDialog from '../InstallMobileApplicationDialog/index'
import InstallSupportedBrowserDialog from '../InstallSupportedBrowserDialog/index'
import { isMetamaskSupported, isMobile } from '../../../../../../../marketplace/src/utils/platform'

export type Props = {
    onCancel: () => void,
}

const Web3NotDetectedDialog = ({ onCancel }: Props) => {
    if (isMetamaskSupported()) {
        return <InstallMetaMaskDialog onCancel={onCancel} />
    } else if (isMobile()) {
        return <InstallMobileApplicationDialog onCancel={onCancel} />
    }

    return <InstallSupportedBrowserDialog onCancel={onCancel} />
}

export default Web3NotDetectedDialog
