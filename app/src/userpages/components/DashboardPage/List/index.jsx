// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import links from '$userpages/../links'
import { getDashboards, updateFilter } from '$userpages/modules/dashboard/actions'
import { selectDashboards, selectFetching, selectFilter } from '$userpages/modules/dashboard/selectors'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { DashboardList as DashboardListType } from '$userpages/flowtype/dashboard-types'
import type { Filter, SortOption } from '$userpages/flowtype/common-types'
import Layout from '$userpages/components/Layout'
import { getFilters } from '$userpages/utils/constants'
import Tile from '$shared/components/Tile'
import TileStyles from '$shared/components/Tile/tile.pcss'
import Search from '../../Header/Search'
import Dropdown from '$shared/components/Dropdown'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import DashboardPreview from '$editor/dashboard/components/Preview'
import styles from './dashboardList.pcss'
import ListContainer from '$shared/components/Container/List'
import TileGrid from '$shared/components/TileGrid'
import Button from '$shared/components/Button'

import NoDashboardsView from './NoDashboards'

type StateProps = {
    dashboards: DashboardListType,
    fetching: boolean,
    filter: ?Filter,
}

type DispatchProps = {
    getDashboards: () => void,
    updateFilter: (filter: Filter) => void,
}

type Props = StateProps & DispatchProps

const CreateDashboardButton = () => (
    <Button
        className={styles.createDashboardButton}
        tag={Link}
        to={links.editor.dashboardEditor}
    >
        <Translate value="userpages.dashboards.createDashboard" />
    </Button>
)

const getSortOptions = (): Array<SortOption> => {
    const filters = getFilters()
    return [
        filters.NAME_ASC,
        filters.NAME_DESC,
    ]
}

class DashboardList extends Component<Props> {
    defaultFilter = getSortOptions()[0].filter

    componentDidMount() {
        const { filter, updateFilter, getDashboards } = this.props

        // Set default filter if not selected
        if (!filter) {
            updateFilter(this.defaultFilter)
        }
        getDashboards()
    }

    onSearchChange = (value: string) => {
        const { filter, updateFilter, getDashboards } = this.props
        const newFilter = {
            ...filter,
            search: value,
        }
        updateFilter(newFilter)
        getDashboards()
    }

    onSortChange = (sortOptionId) => {
        const { filter, updateFilter, getDashboards } = this.props
        const sortOption = getSortOptions().find((opt) => opt.filter.id === sortOptionId)

        if (sortOption) {
            const newFilter = {
                search: filter && filter.search,
                ...sortOption.filter,
            }
            updateFilter(newFilter)
            getDashboards()
        }
    }

    resetFilter = () => {
        const { updateFilter, getDashboards } = this.props
        updateFilter({
            ...this.defaultFilter,
            search: '',
        })
        getDashboards()
    }

    render() {
        const { fetching, dashboards, filter } = this.props

        return (
            <Layout
                headerAdditionalComponent={<CreateDashboardButton />}
                headerSearchComponent={
                    <Search
                        placeholder={I18n.t('userpages.dashboards.filterDashboards')}
                        value={(filter && filter.search) || ''}
                        onChange={this.onSearchChange}
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
                <Helmet title={`Streamr Core | ${I18n.t('userpages.title.dashboards')}`} />
                <ListContainer className={styles.corepageContentContainer} >
                    {!fetching && dashboards && dashboards.length <= 0 && (
                        <NoDashboardsView
                            hasFilter={!!filter && (!!filter.search || !!filter.key)}
                            filter={filter}
                            onResetFilter={this.resetFilter}
                        />
                    )}
                    {dashboards && dashboards.length > 0 && (
                        <TileGrid>
                            {dashboards.map((dashboard) => (
                                <Link
                                    key={dashboard.id}
                                    to={`${links.editor.dashboardEditor}/${dashboard.id}`}
                                >
                                    <Tile
                                        image={<DashboardPreview className={cx(styles.PreviewImage, TileStyles.image)} dashboard={dashboard} />}
                                    >
                                        <Tile.Title>{dashboard.name}</Tile.Title>
                                    </Tile>
                                </Link>
                            ))}
                        </TileGrid>
                    )}
                </ListContainer>
                <DocsShortcuts />
            </Layout>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    dashboards: selectDashboards(state),
    fetching: selectFetching(state),
    filter: selectFilter(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getDashboards: () => dispatch(getDashboards()),
    updateFilter: (filter) => dispatch(updateFilter(filter)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardList)
