// @flow

import React from 'react'
import { connect } from 'react-redux'
import styles from '../../../components/Notifications/Basic/basic.pcss'
import {
    selectTransactionState as selectPublishTransactionState,
    selectTransactionHash as selectPublishTransactionHash,
} from '../../../modules/publish/selectors'
import {
    selectTransactionState as selectPurchaseTransactionState,
    selectTransactionHash as selectPurchaseTransactionHash,
} from '../../../modules/purchase/selectors'
import { transactionStates } from '../../../utils/constants'
import type { StoreState } from '../../../flowtype/store-state'
import type { TransactionState } from '../../../flowtype/common-types'
import type { Hash } from '../../../flowtype/web3-types'

type OwnProps = {
    txHash: Hash,
}

type StateProps = {
    publishTransactionState: ?TransactionState,
    publishTransactionHash: ?Hash,
    purchaseTransactionState: ?TransactionState,
    purchaseTransactionHash: ?Hash,
}

type DispatchProps = {}

type Props = OwnProps & StateProps & DispatchProps

const renderPublishComponent = (state: ?TransactionState) => {
    switch (state) {
        case transactionStates.PENDING:
            return (
                <div className={styles.title}>Waiting for the blockchain...</div>
            )

        case transactionStates.CONFIRMED:
            return (
                <div className={styles.title}>Your product has been published</div>
            )

        case transactionStates.FAILED:
            return (
                <div className={styles.title}>There was an error publishing your product</div>
            )

        default:
            return null
    }
}

const renderPurchaseComponent = (state: ?TransactionState) => {
    switch (state) {
        case transactionStates.PENDING:
            return (
                <div className={styles.title}>Waiting for the blockchain...</div>
            )

        case transactionStates.CONFIRMED:
            return (
                <div className={styles.title}>Product purchase completed</div>
            )

        case transactionStates.FAILED:
            return (
                <div className={styles.title}>There was an error purchasing a product</div>
            )

        default:
            return null
    }
}

const Transaction = ({
    txHash,
    publishTransactionState,
    publishTransactionHash,
    purchaseTransactionState,
    purchaseTransactionHash,
}: Props) => {
    if (txHash === publishTransactionHash) {
        return renderPublishComponent(publishTransactionState)
    } else if (txHash === purchaseTransactionHash) {
        return renderPurchaseComponent(purchaseTransactionState)
    }

    return (
        <div className={styles.title}>Error: Trying to watch for a transaction hash we do not have knowledge of</div>
    )
}

const mapStateToProps = (state: StoreState): StateProps => ({
    publishTransactionState: selectPublishTransactionState(state),
    publishTransactionHash: selectPublishTransactionHash(state),
    purchaseTransactionState: selectPurchaseTransactionState(state),
    purchaseTransactionHash: selectPurchaseTransactionHash(state),
})

const mapDispatchToProps = (): DispatchProps => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)
