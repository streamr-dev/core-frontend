// @flow

import React from 'react'

import Dialog from '../Dialog'
import Spinner from '../../Spinner'
import CheckmarkIcon from '../../CheckmarkIcon'
import WalletErrorIcon from '../../../components/WalletErrorIcon'
import { transactionStates } from '../../../utils/constants'
import links from '../../../links'
import type { TransactionState } from '../../../flowtype/common-types'

import styles from '../modal.pcss'

export type Props = {
    purchaseState: ?TransactionState,
    accountLinked: boolean,
    onCancel: () => void,
}

const CompletePurchaseDialog = ({ onCancel, purchaseState, accountLinked }: Props) => {
    switch (purchaseState) {
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
                    title="Transaction complete"
                >
                    <div>
                        <CheckmarkIcon size="large" className={styles.icon} />
                        {!accountLinked && (
                            <p>
                                You need to connect your Ethereum identity<br />
                                to your Streamr account. Connect it <a href={links.profile}>here</a>.
                            </p>
                        )}
                    </div>
                </Dialog>
            )

        case transactionStates.FAILED:
            return (
                <Dialog
                    onClose={onCancel}
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

CompletePurchaseDialog.defaultProps = {
    accountLinked: true,
}

export default CompletePurchaseDialog
