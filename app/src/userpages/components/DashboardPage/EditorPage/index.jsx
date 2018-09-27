// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import uuid from 'uuid'
import type { Node } from 'react'

import { getDashboard, getMyDashboardPermissions, newDashboard, openDashboard as doOpenDashboard } from '../../../modules/dashboard/actions'

import { getCanvases } from '../../../modules/canvas/actions'

import type { DashboardState } from '../../../flowtype/states/dashboard-state'
import type { Dashboard } from '../../../flowtype/dashboard-types'

import Editor from '../Editor'
import Sidebar from '../Sidebar'
import styles from './editorPage.pcss'

type StateProps = {
    dashboard: ?Dashboard
}

type DispatchProps = {
    getDashboard: (id: string) => void,
    getMyDashboardPermissions: (id: string) => void,
    newDashboard: (id: string) => void,
    getCanvases: () => void,
    openDashboard: (id: string) => void
}

type GivenProps = {
    children: Node | Array<Node>
}

type RouterProps = {
    match: {
        params: {
            id?: string
        }
    }
}

type Props = StateProps & DispatchProps & GivenProps & RouterProps

export class DashboardPage extends Component<Props> {
    componentWillMount() {
        let { id } = this.props.match.params
        if (id !== undefined) {
            this.props.getDashboard(id)
            this.props.getMyDashboardPermissions(id)
        } else {
            id = uuid.v4()
            this.props.newDashboard(id)
        }
        this.props.getCanvases()
        this.props.openDashboard(id)
    }

    render() {
        return (
            <div className={styles.editorPage}>
                <Helmet>
                    <title>{(this.props.dashboard && this.props.dashboard.name) || 'New Dashboard'}</title>
                </Helmet>
                <Sidebar />
                <Editor />
            </div>
        )
    }
}

export const mapStateToProps = ({ dashboard: { byId, openDashboard } }: { dashboard: DashboardState }): StateProps => ({
    dashboard: openDashboard.id ? byId[openDashboard.id] : null,
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getDashboard(id: string) {
        dispatch(getDashboard(id))
    },
    getMyDashboardPermissions(id: string) {
        dispatch(getMyDashboardPermissions(id))
    },
    newDashboard(id: string) {
        dispatch(newDashboard(id))
    },
    getCanvases() {
        dispatch(getCanvases())
    },
    openDashboard(id: string) {
        dispatch(doOpenDashboard(id))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)
