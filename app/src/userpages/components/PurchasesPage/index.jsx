// @flow

import React, { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import Helmet from 'react-helmet'

import Layout from '../Layout'
import { getFilters } from '../../utils/constants'
import { getMyPurchases, updateFilter, applyFilter } from '$mp/modules/myPurchaseList/actions'
import { selectMyPurchaseList, selectSubscriptions, selectFetchingMyPurchaseList } from '$mp/modules/myPurchaseList/selectors'
import Search from '../Header/Search'
import Popover from '$shared/components/Popover'
import NoPurchasesView from './NoPurchases'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import { isDataUnionProduct } from '$mp/utils/product'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useMemberStats from '$mp/modules/dataUnion/hooks/useMemberStats'
import { PurchaseTile } from '$shared/components/Tile'
import Grid from '$shared/components/Tile/Grid'

import styles from './purchases.pcss'

const PurchasesPage = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters('product')
        return [
            filters.RECENT_DESC,
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

    const subEndAts = useMemo(() => (
        subscriptions.reduce((memo, sub) => ({
            ...memo,
            [sub.product.id]: new Date(sub.endsAt),
        }), {})
    ), [subscriptions])

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
                <Popover
                    title={I18n.t('userpages.filter.sortBy')}
                    onChange={setSort}
                    selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                    type="uppercase"
                    activeTitle
                    menuProps={{
                        right: true,
                    }}
                >
                    {sortOptions.map((s) => (
                        <Popover.Item key={s.filter.id} value={s.filter.id}>
                            {s.displayName}
                        </Popover.Item>
                    ))}
                </Popover>
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
                {purchases.length > 0 && (
                    <Grid>
                        {purchases.map((product) => {
                            const isDataUnion = isDataUnionProduct(product)
                            const beneficiaryAddress = (product.beneficiaryAddress || '').toLowerCase()
                            const memberCount = isDataUnion ? members[beneficiaryAddress] : undefined

                            return (
                                <PurchaseTile
                                    expiresAt={subEndAts[product.id]}
                                    key={product.id}
                                    numMembers={memberCount}
                                    product={product}
                                    showDataUnionBadge={isDataUnion}
                                    showDeployingBadge={!fetchingDataUnionStats}
                                />
                            )
                        })}
                    </Grid>
                )}
            </ListContainer>
            <DocsShortcuts />
        </Layout>
    )
}

export default PurchasesPage
