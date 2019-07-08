// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import moment from 'moment'
import cx from 'classnames'
import copy from 'copy-to-clipboard'
import BN from 'bignumber.js'
import Helmet from 'react-helmet'

import NoTransactionsView from './NoTransactions'
import Layout from '$userpages/components/Layout'
import { selectEthereumIdentities } from '$shared/modules/integrationKey/selectors'
import type { StoreState } from '$shared/flowtype/store-state'
import type { TransactionEntityList, Address } from '$shared/flowtype/web3-types'
import type { IntegrationKeyList } from '$shared/flowtype/integration-key-types'
import type { ProductEntities } from '$mp/flowtype/product-types'
import { fetchIntegrationKeys } from '$shared/modules/integrationKey/actions'
import { getTransactionEvents, showEvents, clearTransactionList, noTransactionResults } from '$userpages/modules/transactionHistory/actions'
import { selectVisibleTransactions, selectTransactionEvents, selectOffset, selectFetching } from '$userpages/modules/transactionHistory/selectors'
import { selectEntities } from '$shared/modules/entities/selectors'
import { mapPriceFromContract } from '$mp/utils/product'
import Table from '$shared/components/Table'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import LoadMore from '$mp/components/LoadMore'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import { selectAccountId } from '$mp/modules/web3/selectors'
import { areAddressesEqual } from '$mp/utils/smartContract'

import styles from './list.pcss'

type StateProps = {
    fetching: boolean,
    web3Accounts: ?IntegrationKeyList,
    transactions: ?TransactionEntityList,
    products: ProductEntities,
    hasMoreResults: boolean,
    accountId: ?Address,
}

type DispatchProps = {
    clearTransactionList: () => void,
    noTransactionResults: () => void,
    getWeb3Accounts: () => void,
    getTransactionEvents: () => void,
    showEvents: () => void,
    copyToClipboard: (text: string) => void,
    openInEtherscan: (url: string) => void,
}

type Props = StateProps & DispatchProps

class TransactionList extends Component<Props> {
    async componentDidMount() {
        this.props.clearTransactionList()
        await this.props.getWeb3Accounts()
        await this.startSubscription()
    }

    startSubscription = () => {
        const { web3Accounts, getTransactionEvents, noTransactionResults } = this.props
        if (web3Accounts) {
            if (web3Accounts.length > 0) {
                getTransactionEvents()
            } else {
                noTransactionResults()
            }
        }
    }

    render() {
        const {
            fetching,
            transactions,
            hasMoreResults,
            web3Accounts,
            accountId,
        } = this.props
        const accountsExist = !!(web3Accounts && web3Accounts.length)
        const accountLinked = !!(web3Accounts &&
            accountId &&
            web3Accounts.find((account) =>
                account.json && account.json.address && areAddressesEqual(account.json.address, accountId))
        )

        return (
            <Layout
                loading={fetching}
                headerSearchComponent={
                    <div className={styles.searchPlaceholder} />
                }
            >
                <Helmet title={`Streamr Core | ${I18n.t('userpages.title.transactions')}`} />
                <div className={cx('container', styles.transactionList)}>
                    {!fetching && transactions && transactions.length <= 0 && (
                        <NoTransactionsView
                            accountsExist={accountsExist}
                            accountLinked={accountLinked}
                        />
                    )}
                    {transactions && transactions.length > 0 && (
                        <Table className={cx({
                            [styles.loadingMore]: !!(hasMoreResults && fetching),
                        })}
                        >
                            <thead>
                                <tr>
                                    <th><Translate value="userpages.transactions.list.name" /></th>
                                    <th><Translate value="userpages.transactions.list.type" /></th>
                                    <th><Translate value="userpages.transactions.list.transaction" /></th>
                                    <th><Translate value="userpages.transactions.list.when" /></th>
                                    <th><Translate value="userpages.transactions.list.value" /></th>
                                    <th><Translate value="userpages.transactions.list.gas" /></th>
                                    <th><Translate value="userpages.transactions.list.status" /></th>
                                    <th className={styles.menuColumn} />
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
                                            <Table.Td title={transaction.type} noWrap>
                                                {!!transaction.type && (
                                                    <Translate value={`userpages.transactions.type.${transaction.type}`} />
                                                )}
                                            </Table.Td>
                                            <Table.Td title={transaction.hash} noWrap>{transaction.hash}</Table.Td>
                                            <Table.Td noWrap>{transaction.timestamp ? moment.unix(transaction.timestamp).fromNow() : '-'}</Table.Td>
                                            <Table.Td noWrap>
                                                {price.isGreaterThanOrEqualTo(0) ? '+' : ''}{mapPriceFromContract(price)} DATA
                                            </Table.Td>
                                            <Table.Td noWrap>{transaction.gasUsed} / {transaction.gasPrice}</Table.Td>
                                            <Table.Td noWrap>
                                                {!!transaction.state && (
                                                    <Translate value={`userpages.transactions.status.${transaction.state}`} />
                                                )}
                                            </Table.Td>
                                            <Table.Td className={styles.menuColumn}>
                                                <DropdownActions
                                                    title={<Meatball alt={I18n.t('userpages.transactions.actions.title')} />}
                                                    noCaret
                                                    menuProps={{
                                                        modifiers: {
                                                            offset: {
                                                                // Make menu aligned to the right.
                                                                // See https://popper.js.org/popper-documentation.html#modifiers..offset
                                                                offset: '-100%p + 100%',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <DropdownActions.Item onClick={() => this.props.openInEtherscan(transaction.hash)}>
                                                        <Translate value="userpages.transactions.actions.viewOnEtherscan" />
                                                    </DropdownActions.Item>
                                                    <DropdownActions.Item onClick={() => this.props.copyToClipboard(transaction.hash)}>
                                                        <Translate value="userpages.transactions.actions.copyTxHash" />
                                                    </DropdownActions.Item>
                                                </DropdownActions>
                                            </Table.Td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    )}
                    {!fetching && (
                        <LoadMore
                            hasMoreSearchResults={hasMoreResults}
                            onClick={this.props.showEvents}
                        />
                    )}
                </div>
                <DocsShortcuts />
            </Layout>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    const offset = selectOffset(state)
    const events = selectTransactionEvents(state) || []

    return {
        accountId: selectAccountId(state),
        transactions: selectVisibleTransactions(state),
        fetching: selectFetching(state),
        web3Accounts: selectEthereumIdentities(state),
        products: selectEntities(state).contractProducts,
        hasMoreResults: events.length > 0 && events.length > (offset + 10),
    }
}

const mapDispatchToProps = (dispatch: Function) => ({
    noTransactionResults: () => dispatch(noTransactionResults()),
    clearTransactionList: () => dispatch(clearTransactionList()),
    getWeb3Accounts: () => dispatch(fetchIntegrationKeys()),
    getTransactionEvents: () => dispatch(getTransactionEvents()),
    showEvents: () => dispatch(showEvents()),
    copyToClipboard: (text) => copy(text),
    openInEtherscan: (url: string) => {
        window.open(`https://rinkeby.etherscan.io/tx/${url}`, '_blank')
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList)
