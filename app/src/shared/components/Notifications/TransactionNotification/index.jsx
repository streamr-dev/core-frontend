// @flow

import React from 'react'
import { connect } from 'react-redux'

import Spinner from '$shared/components/Spinner'
import SvgIcon from '$shared/components/SvgIcon'
import { transactionStates, transactionTypes } from '$shared/utils/constants'
import type { StoreState } from '$shared/flowtype/store-state'
import type { TransactionState } from '$shared/flowtype/common-types'
import type { Hash, TransactionEntity } from '$shared/flowtype/web3-types'
import { makeSelectTransaction } from '$mp/modules/transactions/selectors'
import styles from '../BasicNotification/basic.pcss'

type OwnProps = {
    // eslint-disable-next-line react/no-unused-prop-types
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
                    <span className={styles.title}>
                        Waiting for the blockchain...
                    </span>
                </div>
            )

        case transactionStates.CONFIRMED:
            return (
                <div className={styles.container}>
                    <SvgIcon name="checkmark" size="small" className={styles.icon} />
                    <span className={styles.title}>
                        Your product has been
                        {' '}
                        {isPublish ? 'published' : 'unpublished'}
                    </span>
                </div>
            )

        case transactionStates.FAILED:
            return (
                <div className={styles.container}>
                    <span className={styles.error} />
                    <span className={styles.title}>
                        There was an error
                        {' '}
                        {isPublish ? 'publishing' : 'unpublishing'}
                        {' '}
                        your product
                    </span>
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
                    <span className={styles.title}>
                        Waiting for the blockchain...
                    </span>
                </div>
            )

        case transactionStates.CONFIRMED:
            return (
                <div className={styles.container}>
                    <SvgIcon name="checkmark" size="small" className={styles.icon} />
                    <span className={styles.title}>
                        Product subscription completed
                    </span>
                </div>
            )

        case transactionStates.FAILED:
            return (
                <div className={styles.container}>
                    <span className={styles.error} />
                    <span className={styles.title}>
                        There was an error subscribing to a product
                    </span>
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
                    <span className={styles.title}>
                        Waiting for the blockchain...
                    </span>
                </div>
            )

        case transactionStates.CONFIRMED:
            return (
                <div className={styles.container}>
                    <SvgIcon name="checkmark" size="small" className={styles.icon} />
                    <span className={styles.title}>
                        Your product has been updated
                    </span>
                </div>
            )

        case transactionStates.FAILED:
            return (
                <div className={styles.container}>
                    <span className={styles.error} />
                    <span className={styles.title}>
                        There was an error updating your product
                    </span>
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
