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

const CompleteUnpublishDialog = ({ onCancel, publishState }: Props) => {
    switch (publishState) {
        case transactionStates.STARTED:
            return (
                <Dialog
                    onClose={onCancel}
                    title="Unpublish confirmation"
                    actions={{
                        cancel: {
                            title: 'Cancel',
                            onClick: onCancel,
                        },
                        publish: {
                            title: 'Waiting',
                            color: 'primary',
                            disabled: true,
                            spinner: true,
                        },
                    }}
                >
                    <div>
                        <p>You need to confirm the transaction <br /> in your wallet to unpublish this product.</p>
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
                    title="Unpublish complete"
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
                    title="Unpublishing failed"
                >
                    <div>
                        <WalletErrorIcon />
                        <p>There was a problem unpublishing your product.</p>
                        <p>Please check your wallet settings and try again.</p>
                    </div>
                </Dialog>
            )

        default:
            return null
    }
}

export default CompleteUnpublishDialog
