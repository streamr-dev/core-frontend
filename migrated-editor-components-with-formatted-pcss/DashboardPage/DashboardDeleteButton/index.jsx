// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Node } from 'react'
import { withRouter } from 'react-router-dom'
import ConfirmButton from '../../ConfirmButton'

import links from '../../../../links'
import { deleteDashboard } from '../../../modules/dashboard/actions'
import { parseDashboard } from '../../../utils/dashboard'

import type { DashboardState } from '../../../flowtype/states/dashboard-state'
import type { Dashboard } from '../../../flowtype/dashboard-types'

type StateProps = {
    /* eslint-disable react/no-unused-prop-types */
    dashboard: ?Dashboard,
    canWrite: boolean,
    canShare: boolean
}

type DispatchProps = {
    deleteDashboard: (id: $ElementType<Dashboard, 'id'>) => Promise<any>
}

type RouterProps = {
    history: {
        push: (path: string, state: ?{}) => void
    }
}

type GivenProps = {
    buttonProps: {},
    children?: Node | Array<Node>,
    className: string
}

type Props = StateProps & DispatchProps & RouterProps & GivenProps

export class DashboardDeleteButton extends Component<Props> {
    static defaultProps = {
        buttonProps: {},
        className: '',
    }

    onDelete = async () => {
        if (this.props.dashboard) {
            await this.props.deleteDashboard(this.props.dashboard.id)
            this.props.history.push(links.dashboardList)
        }
    }

    render() {
        return (
            <ConfirmButton
                buttonProps={{
                    disabled: this.props.dashboard && (!this.props.canWrite || this.props.dashboard.new),
                    ...this.props.buttonProps,
                }}
                className={this.props.className}
                confirmCallback={this.onDelete}
                confirmTitle="Are you sure?"
                confirmMessage={`Are you sure you want to remove dashboard ${this.props.dashboard ? this.props.dashboard.name : ''}?`}
            >
                {this.props.children}
            </ConfirmButton>
        )
    }
}

export const mapStateToProps = (state: { dashboard: DashboardState }): StateProps => parseDashboard(state)

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    deleteDashboard(id: $ElementType<Dashboard, 'id'>) {
        return dispatch(deleteDashboard(id))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashboardDeleteButton))
