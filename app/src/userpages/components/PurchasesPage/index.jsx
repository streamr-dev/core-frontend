// @flow

import React, { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'

import Layout from '../Layout'
import links from '../../../links'
import { getFilters } from '../../utils/constants'
import { getMyPurchases, updateFilter, applyFilter } from '$mp/modules/myPurchaseList/actions'
import { selectMyPurchaseList, selectSubscriptions, selectFetchingMyPurchaseList } from '$mp/modules/myPurchaseList/selectors'
import Tile from '$shared/components/Tile'
import { isActive } from '$mp/utils/time'
import Search from '../Header/Search'
import Dropdown from '$shared/components/Dropdown'
import NoPurchasesView from './NoPurchases'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import TileGrid from '$shared/components/TileGrid'
import { isDataUnionProduct } from '$mp/utils/product'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useMemberStats from '$mp/modules/dataUnion/hooks/useMemberStats'

import type { ProductSubscription } from '$mp/flowtype/product-types'

import styles from './purchases.pcss'

const isSubscriptionActive = (subscription?: ProductSubscription): boolean => isActive((subscription && subscription.endsAt) || '')

const PurchasesPage = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters()
        return [
            filters.NAME_ASC,
            filters.NAME_DESC,
            filters.ACTIVE,
            filters.EXPIRED,
        ]
    }, [])
    const {
        defaultFilter,
        filter,
        setSearch,
        setSort,
        resetFilter,
    } = useFilterSort(sortOptions)
    const purchases = useSelector(selectMyPurchaseList)
    const subscriptions = useSelector(selectSubscriptions)
    const fetching = useSelector(selectFetchingMyPurchaseList)
    const dispatch = useDispatch()

    const { load: loadDataUnionStats, members, fetching: fetchingDataUnionStats } = useMemberStats()

    useEffect(() => {
        dispatch(updateFilter(filter))
        dispatch(getMyPurchases())
            .then(() => {
                dispatch(applyFilter())
            })
    }, [dispatch, filter])

    useEffect(() => {
        loadDataUnionStats()
    }, [loadDataUnionStats])

    return (
        <Layout
            headerSearchComponent={
                <Search
                    placeholder={I18n.t('userpages.purchases.filterPurchases')}
                    value={(filter && filter.search) || ''}
                    onChange={setSearch}
                    debounceTime={0}
                />
            }
            headerFilterComponent={
                <Dropdown
                    title={I18n.t('userpages.filter.sortBy')}
                    onChange={setSort}
                    selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                >
                    {sortOptions.map((s) => (
                        <Dropdown.Item key={s.filter.id} value={s.filter.id}>
                            {s.displayName}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            }
            loading={fetching}
        >
            <Helmet title={`Streamr Core | ${I18n.t('userpages.title.purchases')}`} />
            <ListContainer className={styles.corepageContentContainer} >
                {!fetching && purchases && !purchases.length && (
                    <NoPurchasesView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                <TileGrid>
                    {purchases.map((product) => {
                        const isActive = subscriptions && isSubscriptionActive(subscriptions.find((s) => s.product.id === product.id))
                        const isDataUnion = isDataUnionProduct(product)
                        const beneficiaryAddress = (product.beneficiaryAddress || '').toLowerCase()
                        const memberCount = members[beneficiaryAddress]

                        return (
                            <Link
                                key={product.id}
                                to={product.id && `${links.marketplace.products}/${product.id}`}
                            >
                                <Tile
                                    imageUrl={product.imageUrl || ''}
                                    link={product.id && `${links.marketplace.products}/${product.id}`}
                                    labels={{
                                        dataUnion: isDataUnion,
                                    }}
                                    badges={(isDataUnion && memberCount !== undefined) ? {
                                        members: memberCount,
                                    } : undefined}
                                    deploying={!fetchingDataUnionStats && (isDataUnion && beneficiaryAddress && memberCount === undefined)}
                                >
                                    <Tile.Title>{product.name}</Tile.Title>
                                    <Tile.Description>{product.owner}</Tile.Description>
                                    <Tile.Status
                                        className={
                                            cx({
                                                [styles.active]: isActive,
                                                [styles.expired]: !isActive,
                                            })}
                                    >
                                        {
                                            isActive ?
                                                <Translate value="userpages.purchases.active" /> :
                                                <Translate value="userpages.purchases.expired" />
                                        }
                                    </Tile.Status>
                                </Tile>
                            </Link>
                        )
                    })}
                </TileGrid>
            </ListContainer>
            <DocsShortcuts />
        </Layout>
    )
}

export default PurchasesPage
