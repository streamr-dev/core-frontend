// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import moment from 'moment'
import cx from 'classnames'

import NoTransactionsView from './NoTransactions'
import Layout from '$userpages/components/Layout'
import { selectWeb3Accounts } from '$shared/modules/user/selectors'
import type { StoreState } from '$shared/flowtype/store-state'
import type { TransactionEntityList, Web3AccountList } from '$shared/flowtype/web3-types'
import type { ProductEntities } from '$mp/flowtype/product-types'
import { fetchLinkedWeb3Accounts } from '$shared/modules/user/actions'
import { getTransactionEvents, showEvents } from '$userpages/modules/transactionHistory/actions'
import { selectVisibleTransactions, selectFetching } from '$userpages/modules/transactionHistory/selectors'
import { selectEntities } from '$shared/modules/entities/selectors'
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
}

type DispatchProps = {
    getWeb3Accounts: () => void,
    getTransactionEvents: () => void,
    showEvents: (number) => void,
}

type Props = StateProps & DispatchProps

type State = {
    visibleEvents: number,
}

class TransactionList extends Component<Props, State> {
    state = {
        visibleEvents: 10,
    }

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
        const { fetching, transactions } = this.props

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
                                    const productTitle = (transaction.productId && this.props.products[transaction.productId]) ?
                                        this.props.products[transaction.productId].name : '-'

                                    return (
                                        <tr key={transaction.id}>
                                            <Table.Th title={productTitle} noWrap>{productTitle}</Table.Th>
                                            <td>{transaction.type}</td>
                                            <Table.Td title={transaction.id} noWrap>{transaction.id}</Table.Td>
                                            <td>{transaction.timestamp ? moment.unix(transaction.timestamp).fromNow() : '-'}</td>
                                            <td>{transaction.value}</td>
                                            <td>{transaction.gasUsed} / {transaction.gasPrice}</td>
                                            <td>{transaction.state}</td>
                                            <td>
                                                <DropdownActions
                                                    title={<Meatball alt={I18n.t('userpages.transactions.actions')} />}
                                                    noCaret
                                                >
                                                    <DropdownActions.Item onClick={() => {}}>
                                                        <Translate value="userpages.transactions.actions.viewOnEtherscan" />
                                                    </DropdownActions.Item>
                                                    <DropdownActions.Item onClick={() => {}}>
                                                        <Translate value="userpages.transactions.actions.copyId" />
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
                            hasMoreSearchResults
                            onClick={() => {
                                this.setState({
                                    visibleEvents: this.state.visibleEvents + 10,
                                }, () => {
                                    this.props.showEvents(this.state.visibleEvents)
                                })
                            }}
                        />
                    )}
                </div>
            </Layout>
        )
    }
}

const mapStateToProps = (state: StoreState) => ({
    transactions: selectVisibleTransactions(state),
    fetching: selectFetching(state),
    web3Accounts: selectWeb3Accounts(state),
    products: selectEntities(state).products,
})

const mapDispatchToProps = (dispatch: Function) => ({
    getWeb3Accounts: () => dispatch(fetchLinkedWeb3Accounts()),
    getTransactionEvents: () => dispatch(getTransactionEvents()),
    showEvents: (amount: number) => dispatch(showEvents(amount)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList)
