// @flow

import React from 'react'
import { connect } from 'react-redux'
import Spinner from '../../../components/Spinner'
import CheckmarkIcon from '../../../components/CheckmarkIcon'
import styles from '../../../components/Notifications/Basic/basic.pcss'
import {
    selectTransactionState as selectPublishTransactionState,
    selectTransactionHash as selectPublishTransactionHash,
    selectIsPublish,
} from '../../../modules/publish/selectors'
import {
    selectTransactionState as selectCreateContractProductTransactionState,
    selectTransactionHash as selectCreateContractProductTransactionHash,
} from '../../../modules/createContractProduct/selectors'
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
    isPublishTransaction: boolean,
    purchaseTransactionState: ?TransactionState,
    purchaseTransactionHash: ?Hash,
    createContractProductTransactionState: ?TransactionState,
    createContractProductTransactionHash: ?Hash,
}

type DispatchProps = {}

type Props = OwnProps & StateProps & DispatchProps

const renderPublishComponent = (state: ?TransactionState, isPublish: boolean) => {
    switch (state) {
        case transactionStates.PENDING:
            return (
                <div className={styles.container}>
                    <Spinner size="small" className={styles.icon} />
                    <span className={styles.title}>Waiting for the blockchain...</span>
                </div>
            )

        case transactionStates.CONFIRMED:
            return (
                <div className={styles.container}>
                    <CheckmarkIcon size="small" className={styles.icon} />
                    <span className={styles.title}>Your product has been {!isPublish && 'un'}published</span>
                </div>
            )

        case transactionStates.FAILED:
            return (
                <div className={styles.container}>
                    <span className={styles.error} />
                    <span className={styles.title}>There was an error {!isPublish && 'un'}publishing your product</span>
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
                    <span className={styles.title}>Waiting for the blockchain...</span>
                </div>
            )

        case transactionStates.CONFIRMED:
            return (
                <div className={styles.container}>
                    <CheckmarkIcon size="small" className={styles.icon} />
                    <span className={styles.title}>Product purchase completed</span>
                </div>
            )

        case transactionStates.FAILED:
            return (
                <div className={styles.container}>
                    <span className={styles.error} />
                    <span className={styles.title}>There was an error purchasing a product</span>
                </div>
            )

        default:
            return null
    }
}

const Transaction = ({
    txHash,
    publishTransactionState,
    publishTransactionHash,
    isPublishTransaction,
    purchaseTransactionState,
    purchaseTransactionHash,
    createContractProductTransactionState,
    createContractProductTransactionHash,
}: Props) => {
    if (txHash === publishTransactionHash) {
        return renderPublishComponent(publishTransactionState, isPublishTransaction)
    } else if (txHash === createContractProductTransactionHash) {
        return renderPublishComponent(createContractProductTransactionState, true)
    } else if (txHash === purchaseTransactionHash) {
        return renderPurchaseComponent(purchaseTransactionState)
    }

    return (
        <div className={styles.container}>
            <span className={styles.error} />
            <span className={styles.title}>Trying to watch for a transaction hash that is not in the Redux state</span>
        </div>
    )
}

const mapStateToProps = (state: StoreState): StateProps => ({
    publishTransactionState: selectPublishTransactionState(state),
    publishTransactionHash: selectPublishTransactionHash(state),
    isPublishTransaction: selectIsPublish(state),
    purchaseTransactionState: selectPurchaseTransactionState(state),
    purchaseTransactionHash: selectPurchaseTransactionHash(state),
    createContractProductTransactionState: selectCreateContractProductTransactionState(state),
    createContractProductTransactionHash: selectCreateContractProductTransactionHash(state),
})

const mapDispatchToProps = (): DispatchProps => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)
