// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import Layout from '../Layout'
import links from '../../../links'
import { defaultColumns, getFilters } from '../../utils/constants'
import { getMyPurchases, updateFilter, applyFilter } from '$mp/modules/myPurchaseList/actions'
import { selectMyPurchaseList, selectSubscriptions, selectFilter } from '$mp/modules/myPurchaseList/selectors'
import Tile from '$shared/components/Tile'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import { isActive } from '$mp/utils/time'
import routes from '$routes'
import Search from '$shared/components/Search'
import Dropdown from '$shared/components/Dropdown'

import type { ProductList, ProductSubscription } from '$mp/flowtype/product-types'
import type { Filter, SortOption } from '$userpages/flowtype/common-types'

import styles from './purchases.pcss'

export type StateProps = {
    purchases: ProductList,
    subscriptions: Array<ProductSubscription>,
    filter: ?Filter,
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
        filters.ACTIVE,
        filters.EXPIRED,
        filters.NAME_ASC,
        filters.NAME_DESC,
    ]
}

class PurchasesPage extends Component<Props> {
    defaultFilter = getSortOptions()[0].filter

    componentDidMount() {
        // Set default filter if not selected
        if (!this.props.filter) {
            this.props.updateFilter(this.defaultFilter)
        }

        this.props.getMyPurchases().then(() => {
            this.props.applyFilter()
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

    render() {
        const { purchases, subscriptions, filter } = this.props

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
                        defaultSelectedItem={(filter && filter.id) || this.defaultFilter.id}
                    >
                        {getSortOptions().map((s) => (
                            <Dropdown.Item key={s.filter.id} value={s.filter.id}>
                                {s.displayName}
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                }
            >
                <Container>
                    {!purchases.length && (
                        <EmptyState
                            image={(
                                <img
                                    src={emptyStateIcon}
                                    srcSet={`${emptyStateIcon2x} 2x`}
                                    alt={I18n.t('error.notFound')}
                                />
                            )}
                            link={(
                                <Link to={routes.marketplace()} className="btn btn-special">
                                    <Translate value="userpages.purchases.noPurchases.hint" />
                                </Link>
                            )}
                        >
                            <Translate value="userpages.purchases.noPurchases.title" />
                            <Translate value="userpages.purchases.noPurchases.message" tag="small" />
                        </EmptyState>
                    )}
                    <Row>
                        {purchases.map((product) => {
                            const isActive = subscriptions && isSubscriptionActive(subscriptions.find((s) => s.product.id === product.id))

                            return (
                                <Col {...defaultColumns} key={product.id}>
                                    <Tile
                                        imageUrl={product.imageUrl}
                                        link={product.id && `${links.products}/${product.id}`}
                                    >
                                        <div className={styles.title}>{product.name}</div>
                                        <div className={styles.owner}>{product.owner}</div>
                                        <div
                                            className={
                                                cx(styles.status, {
                                                    [styles.active]: isActive,
                                                    [styles.expired]: !isActive,
                                                })}
                                        >
                                            {
                                                isActive ?
                                                    <Translate value="userpages.purchases.active" /> :
                                                    <Translate value="userpages.purchases.expired" />
                                            }
                                        </div>
                                    </Tile>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            </Layout>
        )
    }
}

export const mapStateToProps = (state: any): StateProps => ({
    purchases: selectMyPurchaseList(state),
    subscriptions: selectSubscriptions(state),
    filter: selectFilter(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getMyPurchases: () => dispatch(getMyPurchases()),
    updateFilter: (filter: Filter) => dispatch(updateFilter(filter)),
    applyFilter: () => dispatch(applyFilter()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PurchasesPage)
