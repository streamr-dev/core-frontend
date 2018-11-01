// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'

import links from '$userpages/../links'
import { getDashboards } from '$userpages/modules/dashboard/actions'
import { selectDashboards, selectFetching } from '$userpages/modules/dashboard/selectors'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { DashboardList as DashboardListType } from '$userpages/flowtype/dashboard-types'
import Layout from '$userpages/components/Layout'
import { defaultColumns } from '$userpages/utils/constants'
import Tile from '$shared/components/Tile'
import NoDashboardsView from './NoDashboards'

type StateProps = {
    dashboards: DashboardListType,
    fetching: boolean,
}

type DispatchProps = {
    getDashboards: () => void,
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
    componentDidMount() {
        this.props.getDashboards()
    }

    render() {
        const { fetching, dashboards } = this.props

        return (
            <Layout
                headerAdditionalComponent={<CreateDashboardButton />}
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
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getDashboards: () => dispatch(getDashboards()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardList)
