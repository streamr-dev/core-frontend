// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'

import links from '$userpages/../links'
import { getDashboards } from '$userpages/modules/dashboard/actions'
import { selectDashboards, selectFetching } from '$userpages/modules/dashboard/selectors'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { DashboardList as DashboardListType } from '$userpages/flowtype/dashboard-types'
import Layout from '$userpages/components/Layout'
import Tile from '$shared/components/Tile'

type StateProps = {
    dashboards: DashboardListType,
    fetching: boolean,
}

type DispatchProps = {
    getDashboards: () => void,
}

type Props = StateProps & DispatchProps

class DashboardList extends Component<Props> {
    componentDidMount() {
        this.props.getDashboards()
    }

    render() {
        const { fetching, dashboards } = this.props
        const cols = {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 3,
        }

        return (
            <Layout>
                <Container>
                    {!fetching && dashboards && dashboards.length <= 0 && (
                        <div>no dashboards!</div>
                    )}
                    {!fetching && dashboards && dashboards.length > 0 && (
                        <Row>
                            {this.props.dashboards.map((dashboard) => (
                                <Col {...cols} key={dashboard.id}>
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
