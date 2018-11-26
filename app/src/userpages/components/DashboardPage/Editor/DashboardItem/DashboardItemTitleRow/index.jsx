// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'

import { removeDashboardItem, updateDashboardItem } from '../../../../../modules/dashboard/actions'

import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { Dashboard, DashboardItem } from '$userpages/flowtype/dashboard-types'
import styles from './dashboardItemTitleRow.pcss'
import { selectOpenDashboard } from '$userpages/modules/dashboard/selectors'

type StateProps = {
    dashboard: ?Dashboard
}

type DispatchProps = {
    update: Function,
    remove: Function
}

type GivenProps = {
    item: DashboardItem,
    className?: string,
    dragCancelClassName?: string,
    isLocked: boolean
}

type Props = StateProps & DispatchProps & GivenProps

type State = {
    editing: boolean
}

export class DashboardItemTitleRow extends Component<Props, State> {
    static defaultProps = {
        isLocked: false,
    }

    state = {
        editing: false,
    }

    onRemove = () => {
        this.props.remove(this.props.dashboard, this.props.item)
    }

    onBlur = (e: { relatedTarget: HTMLElement }) => {
        // This hack prevents clicking saveButton from first closing the editing and the starting it again
        if (this.saveButton && this.saveButton !== e.relatedTarget && !this.saveButton.contains(e.relatedTarget)) {
            this.endEdit()
        }
    }

    startEdit = () => {
        this.setState({
            editing: true,
        })
    }

    endEdit = () => {
        this.setState({
            editing: false,
        })
    }

    saveName = ({ target }: { target: { value: string } }) => {
        this.props.update(this.props.dashboard, this.props.item, {
            title: target.value,
        })
    }

    saveButton: ?HTMLElement

    render() {
        const { item, dragCancelClassName } = this.props
        return (
            <div className={styles.titleRow}>
                <div className={styles.title}>
                    {this.state.editing ? (
                        <input
                            className={`titlebar-edit name-input form-control input-sm ${dragCancelClassName || ''}`}
                            type="text"
                            placeholder="Title"
                            name="dashboard-item-name"
                            value={item.title}
                            onChange={this.saveName}
                            onBlur={this.onBlur}
                        />
                    ) : (
                        <span className={dragCancelClassName}>
                            {item.title}
                        </span>
                    )}
                </div>
                {!this.props.isLocked && (
                    <div className={styles.controlContainer}>
                        <div className={`${styles.controls} ${dragCancelClassName || ''}`}>
                            {this.state.editing ? (
                                <Button
                                    size="xs"
                                    color="primary"
                                    className={`btn-outline dark ${styles.endEditButton}`}
                                    title="Ready"
                                    onClick={this.endEdit}
                                    // TODO: Fix this without depreciated componentClass
                                    // componentClass={(props) => <button type="button" {...props} ref={(el) => { this.saveButton = el }} />}
                                >
                                    Save
                                </Button>
                            ) : (
                                <Button
                                    size="xs"
                                    color="primary"
                                    className={`btn-outline dark ${styles.startEditButton}`}
                                    title="Edit title"
                                    onClick={this.startEdit}
                                >
                                    Edit
                                </Button>
                            )}

                            <Button
                                size="xs"
                                color="primary"
                                className={`btn-outline dark ${styles.deleteButton}`}
                                title="Remove"
                                onClick={this.onRemove}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    dashboard: selectOpenDashboard(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    update(db: Dashboard, item: DashboardItem, newData: {} = {}) {
        return dispatch(updateDashboardItem(db, {
            ...item,
            ...newData,
        }))
    },
    remove(db: Dashboard, item: DashboardItem) {
        return dispatch(removeDashboardItem(db, item))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardItemTitleRow)
