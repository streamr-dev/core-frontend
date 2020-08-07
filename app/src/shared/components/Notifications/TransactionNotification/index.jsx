// @flow

import React from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import Spinner from '$shared/components/Spinner'
import SvgIcon from '$shared/components/SvgIcon'
import styles from '../BasicNotification/basic.pcss'
import { transactionStates, transactionTypes } from '$shared/utils/constants'
import type { StoreState } from '$shared/flowtype/store-state'
import type { TransactionState } from '$shared/flowtype/common-types'
import type { Hash, TransactionEntity } from '$shared/flowtype/web3-types'
import { makeSelectTransaction } from '$mp/modules/transactions/selectors'

type OwnProps = {
    txHash: Hash,
}

type StateProps = {
    transaction: ?TransactionEntity,
}

type DispatchProps = {}

type Props = OwnProps & StateProps & DispatchProps

const renderPublishComponent = (state: ?TransactionState, isPublish: boolean) => {
    switch (state) {
        case transactionStates.PENDING:
            return (
                <div className={styles.container}>
                    <Spinner size="small" className={styles.icon} />
                    <Translate value="notifications.waiting" className={styles.title} />
                </div>
            )

        case transactionStates.CONFIRMED:
            return (
                <div className={styles.container}>
                    <SvgIcon name="checkmark" size="small" className={styles.icon} />
                    {isPublish ?
                        <Translate value="notifications.published" className={styles.title} /> :
                        <Translate value="notifications.unpublished" className={styles.title} />
                    }
                </div>
            )

        case transactionStates.FAILED:
            return (
                <div className={styles.container}>
                    <span className={styles.error} />
                    {isPublish ?
                        <Translate value="notifications.publishError" className={styles.title} /> :
                        <Translate value="notifications.unpublishError" className={styles.title} />
                    }
                </div>
            )

        default:
            return null
    }
}

const renderPurchaseComponent = (state: ?TransactionState) => {
    switch (state) {
        case transactionStates.PENDING:
            return (
                <div className={styles.container}>
                    <Spinner size="small" className={styles.icon} />
                    <Translate value="notifications.waiting" className={styles.title} />
                </div>
            )

        case transactionStates.CONFIRMED:
            return (
                <div className={styles.container}>
                    <SvgIcon name="checkmark" size="small" className={styles.icon} />
                    <Translate value="notifications.purchaseComplete" className={styles.title} />
                </div>
            )

        case transactionStates.FAILED:
            return (
                <div className={styles.container}>
                    <span className={styles.error} />
                    <Translate value="notifications.purchaseError" className={styles.title} />
                </div>
            )

        default:
            return null
    }
}

const renderUpdateComponent = (state: ?TransactionState) => {
    switch (state) {
        case transactionStates.PENDING:
            return (
                <div className={styles.container}>
                    <Spinner size="small" className={styles.icon} />
                    <Translate value="notifications.waiting" className={styles.title} />
                </div>
            )

        case transactionStates.CONFIRMED:
            return (
                <div className={styles.container}>
                    <SvgIcon name="checkmark" size="small" className={styles.icon} />
                    <Translate value="notifications.productUpdated" className={styles.title} />
                </div>
            )

        case transactionStates.FAILED:
            return (
                <div className={styles.container}>
                    <span className={styles.error} />
                    <Translate value="notifications.updateError" className={styles.title} />
                </div>
            )

        default:
            return null
    }
}

const TransactionNotification = ({ transaction }: Props) => {
    if (!transaction) {
        return null
    }

    switch (transaction.type) {
        case transactionTypes.CREATE_CONTRACT_PRODUCT:
            return renderPublishComponent(transaction.state, true)

        case transactionTypes.REDEPLOY_PRODUCT:
            return renderPublishComponent(transaction.state, true)

        case transactionTypes.UNDEPLOY_PRODUCT:
            return renderPublishComponent(transaction.state, false)

        case transactionTypes.UPDATE_CONTRACT_PRODUCT:
            return renderUpdateComponent(transaction.state)

        case transactionTypes.SUBSCRIPTION:
            return renderPurchaseComponent(transaction.state)

        default:
            // TODO: This is here only so that developers will notice an error
            // when trying to display transaction notifications for unknown hashes.
            // Users should never see this so there's no need for translation.
            return (
                <div className={styles.container}>
                    <span className={styles.error} />
                    <span className={styles.title}>Trying to watch for a transaction hash that is not in the Redux state</span>
                </div>
            )
    }
}

const makeMapStateToProps = (_, ownProps: OwnProps) => {
    const selectTransaction = makeSelectTransaction(ownProps.txHash)
    const mapStateToProps = (state: StoreState) => ({
        transaction: selectTransaction(state),
    })
    return mapStateToProps
}

const mapDispatchToProps = (): DispatchProps => ({})

export default connect(makeMapStateToProps, mapDispatchToProps)(TransactionNotification)
