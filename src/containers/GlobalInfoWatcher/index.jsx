// @flow

import React, { type Node } from 'react'
import { connect } from 'react-redux'
import { I18n } from '@streamr/streamr-layout'

import getWeb3, { getPublicWeb3 } from '../../web3/web3Provider'
import { selectAccountId } from '../../modules/web3/selectors'
import { selectDataPerUsd, selectIsWeb3Injected } from '../../modules/global/selectors'
import { receiveAccount, changeAccount, accountError } from '../../modules/web3/actions'
import type { StoreState } from '../../flowtype/store-state'
import type { Address, Hash, Receipt } from '../../flowtype/web3-types'
import type { ErrorInUi, TransactionType } from '../../flowtype/common-types'
import type { StreamrWeb3 } from '../../web3/web3Provider'
import { getUserData } from '../../modules/user/actions'
import {
    getDataPerUsd as getDataPerUsdAction,
    checkEthereumNetwork as checkEthereumNetworkAction,
    checkWeb3 as checkWeb3Action,
} from '../../modules/global/actions'
import { areAddressesEqual } from '../../utils/smartContract'
import { hasTransactionCompleted } from '../../utils/web3'
import {
    addTransaction as addTransactionAction,
    completeTransaction as completeTransactionAction,
    transactionError as transactionErrorAction,
    getTransactionsFromSessionStorage,
} from '../../modules/transactions/actions'
import TransactionError from '../../errors/TransactionError'

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
    checkEthereumNetwork: () => void,
    checkWeb3: () => void,
    addTransaction: (Hash, TransactionType) => void,
    completeTransaction: (Hash, Receipt) => void,
    transactionError: (Hash, TransactionError) => void,
}

type Props = OwnProps & StateProps & DispatchProps

const ONE_SECOND = 1000
const FIVE_SECONDS = 1000 * 5
const FIVE_MINUTES = 1000 * 60 * 5
const SIX_HOURS = 1000 * 60 * 60 * 6

export class GlobalInfoWatcher extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
        // Start polling for info
        this.pollDataPerUsdRate()
        this.pollLogin()
        this.pollWeb3(true)
        this.pollPendingTransactions()
        this.checkEthereumNetwork()
        this.checkWeb3()
    }

    componentWillUnmount = () => {
        this.clearWeb3Poll()
        this.clearDataPerUsdRatePoll()
        this.clearLoginPoll()
        this.clearPendingTransactionsPoll()
    }

    web3PollTimeout: ?TimeoutID = null
    pendingTransactionsPollTimeout: ?TimeoutID = null
    loginPollTimeout: ?TimeoutID = null
    dataPerUsdRatePollTimeout: ?TimeoutID = null
    web3: StreamrWeb3 = getWeb3()

    pollLogin = () => {
        this.props.getUserData()
        this.clearLoginPoll()
        this.loginPollTimeout = setTimeout(this.pollLogin, FIVE_MINUTES)
    }

    pollWeb3 = (initial: boolean = false) => {
        this.fetchWeb3Account(initial)
        this.clearWeb3Poll()
        this.web3PollTimeout = setTimeout(this.pollWeb3, ONE_SECOND)
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

    clearWeb3Poll = () => {
        if (this.web3PollTimeout) {
            clearTimeout(this.web3PollTimeout)
            this.web3PollTimeout = undefined
        }
    }

    clearPendingTransactionsPoll = () => {
        if (this.pendingTransactionsPollTimeout) {
            clearTimeout(this.pendingTransactionsPollTimeout)
            this.pendingTransactionsPollTimeout = undefined
        }
    }

    clearDataPerUsdRatePoll = () => {
        if (this.dataPerUsdRatePollTimeout) {
            clearTimeout(this.dataPerUsdRatePollTimeout)
            this.dataPerUsdRatePollTimeout = undefined
        }
    }

    //  MetaMask refreshes the browser when changing the network.
    //  Otherwise this should also be a poller.
    checkEthereumNetwork = () => {
        this.props.checkEthereumNetwork()
    }

    checkWeb3 = () => {
        this.props.checkWeb3()
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

    pollPendingTransactions = () => {
        this.handlePendingTransactions()
        this.clearPendingTransactionsPoll()
        this.pendingTransactionsPollTimeout = setTimeout(this.pollPendingTransactions, FIVE_SECONDS)
    }

    handlePendingTransactions = () => {
        const web3 = getPublicWeb3()
        Object.keys(getTransactionsFromSessionStorage())
            .forEach((txHash) => {
                // Get current number of confirmations and compare it with sought-for value
                hasTransactionCompleted(txHash)
                    .then((completed) => {
                        if (completed) {
                            web3.eth.getTransactionReceipt(txHash)
                                .then((receipt) => {
                                    if (receipt.status === true) {
                                        this.props.completeTransaction(txHash, receipt)
                                    } else {
                                        this.props.transactionError(txHash, new TransactionError(I18n.t('error.txFailed'), receipt))
                                    }
                                })
                        }
                    })
            })
    }

    fetchWeb3Account = (initial: boolean = false) => {
        this.web3.getDefaultAccount()
            .then((account) => {
                this.handleAccount(account, initial)

                // needed to avoid warnings about creating promise inside a handler
                // if any other web3 actions are dispatched.
                return Promise.resolve()
            }, (err) => {
                const { account: currentAccount } = this.props

                if (initial || currentAccount !== null) {
                    this.props.accountError(err)
                }
            })
    }

    handleAccount = (account: string, initial: boolean = false) => {
        const next = account
        const curr = this.props.account

        const didChange = curr && next && !areAddressesEqual(curr, next)
        const didDefine = !curr && next

        if (didDefine || (initial && next)) {
            this.props.receiveAccount(next)
        } else if (didChange) {
            this.props.changeAccount(next)
        }
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
    checkEthereumNetwork: () => dispatch(checkEthereumNetworkAction()),
    checkWeb3: () => dispatch(checkWeb3Action()),
    addTransaction: (id: Hash, type: TransactionType) => dispatch(addTransactionAction(id, type)),
    completeTransaction: (id: Hash, receipt: Receipt) => dispatch(completeTransactionAction(id, receipt)),
    transactionError: (id: Hash, error: TransactionError) => dispatch(transactionErrorAction(id, error)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GlobalInfoWatcher)
