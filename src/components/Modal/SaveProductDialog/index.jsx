// @flow

import React from 'react'

import Dialog from '../Dialog'
import Spinner from '../../Spinner'
import CheckmarkIcon from '../../CheckmarkIcon'
import WalletErrorIcon from '../../../components/WalletErrorIcon'
import type { TransactionState } from '../../../flowtype/common-types'
import { transactionStates } from '../../../utils/constants'

import styles from '../modal.pcss'

export type Props = {
    transactionState: ?TransactionState,
    onClose: () => void,
}

const SaveProductDialog = ({ transactionState, onClose }: Props) => {
    switch (transactionState) {
        case transactionStates.STARTED:
            return (
                <Dialog
                    onClose={onClose}
                    title="Updating"
                >
                    <div>
                        <Spinner size="large" className={styles.icon} />
                    </div>
                </Dialog>
            )

        case transactionStates.PENDING:
            return (
                <Dialog
                    onClose={onClose}
                    title="Writing to the blockchain"
                >
                    <div>
                        <Spinner size="large" className={styles.icon} />
                        <p>You can wait for it to complete or close this window</p>
                    </div>
                </Dialog>
            )

        case transactionStates.CONFIRMED:
            return (
                <Dialog
                    onClose={onClose}
                    title="Update complete"
                >
                    <div>
                        <CheckmarkIcon size="large" className={styles.icon} />
                    </div>
                </Dialog>
            )

        case transactionStates.FAILED:
            return (
                <Dialog
                    onClose={onClose}
                    title="Transaction failed"
                >
                    <div>
                        <WalletErrorIcon />
                        <p>There was a problem with your transaction.</p>
                        <p>Please check your wallet settings and try again.</p>
                    </div>
                </Dialog>
            )

        default:
            return null
    }
}

export default SaveProductDialog
