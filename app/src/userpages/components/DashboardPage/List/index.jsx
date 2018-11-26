// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Translate, I18n } from 'react-redux-i18n'

import links from '$userpages/../links'
import { getDashboards, updateFilter } from '$userpages/modules/dashboard/actions'
import { selectDashboards, selectFetching, selectFilter } from '$userpages/modules/dashboard/selectors'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { DashboardList as DashboardListType } from '$userpages/flowtype/dashboard-types'
import type { Filter } from '$userpages/flowtype/common-types'
import Layout from '$userpages/components/Layout'
import { defaultColumns, getDefaultSortOptions } from '$userpages/utils/constants'
import Tile from '$shared/components/Tile'
import Search from '$shared/components/Search'
import Dropdown from '$shared/components/Dropdown'

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
    <Button>
        <Link to={links.userpages.dashboardEditor}>
            <Translate value="userpages.dashboards.createDashboard" />
        </Link>
    </Button>
)

class DashboardList extends Component<Props> {
    defaultFilter = getDefaultSortOptions()[0].filter

    componentDidMount() {
        // Set default filter if not selected
        if (!this.props.filter) {
            this.props.updateFilter(this.defaultFilter)
        }
        this.props.getDashboards()
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
        const sortOption = getDefaultSortOptions().find((opt) => opt.filter.id === sortOptionId)

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
                        placeholder={I18n.t('userpages.canvases.filterCanvases')}
                        value={(filter && filter.search) || ''}
                        onChange={this.onSearchChange}
                    />
                }
                headerFilterComponent={
                    <Dropdown
                        title={I18n.t('userpages.canvases.sortBy')}
                        onChange={this.onSortChange}
                        defaultSelectedItem={(filter && filter.id) || this.defaultFilter.id}
                    >
                        {getDefaultSortOptions().map((s) => (
                            <Dropdown.Item key={s.filter.id} value={s.filter.id}>
                                {s.displayName}
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                }
            >
                <Container>
                    {!fetching && dashboards && dashboards.length <= 0 && (
                        <NoDashboardsView />
                    )}
                    {!fetching && dashboards && dashboards.length > 0 && (
                        <Row>
                            {dashboards.map((dashboard) => (
                                <Col {...defaultColumns} key={dashboard.id}>
                                    <Tile link={`${links.userpages.dashboardEditor}/${dashboard.id}`}>
                                        <Tile.Title>{dashboard.name}</Tile.Title>
                                    </Tile>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
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
