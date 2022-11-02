import React from 'react'
import { isMetamaskSupported, isMobile } from '$shared/utils/platform'
import InstallMetaMaskDialog from './InstallMetaMaskDialog'
import InstallMobileApplicationDialog from './InstallMobileApplicationDialog'
import InstallSupportedBrowserDialog from './InstallSupportedBrowserDialog'
export type Props = {
    onClose: () => void
}

const Web3NotDetectedDialog = ({ onClose }: Props) => {
    if (isMetamaskSupported()) {
        return <InstallMetaMaskDialog onClose={onClose} />
    } else if (isMobile()) {
        return <InstallMobileApplicationDialog onClose={onClose} />
    }

    return <InstallSupportedBrowserDialog onClose={onClose} />
}

export default Web3NotDetectedDialog
