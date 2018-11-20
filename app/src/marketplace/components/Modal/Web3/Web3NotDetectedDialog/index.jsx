// @flow

import React from 'react'
import { isMetamaskSupported, isMobile } from '$shared/utils/platform'

import InstallMetaMaskDialog from '../InstallMetaMaskDialog'
import InstallMobileApplicationDialog from '../InstallMobileApplicationDialog'
import InstallSupportedBrowserDialog from '../InstallSupportedBrowserDialog'

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
