// @flow

import React, { type Node } from 'react'
import { connect } from 'react-redux'

import getWeb3 from '$shared/web3/web3Provider'
import { selectAccountId } from '$mp/modules/web3/selectors'
import { selectDataPerUsd, selectIsWeb3Injected } from '$mp/modules/global/selectors'
import { receiveAccount, changeAccount, accountError, updateEthereumNetworkId } from '$mp/modules/web3/actions'
import type { StoreState } from '$shared/flowtype/store-state'
import type { Address, Hash, Receipt } from '$shared/flowtype/web3-types'
import type { StreamrWeb3 as StreamrWeb3Type } from '$shared/web3/web3Provider'
import type { ErrorInUi, TransactionType, NumberString } from '$shared/flowtype/common-types'
import { getUserData } from '$shared/modules/user/actions'
import {
    getDataPerUsd as getDataPerUsdAction,
    checkWeb3 as checkWeb3Action,
} from '$mp/modules/global/actions'
import { areAddressesEqual } from '$mp/utils/smartContract'
import {
    addTransaction as addTransactionAction,
    completeTransaction as completeTransactionAction,
    transactionError as transactionErrorAction,
} from '$mp/modules/transactions/actions'
import { getTransactionsFromSessionStorage } from '$shared/utils/transactions'
import TransactionError from '$shared/errors/TransactionError'
import Web3Poller from '$shared/web3/web3Poller'

type OwnProps = {
    children?: Node,
}

type StateProps = {
    account: any,
}

type DispatchProps = {
    receiveAccount: (Address) => void,
    changeAccount: (Address) => void,
    accountError: (error: ErrorInUi) => void,
    getUserData: () => void,
    getDataPerUsd: () => void,
    updateEthereumNetworkId: (id: any) => void,
    checkWeb3: (?boolean) => void,
    addTransaction: (Hash, TransactionType) => void,
    completeTransaction: (Hash, Receipt) => void,
    transactionError: (Hash, TransactionError) => void,
}

type Props = OwnProps & StateProps & DispatchProps

const ONE_SECOND = 1000
const FIVE_MINUTES = 1000 * 60 * 5
const SIX_HOURS = 1000 * 60 * 60 * 6

export class GlobalInfoWatcher extends React.Component<Props> {
    componentDidMount = () => {
        this.initWeb3()

        // Start polling for info
        this.pollDataPerUsdRate()
        this.pollLogin()
        this.addPendingTransactions()

        Web3Poller.subscribe(Web3Poller.events.ACCOUNT_ERROR, this.handleAccountError)
        Web3Poller.subscribe(Web3Poller.events.ACCOUNT, this.handleAccount)
        Web3Poller.subscribe(Web3Poller.events.NETWORK, this.handleNetwork)
        Web3Poller.subscribe(Web3Poller.events.TRANSACTION_COMPLETE, this.handleTransactionComplete)
        Web3Poller.subscribe(Web3Poller.events.TRANSACTION_ERROR, this.handleTransactionError)
    }

    componentWillUnmount = () => {
        Web3Poller.unsubscribe(Web3Poller.events.ACCOUNT_ERROR, this.handleAccountError)
        Web3Poller.unsubscribe(Web3Poller.events.ACCOUNT, this.handleAccount)
        Web3Poller.unsubscribe(Web3Poller.events.NETWORK, this.handleNetwork)
        Web3Poller.unsubscribe(Web3Poller.events.TRANSACTION_COMPLETE, this.handleTransactionComplete)
        Web3Poller.unsubscribe(Web3Poller.events.TRANSACTION_ERROR, this.handleTransactionError)
        this.clearDataPerUsdRatePoll()
        this.clearLoginPoll()
    }

    loginPollTimeout: ?TimeoutID = null
    dataPerUsdRatePollTimeout: ?TimeoutID = null
    web3: StreamrWeb3Type = getWeb3()

    initWeb3 = () => {
        this.web3 = getWeb3()
        this.props.checkWeb3()
    }

    pollLogin = () => {
        this.props.getUserData()
        this.clearLoginPoll()
        this.loginPollTimeout = setTimeout(this.pollLogin, FIVE_MINUTES)
    }

    pollDataPerUsdRate = () => {
        this.props.getDataPerUsd()
        this.clearDataPerUsdRatePoll()
        this.dataPerUsdRatePollTimeout = setTimeout(this.pollDataPerUsdRate, SIX_HOURS)
    }

    clearLoginPoll = () => {
        if (this.loginPollTimeout) {
            clearTimeout(this.loginPollTimeout)
            this.loginPollTimeout = undefined
        }
    }

    clearDataPerUsdRatePoll = () => {
        if (this.dataPerUsdRatePollTimeout) {
            clearTimeout(this.dataPerUsdRatePollTimeout)
            this.dataPerUsdRatePollTimeout = undefined
        }
    }

    addPendingTransactions = () => {
        setTimeout(() => {
            const pendingTransactions = getTransactionsFromSessionStorage()
            Object.keys(pendingTransactions)
                .forEach((txHash) => {
                    this.props.addTransaction(txHash, pendingTransactions[txHash])
                })
        }, ONE_SECOND)
    }

    handleAccountError = (error: ErrorInUi) => {
        this.props.accountError(error)
    }

    handleAccount = (account: string) => {
        const next = account
        const curr = this.props.account

        const didChange = curr && next && !areAddressesEqual(curr, next)
        const didDefine = !curr && next
        if (didDefine) {
            this.props.receiveAccount(next)
        } else if (didChange) {
            this.props.changeAccount(next)
        }
    }

    handleNetwork = (network: NumberString) => {
        this.props.updateEthereumNetworkId(network)
    }

    handleTransactionComplete = (id: Hash, receipt: Receipt) => {
        this.props.completeTransaction(id, receipt)
    }

    handleTransactionError = (id: Hash, error: TransactionError) => {
        this.props.transactionError(id, error)
    }

    render = () => this.props.children
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    account: selectAccountId(state),
    dataPerUsd: selectDataPerUsd(state),
    isWeb3Injected: selectIsWeb3Injected(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    receiveAccount: (id: Address) => dispatch(receiveAccount(id)),
    changeAccount: (id: Address) => dispatch(changeAccount(id)),
    accountError: (error: ErrorInUi) => dispatch(accountError(error)),
    getUserData: () => dispatch(getUserData()),
    getDataPerUsd: () => dispatch(getDataPerUsdAction()),
    updateEthereumNetworkId: (id: any) => dispatch(updateEthereumNetworkId(id)),
    checkWeb3: () => dispatch(checkWeb3Action()),
    addTransaction: (id: Hash, type: TransactionType) => dispatch(addTransactionAction(id, type)),
    completeTransaction: (id: Hash, receipt: Receipt) => dispatch(completeTransactionAction(id, receipt)),
    transactionError: (id: Hash, error: TransactionError) => dispatch(transactionErrorAction(id, error)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GlobalInfoWatcher)
