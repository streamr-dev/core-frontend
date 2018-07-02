// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormControl } from 'react-bootstrap'
import { parseDashboard } from '../../../../helpers/parseState'

import { updateDashboard } from '../../../../actions/dashboard'

import type { DashboardState } from '../../../../flowtype/states/dashboard-state'
import type { Dashboard } from '../../../../flowtype/dashboard-types'

import styles from './nameEditor.pcss'

type StateProps = {
    dashboard: ?Dashboard,
    canWrite: boolean
}

type DispatchProps = {
    update: (db: Dashboard) => void
}

type Props = StateProps & DispatchProps

export class NameEditor extends Component<Props> {
    onChange = ({ target }: SyntheticInputEvent<HTMLInputElement>) => {
        this.props.update({
            ...this.props.dashboard,
            name: target.value,
        })
    }

    render() {
        return (
            <div className={`menu-content ${styles.nameEditor}`}>
                <label htmlFor="dashboard-name">
                    Dashboard Name
                    <FormControl
                        type="text"
                        className="dashboard-name title-input"
                        name="dashboard-name"
                        id="dashboard-name"
                        value={this.props.dashboard ? this.props.dashboard.name : ''}
                        onChange={this.onChange}
                        disabled={!this.props.canWrite}
                    />
                </label>
            </div>
        )
    }
}

export const mapStateToProps = (state: { dashboard: DashboardState }): StateProps => parseDashboard(state)

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    update(dashboard: Dashboard) {
        return dispatch(updateDashboard(dashboard))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(NameEditor)
