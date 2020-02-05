// @flow

import React from 'react'

import type { ErrorInUi } from '$shared/flowtype/common-types'
import { Web3NotSupportedError, WalletLockedError } from '$shared/errors/Web3'

import UnlockWalletDialog from './UnlockWalletDialog'
import Web3NotDetectedDialog from './Web3NotDetectedDialog'

export type Props = {
    onClose: () => void,
    waiting?: boolean,
    error: ?ErrorInUi,
}

const Web3ErrorDialog = ({ error, waiting, ...props }: Props) => {
    if (error instanceof Web3NotSupportedError) {
        return <Web3NotDetectedDialog {...props} />
    }

    return (
        <UnlockWalletDialog
            {...props}
            waiting={!!waiting}
            icon={!(error instanceof WalletLockedError) ? 'walletError' : undefined}
        >
            <p>{(!!error && error.message) || 'Error'}</p>
        </UnlockWalletDialog>
    )
}

export default Web3ErrorDialog
