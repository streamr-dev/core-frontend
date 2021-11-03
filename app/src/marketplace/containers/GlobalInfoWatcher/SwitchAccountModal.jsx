import React from 'react'

import SwitchWalletAccountDialog from '$mp/components/Modal/SwitchWalletAccountDialog'

const SwitchAccountModal = ({ isOpen, onClose, onContinue }) => {
    if (!isOpen) {
        return null
    }

    return (
        <SwitchWalletAccountDialog
            onClose={onClose}
            onContinue={onContinue}
        />
    )
}

export default SwitchAccountModal
