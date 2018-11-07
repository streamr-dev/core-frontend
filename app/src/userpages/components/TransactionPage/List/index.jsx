// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'

import NoTransactionsView from './NoTransactions'
import Layout from '$userpages/components/Layout'
import { selectWeb3Accounts } from '$shared/modules/user/selectors'
import type { StoreState } from '$shared/flowtype/store-state'
import type { Receipt, Hash, HashList, TransactionEntityList, Web3AccountList } from '$shared/flowtype/web3-types'
import { fetchLinkedWeb3Accounts } from '$shared/modules/user/actions'
import { getTransactions } from '$userpages/modules/transactionHistory/actions'
import { getPublicWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'
import TransactionError from '$shared/errors/TransactionError'
import {
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
    completeTransaction: (Hash, Receipt, TransactionType) => void,
    transactionError: (Hash, TransactionError, TransactionType) => void,
}

type Props = StateProps & DispatchProps

class TransactionList extends Component<Props> {
    componentDidMount() {
        this.props.getWeb3Accounts()
    }

    subscription = null

    startSubscription = (accounts: ?Web3AccountList) => {
        if (!!accounts && accounts.length > 0) {
            const addresses = accounts.map((account) => account.address.toLowerCase())
            const web3 = getPublicWeb3()
            const config = getConfig().marketplace
            const marketPlaceContract = new web3.eth.Contract(config.abi, config.address)
            const params = {
                fromBlock: 1,
            }

            marketPlaceContract.getPastEvents('ProductCreated', params, (error, result) => {
                if (!error) {
                    this.processEvents(result, addresses, transactionTypes.CREATE_CONTRACT_PRODUCT)
                }
            })
        }
    }

    processEvents = (events, addresses, type) => {
        if (events && events.length && addresses) {
            const web3 = getPublicWeb3()
            events.forEach((event) => {
                web3.eth.getTransactionReceipt(event.transactionHash)
                    .then((receipt) => {
                        if (receipt) {
                            if (addresses.indexOf(receipt.from.toLowerCase()) >= 0) {
                                if (receipt.status === true) {
                                    this.props.completeTransaction(
                                        event.transactionHash,
                                        receipt,
                                        type,
                                    )
                                } else {
                                    this.props.transactionError(
                                        event.transactionHash,
                                        new TransactionError(I18n.t('error.txFailed'), receipt),
                                        type,
                                    )
                                }
                            }
                        }
                    })
            })
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
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
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
    completeTransaction: (id: Hash, receipt: Receipt, type: TransactionType) => dispatch(completeTransactionAction(id, receipt, type, false)),
    transactionError: (id: Hash, error: TransactionError, type: TransactionType) => dispatch(transactionErrorAction(id, error, type, false)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList)
