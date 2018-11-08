// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import abiDecoder from 'abi-decoder'
import moment from 'moment'

import NoTransactionsView from './NoTransactions'
import Layout from '$userpages/components/Layout'
import { selectWeb3Accounts } from '$shared/modules/user/selectors'
import type { StoreState } from '$shared/flowtype/store-state'
import type { Receipt, Hash, HashList, TransactionEntityList, Web3AccountList } from '$shared/flowtype/web3-types'
import { fetchLinkedWeb3Accounts } from '$shared/modules/user/actions'
import { getTransactions } from '$userpages/modules/transactionHistory/actions'
import { getPublicWeb3 } from '$shared/web3/web3Provider'
import TransactionError from '$shared/errors/TransactionError'
import {
    addTransaction as addTransactionAction,
    completeTransaction as completeTransactionAction,
    transactionError as transactionErrorAction,
} from '$mp/modules/transactions/actions'
import { transactionTypes } from '$shared/utils/constants'
import type { TransactionType } from '$shared/flowtype/common-types'
import { selectPendingTransactions, selectCompletedTransactions } from '$mp/modules/transactions/selectors'
import Table from '$shared/components/Table'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'

type StateProps = {
    fetching: boolean,
    transactions: TransactionEntityList,
    web3Accounts: ?Web3AccountList,
    transactions: ?TransactionEntityList,
}

type DispatchProps = {
    getTransactions: (Hash | HashList) => void,
    getWeb3Accounts: () => void,
    addTransaction: (Hash, TransactionType) => void,
    completeTransaction: (Hash, Receipt, Object) => void,
    transactionError: (Hash, TransactionError, Object) => void,
}

type Props = StateProps & DispatchProps

class TransactionList extends Component<Props> {
    componentDidMount() {
        this.props.getWeb3Accounts()
    }

    startSubscription = (accounts: ?Web3AccountList) => {
        if (!!accounts && accounts.length > 0) {
            const addresses = accounts.map((account) => account.address.toLowerCase())
            const web3 = getPublicWeb3()

            web3.eth.getBlockNumber()
                .then((blockNumber) => {
                    this.processBlock(blockNumber, addresses)
                })
        }
    }

    processBlock = (blockNumber, addresses) => {
        const endBlock = 3301099
        let continueProcessing = false
        const web3 = getPublicWeb3()

        web3.eth.getBlock(blockNumber)
            .then((block) => {
                if (block) {
                    if (moment.duration(moment().diff(moment.unix(block.timestamp))).asDays() <= 30) {
                        continueProcessing = true

                        if (block.transactions) {
                            const txPromises = []
                            block.transactions.forEach((txHash) => {
                                // this.processTransaction(txHash, addresses)
                                txPromises.push(web3.eth.getTransaction(txHash))
                            })
                            Promise.all(txPromises)
                                .then(([...txs]) => {
                                    txs.forEach((tx) => {
                                        console.log(tx)
                                        // If it belongs to the user, get the receipt and the block (for timestamp).
                                        if (tx && addresses.indexOf(tx.from.toLowerCase()) >= 0) {
                                            console.log(tx.hash)
                                        }
                                    })
                                })
                        }
                    }
                }

                if (continueProcessing && blockNumber > endBlock) {
                    this.processBlock(blockNumber - 1, addresses)
                }
            })
    }

    processEvents = (events, addresses, type) => {
        if (events && events.length && addresses) {
            const web3 = getPublicWeb3()
            events.forEach((event) => {
                // Get the transaction object first and see if it belongs to the user
                web3.eth.getTransaction(event.transactionHash)
                    .then((tx) => {
                        // If it belongs to the user, get the receipt and the block (for timestamp).
                        if (tx && addresses.indexOf(tx.from.toLowerCase()) >= 0) {
                            this.props.addTransaction(tx.hash, type)

                            Promise.all([
                                web3.eth.getTransactionReceipt(event.transactionHash),
                                web3.eth.getBlock(event.blockHash),
                            ])
                                .then(([receipt, block]) => {
                                    if (receipt) {
                                        if (addresses.indexOf(receipt.from.toLowerCase()) >= 0) {
                                            const properties = {
                                                value: this.getInputValue(type, tx.input),
                                                gasUsed: receipt.gasUsed,
                                                gasPrice: tx.gas,
                                                timestamp: block.timestamp,
                                            }

                                            if (receipt.status === true) {
                                                this.props.completeTransaction(
                                                    event.transactionHash,
                                                    receipt,
                                                    properties,
                                                )
                                            } else {
                                                this.props.transactionError(
                                                    event.transactionHash,
                                                    new TransactionError(I18n.t('error.txFailed'), receipt),
                                                    properties,
                                                )
                                            }
                                        }
                                    }
                                })
                        }
                    })
            })
        }
    }

