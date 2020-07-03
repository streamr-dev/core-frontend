// @flow

import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'
import BN from 'bignumber.js'
import Helmet from 'react-helmet'
import { titleize } from '@streamr/streamr-layout'

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
import { truncate } from '$shared/utils/text'
import Notification from '$shared/utils/Notification'
import { formatDecimals } from '$mp/utils/price'
import { transactionTypes, paymentCurrencies, NotificationIcon } from '$shared/utils/constants'
import { fromAtto } from '$mp/utils/math'
import routes from '$routes'

import styles from './list.pcss'

const TransactionList = () => {
    const dispatch = useDispatch()

    const accountId = useAccountAddress()
    const { copy } = useCopy()
    const { load: loadEthIdentities, isLinked, ethereumIdentities } = useEthereumIdentities()

    const copyToClipboard = useCallback((text) => {
        copy(text)

        Notification.push({
            title: I18n.t('userpages.transactions.actions.txHashCopied'),
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

    const offset = useSelector(selectOffset)
    const events = useSelector(selectTransactionEvents) || []
    const transactions = useSelector(selectVisibleTransactions)
    const fetchingTransactions = useSelector(selectFetchingTransactions)
    const fetchingProducts = useSelector(selectFetchingProducts)
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

    const isLoading = !!(fetchingTransactions || fetchingProducts)
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
                            {transactions.map(({
                                id,
                                productId,
                                hash,
                                timestamp,
                                gasUsed,
                                gasPrice,
                                state,
                                type,
                                value,
                                paymentValue,
                                paymentCurrency,
                            }) => {
                                const productTitle = (id && productId && products[productId]) ?
                                    products[productId].name : '-'
                                const price = BN(value)

                                return (
                                    <tr key={id}>
                                        <Table.Th title={productTitle} noWrap>{productTitle}</Table.Th>
                                        <Table.Td title={type} noWrap>
                                            {!!type && (
                                                <Translate value={`userpages.transactions.type.${type}`} />
                                            )}
                                        </Table.Td>
                                        <Table.Td title={hash} noWrap>
                                            {truncate(hash, { maxLength: 15 })}
                                        </Table.Td>
                                        <Table.Td noWrap>{timestamp ? titleize(ago(new Date(timestamp))) : '-'}</Table.Td>
                                        <Table.Td noWrap>
                                            {type === transactionTypes.PURCHASE ? '-' : '+'}
                                            {(paymentCurrency === paymentCurrencies.ETH || paymentCurrency === paymentCurrencies.DAI) && (
                                                <React.Fragment>
                                                    {formatDecimals(fromAtto(price), paymentCurrencies.DATA)} DATA
                                                    ({paymentValue && paymentCurrency && (
                                                        `${formatDecimals(fromAtto(paymentValue), paymentCurrency)} ${paymentCurrency}`
                                                    )})
                                                </React.Fragment>
                                            )}
                                            {(paymentCurrency !== paymentCurrencies.ETH && paymentCurrency !== paymentCurrencies.DAI) && (
                                                `${formatDecimals(fromAtto(price), paymentCurrencies.DATA)} DATA`
                                            )}
                                        </Table.Td>
                                        <Table.Td noWrap>{gasUsed} / {gasPrice}</Table.Td>
                                        <Table.Td noWrap>
                                            {!!state && (
                                                <Translate value={`userpages.transactions.status.${state}`} />
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
                                                <DropdownActions.Item onClick={() => openInEtherscan(hash)}>
                                                    <Translate value="userpages.transactions.actions.viewOnEtherscan" />
                                                </DropdownActions.Item>
                                                <DropdownActions.Item onClick={() => copyToClipboard(hash)}>
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
