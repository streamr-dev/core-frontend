// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import moment from 'moment'
import cx from 'classnames'
import copy from 'copy-to-clipboard'
import BN from 'bignumber.js'

import NoTransactionsView from './NoTransactions'
import Layout from '$userpages/components/Layout'
import { selectWeb3Accounts } from '$shared/modules/user/selectors'
import type { StoreState } from '$shared/flowtype/store-state'
import type { TransactionEntityList, Web3AccountList } from '$shared/flowtype/web3-types'
import type { ProductEntities } from '$mp/flowtype/product-types'
import { fetchLinkedWeb3Accounts } from '$shared/modules/user/actions'
import { getTransactionEvents, showEvents } from '$userpages/modules/transactionHistory/actions'
import { selectVisibleTransactions, selectTransactionEvents, selectOffset, selectFetching } from '$userpages/modules/transactionHistory/selectors'
import { selectEntities } from '$shared/modules/entities/selectors'
import { mapPriceFromContract } from '$mp/utils/product'
import Table from '$shared/components/Table'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import LoadMore from '$mp/components/LoadMore'
import ProductPageSpinner from '$mp/components/ProductPageSpinner'

import styles from './list.pcss'

type StateProps = {
    fetching: boolean,
    web3Accounts: ?Web3AccountList,
    transactions: ?TransactionEntityList,
    products: ProductEntities,
    hasMoreResults: boolean,
}

type DispatchProps = {
    getWeb3Accounts: () => void,
    getTransactionEvents: () => void,
    showEvents: () => void,
    copyToClipboard: (text: string) => void,
    openInEtherscan: (url: string) => void,
}

type Props = StateProps & DispatchProps

class TransactionList extends Component<Props> {
    componentDidMount() {
        this.props.getWeb3Accounts()
    }

    startSubscription = (accounts: ?Web3AccountList) => {
        if (!!accounts && accounts.length > 0) {
            this.props.getTransactionEvents()
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.web3Accounts !== this.props.web3Accounts) {
            this.startSubscription(nextProps.web3Accounts)
        }
    }

    render() {
        const { fetching, transactions, hasMoreResults } = this.props

        return (
            <Layout>
                <div className={cx('container', styles.transactionList)}>
                    {!fetching && transactions && transactions.length <= 0 && (
                        <NoTransactionsView />
                    )}
                    {transactions && transactions.length > 0 && (
                        <Table>
                            <thead>
                                <tr>
                                    <th><Translate value="userpages.transactions.list.name" /></th>
                                    <th><Translate value="userpages.transactions.list.type" /></th>
                                    <th><Translate value="userpages.transactions.list.transaction" /></th>
                                    <th><Translate value="userpages.transactions.list.when" /></th>
                                    <th><Translate value="userpages.transactions.list.value" /></th>
                                    <th><Translate value="userpages.transactions.list.gas" /></th>
                                    <th><Translate value="userpages.transactions.list.status" /></th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => {
                                    const productTitle = (transaction && transaction.productId && this.props.products[transaction.productId]) ?
                                        this.props.products[transaction.productId].name : '-'
                                    const price = BN(transaction.value)

                                    return (
                                        <tr key={transaction.id}>
                                            <Table.Th title={productTitle} noWrap>{productTitle}</Table.Th>
                                            <td>
                                                {!!transaction.type && (
                                                    <Translate value={`userpages.transactions.type.${transaction.type}`} />
                                                )}
                                            </td>
                                            <Table.Td title={transaction.id} noWrap>{transaction.id}</Table.Td>
                                            <td>{transaction.timestamp ? moment.unix(transaction.timestamp).fromNow() : '-'}</td>
                                            <td>
                                                {price.isGreaterThanOrEqualTo(0) ? '+' : ''}{mapPriceFromContract(price)} DATA
                                            </td>
                                            <td>{transaction.gasUsed} / {transaction.gasPrice}</td>
                                            <td>
                                                {!!transaction.state && (
                                                    <Translate value={`userpages.transactions.status.${transaction.state}`} />
                                                )}
                                            </td>
                                            <td>
                                                <DropdownActions
                                                    title={<Meatball alt={I18n.t('userpages.transactions.actions.title')} />}
                                                    noCaret
                                                >
                                                    <DropdownActions.Item onClick={() => this.props.openInEtherscan(transaction.id)}>
                                                        <Translate value="userpages.transactions.actions.viewOnEtherscan" />
                                                    </DropdownActions.Item>
                                                    <DropdownActions.Item onClick={() => this.props.copyToClipboard(transaction.id)}>
                                                        <Translate value="userpages.transactions.actions.copyTxHash" />
                                                    </DropdownActions.Item>
                                                </DropdownActions>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    )}
                    {fetching && (
                        <ProductPageSpinner className={styles.spinner} />
                    )}
                    {!fetching && (
                        <LoadMore
                            hasMoreSearchResults={hasMoreResults}
                            onClick={this.props.showEvents}
                        />
                    )}
                </div>
            </Layout>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    const offset = selectOffset(state)
    const events = selectTransactionEvents(state) || []

    return {
        transactions: selectVisibleTransactions(state),
        fetching: selectFetching(state),
        web3Accounts: selectWeb3Accounts(state),
        products: selectEntities(state).products,
        hasMoreResults: events.length > (offset + 10),
    }
}

const mapDispatchToProps = (dispatch: Function) => ({
    getWeb3Accounts: () => dispatch(fetchLinkedWeb3Accounts()),
    getTransactionEvents: () => dispatch(getTransactionEvents()),
    showEvents: () => dispatch(showEvents()),
    copyToClipboard: (text) => copy(text),
    openInEtherscan: (url: string) => {
        window.open(`https://rinkeby.etherscan.io/tx/${url}`, '_blank')
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList)
