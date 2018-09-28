import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import links from '../../../../links'
import { getDashboards } from '../../../modules/dashboard/actions'
import Table from '../../Table'

export default connect((state) => ({
    dashboards: state.dashboard.byId,
}), {
    getDashboards,
})(class DashboardList extends Component {
    componentDidMount() {
        this.props.getDashboards()
    }

    render() {
        return (
            <div className="container">
                <h1>Dashboards</h1>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Updated</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {!Object.values(this.props.dashboards).length && (
                            <Table.EmptyRow>
                                <td colSpan="3">No Dashboards</td>
                            </Table.EmptyRow>
                        )}
                        {Object.values(this.props.dashboards).map((dashboard) => (
                            <tr key={dashboard.id}>
                                <td>
                                    <Link to={`${links.userpages.dashboardEditor}/${dashboard.id}`}>
                                        {dashboard.name}
                                    </Link>
                                </td>
                                <td />
                                <td>
                                    <Button>Share</Button>
                                    <Button>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        )
    }
})
