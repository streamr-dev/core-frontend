import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import links from '../../../links'
import { getDashboards } from '../../../modules/dashboard/actions'

import styles from './dashboardList.pcss'

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
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Updated</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {!Object.values(this.props.dashboards).length && (
                            <tr className={styles.empty}>
                                <td colSpan="3">No Dashboards</td>
                            </tr>
                        )}
                        {Object.values(this.props.dashboards).map((dashboard) => (
                            <tr key={dashboard.id}>
                                <td>
                                    <Link to={`${links.dashboardShow}/${dashboard.id}`}>
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
                </table>
            </div>
        )
    }
})
