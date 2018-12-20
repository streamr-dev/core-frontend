// @flow

import React from 'react'

import Dialog from '$shared/components/Dialog'

type Props = {
    onClose: () => void,
}

const WalletLockedDialog = ({ onClose }: Props) => (
    <Dialog
        onClose={onClose}
    >
        Wallet locked!
    </Dialog>
)

export default WalletLockedDialog
