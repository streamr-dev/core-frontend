// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

import links from '$userpages/../links'
import { getDashboards } from '$userpages/modules/dashboard/actions'
import { selectDashboards, selectFetching } from '$userpages/modules/dashboard/selectors'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { DashboardList as DashboardListType } from '$userpages/flowtype/dashboard-types'
import Table from '$shared/components/Table'
import Layout from '$userpages/components/Layout'

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

        return (
            <Layout>
                <div className="container">
                    <h1>Dashboards</h1>
                    {!fetching && dashboards && dashboards.length <= 0 && (
                        <div>no dashboards!</div>
                    )}
                    {!fetching && dashboards && dashboards.length > 0 && (
                        <Table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Updated</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.dashboards.map((dashboard) => (
                                    <tr key={dashboard.id}>
                                        <th>
                                            <Link to={`${links.userpages.dashboardEditor}/${dashboard.id}`}>
                                                {dashboard.name}
                                            </Link>
                                        </th>
                                        <td />
                                        <td>
                                            <Button>Share</Button>
                                            <Button>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
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
