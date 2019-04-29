// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Translate, I18n } from 'react-redux-i18n'
import Helmet from 'react-helmet'

import links from '$userpages/../links'
import { getDashboards, updateFilter } from '$userpages/modules/dashboard/actions'
import { selectDashboards, selectFetching, selectFilter } from '$userpages/modules/dashboard/selectors'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { DashboardList as DashboardListType } from '$userpages/flowtype/dashboard-types'
import type { Filter, SortOption } from '$userpages/flowtype/common-types'
import Layout from '$userpages/components/Layout'
import { defaultColumns, getFilters } from '$userpages/utils/constants'
import Tile from '$shared/components/Tile'
import Search from '$shared/components/Search'
import Dropdown from '$shared/components/Dropdown'
import DocsShortcuts from '$userpages/components/DocsShortcuts'

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
    <Button color="primary">
        <Link to={links.editor.dashboardEditor}>
            <Translate value="userpages.dashboards.createDashboard" />
        </Link>
    </Button>
)

const getSortOptions = (): Array<SortOption> => {
    const filters = getFilters()
    return [
        filters.NAME_ASC,
        filters.NAME_DESC,
        filters.SHARED,
        filters.MINE,
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
                        defaultSelectedItem={(filter && filter.id) || this.defaultFilter.id}
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
                <Helmet>
                    <title>{I18n.t('userpages.title.dashboards')}</title>
                </Helmet>
                <Container>
                    {!fetching && dashboards && dashboards.length <= 0 && (
                        <NoDashboardsView />
                    )}
                    {dashboards && dashboards.length > 0 && (
                        <Row>
                            {dashboards.map((dashboard) => (
                                <Col {...defaultColumns} key={dashboard.id}>
                                    <Tile link={`${links.editor.dashboardEditor}/${dashboard.id}`}>
                                        <Tile.Title>{dashboard.name}</Tile.Title>
                                    </Tile>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
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
