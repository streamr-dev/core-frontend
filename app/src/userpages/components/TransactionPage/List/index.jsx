// @flow

import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import BN from 'bignumber.js'
import { titleize } from '@streamr/streamr-layout'
import styled from 'styled-components'

import { CoreHelmet } from '$shared/components/Helmet'
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
import Popover from '$shared/components/Popover'
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
import { TransactionList as TransactionListComponent } from '$shared/components/List'
import StatusIcon from '$shared/components/StatusIcon'
import { MD, LG } from '$shared/utils/styled'

const StyledListContainer = styled(ListContainer)`
    && {
        padding: 0;
        margin-bottom: 4em;
    }

    @media (min-width: ${MD}px) {
        && {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
    }

    @media (min-width: ${LG}px) {
        && {
            margin-bottom: 0;
        }
    }
`

const SearchPlaceholder = styled.div`
    width: var(--um);
`

const mapState = (state) => {
    switch (state) {
        case 'ok':
            return StatusIcon.OK
        case 'error':
            return StatusIcon.ERROR
        default:
            return StatusIcon.INACTIVE
    }
}

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
                <SearchPlaceholder />
            }
        >
            <CoreHelmet title={I18n.t('userpages.title.transactions')} />
            <StyledListContainer>
                {!isLoading && transactions && transactions.length <= 0 && (
                    <NoTransactionsView
                        accountsExist={accountsExist}
                        accountLinked={accountLinked}
                    />
                )}
                {transactions && transactions.length > 0 && (
                    <TransactionListComponent>
                        <TransactionListComponent.Header>
                            <TransactionListComponent.HeaderItem>
                                <Translate value="userpages.transactions.list.name" />
                            </TransactionListComponent.HeaderItem>
                            <TransactionListComponent.HeaderItem>
                                <Translate value="userpages.transactions.list.type" />
                            </TransactionListComponent.HeaderItem>
                            <TransactionListComponent.HeaderItem>
                                <Translate value="userpages.transactions.list.transaction" />
                            </TransactionListComponent.HeaderItem>
                            <TransactionListComponent.HeaderItem>
                                <Translate value="userpages.transactions.list.when" />
                            </TransactionListComponent.HeaderItem>
                            <TransactionListComponent.HeaderItem>
                                <Translate value="userpages.transactions.list.value" />
                            </TransactionListComponent.HeaderItem>
                            <TransactionListComponent.HeaderItem>
                                <Translate value="userpages.transactions.list.gas" />
                            </TransactionListComponent.HeaderItem>
                            <TransactionListComponent.HeaderItem center>
                                <Translate value="userpages.transactions.list.status" />
                            </TransactionListComponent.HeaderItem>
                        </TransactionListComponent.Header>
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
                            const eventType = (!!type && I18n.t(`userpages.transactions.type.${type}`)) || ''
                            const price = BN(value)
                            const pricePrefix = type === transactionTypes.SUBSCRIPTION ? '-' : '+'

                            let displayPrice = ''
                            let displayPayment = ''
                            if (paymentCurrency === paymentCurrencies.ETH || paymentCurrency === paymentCurrencies.DAI) {
                                displayPrice = `${formatDecimals(fromAtto(price), paymentCurrencies.DATA)} DATA`

                                if (paymentValue && paymentCurrency) {
                                    displayPayment = `${formatDecimals(fromAtto(paymentValue), paymentCurrency)} ${paymentCurrency}`
                                }
                            } else {
                                displayPrice = `${formatDecimals(fromAtto(price), paymentCurrencies.DATA)} DATA`
                            }

                            return (
                                <TransactionListComponent.Row
                                    key={id}
                                    id={id}
                                >
                                    <TransactionListComponent.Title
                                        /* eslint-disable-next-line max-len */
                                        description={`${eventType} ${pricePrefix}${displayPrice}${displayPayment} (gas: ${gasUsed} / ${gasPrice})`}
                                        moreInfo={timestamp ? titleize(ago(new Date(timestamp))) : '-'}
                                    >
                                        {productTitle}
                                    </TransactionListComponent.Title>
                                    <TransactionListComponent.Item>
                                        {eventType}
                                    </TransactionListComponent.Item>
                                    <TransactionListComponent.Item title={hash}>
                                        {truncate(hash, { maxLength: 15 })}
                                    </TransactionListComponent.Item>
                                    <TransactionListComponent.Item>
                                        {timestamp ? titleize(ago(new Date(timestamp))) : '-'}
                                    </TransactionListComponent.Item>
                                    <TransactionListComponent.Item>
                                        {pricePrefix}
                                        {displayPrice}
                                        {displayPayment}
                                    </TransactionListComponent.Item>
                                    <TransactionListComponent.Item>
                                        {gasUsed} / {gasPrice}
                                    </TransactionListComponent.Item>
                                    <TransactionListComponent.Item>
                                        <StatusIcon
                                            status={mapState(state)}
                                            tooltip={I18n.t(`userpages.transactions.status.${state}`)}
                                        />
                                    </TransactionListComponent.Item>
                                    <TransactionListComponent.Actions>
                                        <Popover
                                            title={I18n.t('userpages.transactions.actions.title')}
                                            type="meatball"
                                            menuProps={{
                                                right: true,
                                            }}
                                            noCaret
                                        >
                                            <Popover.Item onClick={() => openInEtherscan(hash)}>
                                                <Translate value="userpages.transactions.actions.viewOnEtherscan" />
                                            </Popover.Item>
                                            <Popover.Item onClick={() => copyToClipboard(hash)}>
                                                <Translate value="userpages.transactions.actions.copyTxHash" />
                                            </Popover.Item>
                                        </Popover>
                                    </TransactionListComponent.Actions>
                                </TransactionListComponent.Row>
                            )
                        })}
                    </TransactionListComponent>
                )}
                {!fetchingTransactions && (
                    <LoadMore
                        hasMoreSearchResults={hasMoreResults}
                        onClick={showEvents}
                        preserveSpace
                    />
                )}
            </StyledListContainer>
            <DocsShortcuts />
        </Layout>
    )
}

export default TransactionList
