// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'

import Layout from '../Layout'
import links from '../../../links'
import { getFilters } from '../../utils/constants'
import { getMyPurchases, updateFilter, applyFilter } from '$mp/modules/myPurchaseList/actions'
import { selectMyPurchaseList, selectSubscriptions, selectFilter, selectFetchingMyPurchaseList } from '$mp/modules/myPurchaseList/selectors'
import Tile from '$shared/components/Tile'
import { isActive } from '$mp/utils/time'
import Search from '../Header/Search'
import Dropdown from '$shared/components/Dropdown'
import NoPurchasesView from './NoPurchases'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import TileGrid from '$shared/components/TileGrid'

import type { ProductList, ProductSubscription } from '$mp/flowtype/product-types'
import type { Filter, SortOption } from '$userpages/flowtype/common-types'

import styles from './purchases.pcss'

export type StateProps = {
    purchases: ProductList,
    subscriptions: Array<ProductSubscription>,
    filter: ?Filter,
    fetching: boolean,
}

export type DispatchProps = {
    getMyPurchases: () => Promise<void>,
    updateFilter: (Filter) => void,
    applyFilter: () => void,
}

type Props = StateProps & DispatchProps

const isSubscriptionActive = (subscription?: ProductSubscription): boolean => isActive((subscription && subscription.endsAt) || '')

const getSortOptions = (): Array<SortOption> => {
    const filters = getFilters()
    return [
        filters.NAME_ASC,
        filters.NAME_DESC,
        filters.ACTIVE,
        filters.EXPIRED,
    ]
}

class PurchasesPage extends Component<Props> {
    defaultFilter = getSortOptions()[0].filter

    componentDidMount() {
        const { filter, getMyPurchases, updateFilter, applyFilter } = this.props

        // Set default filter if not selected
        if (!filter) {
            updateFilter(this.defaultFilter)
        }

        getMyPurchases().then(() => {
            applyFilter()
        })
    }

    onSearchChange = (value: string) => {
        const { filter, updateFilter } = this.props
        const newFilter = {
            ...filter,
            search: value,
        }
        updateFilter(newFilter)
    }

    onSortChange = (sortOptionId) => {
        const { filter, updateFilter } = this.props
        const sortOption = getSortOptions().find((opt) => opt.filter.id === sortOptionId)

        if (sortOption) {
            const newFilter = {
                search: filter && filter.search,
                ...sortOption.filter,
            }
            updateFilter(newFilter)
        }
    }

    resetFilter = () => {
        const { updateFilter } = this.props
        updateFilter({
            ...this.defaultFilter,
            search: '',
        })
    }

    render() {
        const { purchases, subscriptions, filter, fetching } = this.props

        return (
            <Layout
                headerSearchComponent={
                    <Search
                        placeholder={I18n.t('userpages.purchases.filterPurchases')}
                        value={(filter && filter.search) || ''}
                        onChange={this.onSearchChange}
                        debounceTime={0}
                    />
                }
                headerFilterComponent={
                    <Dropdown
                        title={I18n.t('userpages.filter.sortBy')}
                        onChange={this.onSortChange}
                        selectedItem={(filter && filter.id) || this.defaultFilter.id}
                    >
                        {getSortOptions().map((s) => (
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
                            onResetFilter={this.resetFilter}
                        />
                    )}
                    <TileGrid>
                        {purchases.map((product) => {
                            const isActive = subscriptions && isSubscriptionActive(subscriptions.find((s) => s.product.id === product.id))

                            return (
                                <Link
                                    key={product.id}
                                    to={product.id && `${links.marketplace.products}/${product.id}`}
                                >
                                    <Tile
                                        imageUrl={product.imageUrl || ''}
                                        link={product.id && `${links.marketplace.products}/${product.id}`}
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
}

export const mapStateToProps = (state: any): StateProps => ({
    purchases: selectMyPurchaseList(state),
    subscriptions: selectSubscriptions(state),
    filter: selectFilter(state),
    fetching: selectFetchingMyPurchaseList(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getMyPurchases: () => dispatch(getMyPurchases()),
    updateFilter: (filter: Filter) => dispatch(updateFilter(filter)),
    applyFilter: () => dispatch(applyFilter()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PurchasesPage)
