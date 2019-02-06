// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'

import Dialog from '$shared/components/Dialog'
import Spinner from '$shared/components/Spinner'
import SvgIcon from '$shared/components/SvgIcon'
import links from '$mp/../links'
import type { TransactionState } from '$shared/flowtype/common-types'
import { transactionStates } from '$shared/utils/constants'
import PngIcon from '$shared/components/PngIcon'

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
                    <SvgIcon name="checkmark" size="large" className={styles.icon} />
                    {!accountLinked && (
                        <p>
                            <Translate value="modal.completePurchase.confirmed.message" />
                            {' '}
                            <Link to={links.userpages.profile}>
                                <Translate value="modal.completePurchase.confirmed.link" />
                            </Link>
                        </p>
                    )}
                </Dialog>
            )

        case transactionStates.FAILED:
            return (
                <Dialog
                    onClose={onCancel}
                    title={I18n.t('modal.completePurchase.failed.title')}
                >
                    <PngIcon
                        className={styles.icon}
                        name="txFailed"
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