    getInputValue = (type, input) => {
        const inputValues = abiDecoder.decodeMethod(input)

        switch (type) {
            case transactionTypes.PURCHASE:
                return inputValues.params[1].value
            case transactionTypes.CREATE_CONTRACT_PRODUCT:
                return inputValues.params[3].value
            default:
                return null
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.web3Accounts !== this.props.web3Accounts) {
            this.startSubscription(nextProps.web3Accounts)
        }
    }

    render() {
        const { fetching, transactions } = this.props

        return (
            <Layout>
                <div className="container">
                    {!fetching && transactions && transactions.length <= 0 && (
                        <NoTransactionsView />
                    )}
                    {!fetching && transactions && transactions.length > 0 && (
                        <Table>
                            <thead>
                                <tr>
                                    <th><Translate value="userpages.transactions.list.name" /></th>
                                    <th><Translate value="userpages.transactions.list.description" /></th>
                                    <th><Translate value="userpages.transactions.list.transaction" /></th>
                                    <th><Translate value="userpages.transactions.list.when" /></th>
                                    <th><Translate value="userpages.transactions.list.value" /></th>
                                    <th><Translate value="userpages.transactions.list.gas" /></th>
                                    <th><Translate value="userpages.transactions.list.status" /></th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <th>-</th>
                                        <td>{transaction.type}</td>
                                        <Table.Td title={transaction.id} noWrap>{transaction.id}</Table.Td>
                                        <td>{transaction.timestamp ? new Date(transaction.timestamp * 1000).toLocaleDateString() : '-'}</td>
                                        <td>{transaction.value}</td>
                                        <td>{transaction.gasUsed} / {transaction.gasPrice}</td>
                                        <td>{transaction.state}</td>
                                        <td>
                                            <DropdownActions
                                                title={<Meatball alt={I18n.t('userpages.streams.actions')} />}
                                                noCaret
                                            >
                                                <DropdownActions.Item>
                                                    <Translate value="userpages.streams.actions.addToCanvas" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item onClick={() => {}}>
                                                    <Translate value="userpages.streams.actions.editStream" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item onClick={() => {}}>
                                                    <Translate value="userpages.streams.actions.copyId" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item>
                                                    <Translate value="userpages.streams.actions.copySnippet" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item>
                                                    <Translate value="userpages.streams.actions.share" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item>
                                                    <Translate value="userpages.streams.actions.refresh" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item>
                                                    <Translate value="userpages.streams.actions.delete" />
                                                </DropdownActions.Item>
                                            </DropdownActions>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            </Layout>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    const pending = selectPendingTransactions(state) || []
    const completed = selectCompletedTransactions(state) || []

    return {
        transactions: [...pending, ...completed],
        fetching: false,
        web3Accounts: selectWeb3Accounts(state),
    }
}

const mapDispatchToProps = (dispatch: Function) => ({
    getTransactions: (address: Hash | HashList) => dispatch(getTransactions(address)),
    getWeb3Accounts: () => dispatch(fetchLinkedWeb3Accounts()),
    addTransaction: (id: Hash, type: TransactionType) => dispatch(addTransactionAction(id, type, false)),
    completeTransaction: (id: Hash, receipt: Receipt, properties: Object) => dispatch(completeTransactionAction(id, receipt, properties, false)),
    transactionError: (id: Hash, error: TransactionError, properties: Object) => dispatch(transactionErrorAction(id, error, properties, false)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList)
