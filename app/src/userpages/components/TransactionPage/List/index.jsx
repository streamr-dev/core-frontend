// @flow

import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'
import BN from 'bignumber.js'
import Helmet from 'react-helmet'

import NoTransactionsView from './NoTransactions'
import Layout from '$userpages/components/Layout'
import * as transactionActions from '$userpages/modules/transactionHistory/actions'
import {
    selectVisibleTransactions,
    selectTransactionEvents,
    selectOffset,
    selectFetching as selectFetchingTransactions,
} from '$userpages/modules/transactionHistory/selectors'
import { selectFetching as selectFetchingProducts } from '$mp/modules/myProductList/selectors'
import { selectEntities } from '$shared/modules/entities/selectors'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import { mapPriceFromContract } from '$mp/utils/product'
import Table from '$shared/components/Table'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import LoadMore from '$mp/components/LoadMore'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import { ago } from '$shared/utils/time'
import useAccountAddress from '$shared/hooks/useAccountAddress'
import useCopy from '$shared/hooks/useCopy'
import useEthereumIdentities from '$shared/modules/integrationKey/hooks/useEthereumIdentities'
import routes from '$routes'

import styles from './list.pcss'

const TransactionList = () => {
    const dispatch = useDispatch()

    const accountId = useAccountAddress()
    const { copy: copyToClipboard } = useCopy()
    const { load: loadEthIdentities, isLinked, ethereumIdentities } = useEthereumIdentities()

    const offset = useSelector(selectOffset)
    const events = useSelector(selectTransactionEvents) || []
    const transactions = useSelector(selectVisibleTransactions)
    const fetchingTransactions = useSelector(selectFetchingTransactions)
    const fetchingProducs = useSelector(selectFetchingProducts)
    const { contractProducts: products } = useSelector(selectEntities)
    const hasMoreResults = events.length > 0 && events.length > (offset + 10)

    const clearTransactionList = useCallback(() => dispatch(transactionActions.clearTransactionList()), [dispatch])
    const getTransactionEvents = useCallback(() => dispatch(transactionActions.getTransactionEvents()), [dispatch])
    const showEvents = useCallback(() => dispatch(transactionActions.showEvents()), [dispatch])
    const openInEtherscan = useCallback((tx: string) => {
        window.open(routes.etherscanTransaction({
            tx,
        }), '_blank')
    }, [])

    const loadProducts = useCallback(() => dispatch(getMyProducts({
        id: '',
    })), [dispatch])

    useEffect(() => {
        clearTransactionList()

        Promise.all([
            loadEthIdentities(),
            loadProducts(),
        ])
            .then(getTransactionEvents)
    }, [clearTransactionList, loadEthIdentities, loadProducts, getTransactionEvents])

    const accountsExist = useMemo(() => !!(ethereumIdentities && ethereumIdentities.length), [ethereumIdentities])
    const accountLinked = useMemo(() => !!(accountId && isLinked(accountId)), [isLinked, accountId])

    const isLoading = !!(fetchingTransactions || fetchingProducs)
    return (
        <Layout
            loading={isLoading}
            headerSearchComponent={
                <div className={styles.searchPlaceholder} />
            }
        >
            <Helmet title={`Streamr Core | ${I18n.t('userpages.title.transactions')}`} />
            <ListContainer className={styles.transactionList}>
                {!isLoading && transactions && transactions.length <= 0 && (
                    <NoTransactionsView
                        accountsExist={accountsExist}
                        accountLinked={accountLinked}
                    />
                )}
                {transactions && transactions.length > 0 && (
                    <Table className={cx({
                        [styles.loadingMore]: !!(hasMoreResults && fetchingTransactions),
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
                                const productTitle = (transaction && transaction.productId && products[transaction.productId]) ?
                                    products[transaction.productId].name : '-'
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
                                        <Table.Td noWrap>{transaction.timestamp ? ago(new Date(transaction.timestamp)) : '-'}</Table.Td>
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
                                                <DropdownActions.Item onClick={() => openInEtherscan(transaction.hash)}>
                                                    <Translate value="userpages.transactions.actions.viewOnEtherscan" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item onClick={() => copyToClipboard(transaction.hash)}>
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
                {!fetchingTransactions && (
                    <LoadMore
                        hasMoreSearchResults={hasMoreResults}
                        onClick={showEvents}
                    />
                )}
            </ListContainer>
            <DocsShortcuts />
        </Layout>
    )
}

export default TransactionList
