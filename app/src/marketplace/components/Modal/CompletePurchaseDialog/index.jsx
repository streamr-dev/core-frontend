// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'
import Spinner from '$shared/components/Spinner'
import CheckmarkIcon from '$mp/components/CheckmarkIcon'
import links from '$mp/../links'
import type { TransactionState } from '$shared/flowtype/common-types'
import { transactionStates } from '$shared/utils/constants'

import TxFailedImage from '$mp/assets/tx_failed.png'
import TxFailedImage2x from '$mp/assets/tx_failed@2x.png'

import styles from './completePurchaseDialog.pcss'

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
                    title={I18n.t('modal.completePurchase.pending.title')}
                >
                    <Spinner size="large" className={styles.icon} />
                    <Translate
                        tag="p"
                        value="modal.common.waitingForBlockchain"
                        marketplaceLink={links.main}
                        className={styles.pendingText}
                        dangerousHTML
                    />
                </Dialog>
            )

        case transactionStates.CONFIRMED:
            return (
                <Dialog
                    onClose={onCancel}
                    title={I18n.t('modal.completePurchase.confirmed.title')}
                >
                    <CheckmarkIcon size="large" className={styles.icon} />
                    {!accountLinked && (
                        <Translate
                            tag="p"
                            value="modal.completePurchase.confirmed.message"
                            profileLink={links.profile}
                            dangerousHTML
                        />
                    )}
                </Dialog>
            )

        case transactionStates.FAILED:
            return (
                <Dialog
                    onClose={onCancel}
                    title={I18n.t('modal.completePurchase.failed.title')}
                >
                    <img
                        className={styles.icon}
                        src={TxFailedImage}
                        srcSet={`${TxFailedImage2x} 2x`}
                        alt={I18n.t('error.txFailed')}
                    />
                    <Translate
                        tag="p"
                        value="modal.completePurchase.failed.message"
                        dangerousHTML
                    />
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
