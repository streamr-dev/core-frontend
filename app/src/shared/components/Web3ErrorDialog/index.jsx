// @flow

import React from 'react'

import UnlockWalletDialog from './UnlockWalletDialog'
import Web3NotDetectedDialog from './Web3NotDetectedDialog'

import { Web3NotSupportedError } from '$shared/errors/Web3'

export type Props = {
    onClose: () => void,
    waiting: boolean,
    error: ?Error,
}

const Web3ErrorDialog = ({ error, ...props }: Props) => {
    if (error instanceof Web3NotSupportedError) {
        return <Web3NotDetectedDialog {...props} />
    }

    return (
        <UnlockWalletDialog {...props}>
            {(!!error && error.message) || 'Error'}
        </UnlockWalletDialog>
    )
}

export default Web3ErrorDialog
