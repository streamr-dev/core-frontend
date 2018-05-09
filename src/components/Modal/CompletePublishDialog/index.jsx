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
    publishState: ?TransactionState,
    onCancel: () => void,
}

const CompletePublishDialog = ({ onCancel, publishState }: Props) => {
    switch (publishState) {
        case transactionStates.STARTED:
            return (
                <Dialog
                    onClose={onCancel}
                    title="Publish product"
                >
                    <div>
                        <p>...</p>
                    </div>
                </Dialog>
            )

        case transactionStates.PENDING:
            return (
                <Dialog
                    onClose={onCancel}
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
                    onClose={onCancel}
                    title="Publish complete"
                >
                    <div>
                        <CheckmarkIcon size="large" className={styles.icon} />
                    </div>
                </Dialog>
            )

        case transactionStates.FAILED:
            return (
                <Dialog
                    onClose={onCancel}
                    title="Publishing failed"
                >
                    <div>
                        <WalletErrorIcon />
                        <p>There was a problem publishing your product.</p>
                        <p>Please check your wallet settings and try again.</p>
                    </div>
                </Dialog>
            )

        default:
            return null
    }
}

export default CompletePublishDialog
