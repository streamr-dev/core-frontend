// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'

import uuid from 'uuid'
import { addDashboardItem, removeDashboardItem } from '$userpages/modules/dashboard/actions'

import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { Dashboard, DashboardId, DashboardItem } from '$userpages/flowtype/dashboard-types'
import type { Canvas, CanvasModule } from '$userpages/flowtype/canvas-types'
import styles from './moduleInModuleList.pcss'
import { selectOpenDashboard } from '$userpages/modules/dashboard/selectors'

type StateProps = {
    dashboard: ?Dashboard,
    checked: boolean
}

type DispatchProps = {
    addDashboardItem: (dashboard: Dashboard, item: DashboardItem) => void,
    removeDashboardItem: (dashboard: Dashboard, item: DashboardItem) => void
}

type GivenProps = {
    module: CanvasModule,
    canvasId: $ElementType<Canvas, 'id'>,
    id: DashboardId,
}

type Props = StateProps & DispatchProps & GivenProps

export class ModuleInModuleList extends Component<Props> {
    onClick = () => {
        const id = uuid.v4()
        const dbItem: DashboardItem = {
            id,
            dashboard: this.props.dashboard && this.props.dashboard.id,
            module: this.props.module.hash,
            canvas: this.props.canvasId,
            webcomponent: this.props.module.uiChannel.webcomponent,
            title: this.props.module.name,
        }
        if (this.props.dashboard) {
            if (this.props.checked) {
                this.props.removeDashboardItem(this.props.dashboard, dbItem)
            } else {
                this.props.addDashboardItem(this.props.dashboard, dbItem)
            }
        }
    }

    render() {
        const { module, checked } = this.props
        return (
            <li className="module">
                <a href="#" className={`${styles.module} ${checked ? styles.checked : ''}`} onClick={this.onClick}>
                    {checked ? 'checked' : 'unchecked'} className={styles.checkIcon}
                    {module.name}
                </a>
            </li>
        )
    }
}

export const mapStateToProps = (state: StoreState, ownProps: GivenProps): StateProps => {
    const db = selectOpenDashboard(state)
    return {
        dashboard: db,
        checked: !!db && (
            db.items
                ? (db.items.find((item) => item.canvas === ownProps.canvasId && item.module === ownProps.module.hash) !== undefined)
                : false
        ),
    }
}

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    addDashboardItem(dashboard: Dashboard, item: DashboardItem) {
        dispatch(addDashboardItem(dashboard, item))
    },
    removeDashboardItem(dashboard: Dashboard, item: DashboardItem) {
        dispatch(removeDashboardItem(dashboard, item))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(ModuleInModuleList)
