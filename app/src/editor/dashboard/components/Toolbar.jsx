import React from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'

import EditableText from '$shared/components/EditableText'
import Prop from '$shared/components/Prop'
import Meatball from '$shared/components/Meatball'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'

import { ModalContainer } from '$editor/shared/components/Modal'
import DashboardModuleSearch from './DashboardModuleSearch'

import styles from '$editor/canvas/components/Toolbar.pcss'

/* eslint-disable react/no-unused-state */

export default withErrorBoundary(ErrorComponentView)(class DashboardToolbar extends React.PureComponent {
    renameDashboard = (name) => {
        this.props.setDashboard({ type: 'Rename Dashboard' }, (dashboard) => ({
            ...dashboard,
            name,
        }))
    }

    render() {
        const {
            dashboard,
            className,
            duplicateDashboard,
            deleteDashboard,
            newDashboard,
        } = this.props

        if (!dashboard) { return null }

        return (
            <div className={cx(className, styles.CanvasToolbar)}>
                <Prop initialValue={false}>
                    {(editing, setEditing) => (
                        <R.ButtonGroup className={cx(styles.Hollow, styles.CanvasNameContainer)}>
                            <EditableText
                                editing={editing}
                                onChange={this.renameDashboard}
                                setEditing={setEditing}
                            >
                                {dashboard.name}
                            </EditableText>
                            <R.UncontrolledDropdown>
                                <R.DropdownToggle className={styles.Hollow}>
                                    <Meatball />
                                </R.DropdownToggle>
                                <R.DropdownMenu>
                                    <R.DropdownItem onClick={newDashboard}>New Dashboard</R.DropdownItem>
                                    <R.DropdownItem>Share</R.DropdownItem>
                                    <R.DropdownItem onClick={() => setEditing(true)}>Rename</R.DropdownItem>
                                    <R.DropdownItem onClick={() => duplicateDashboard()}>Duplicate</R.DropdownItem>
                                    <R.DropdownItem onClick={() => deleteDashboard()}>Delete</R.DropdownItem>
                                </R.DropdownMenu>
                            </R.UncontrolledDropdown>
                        </R.ButtonGroup>
                    )}
                </Prop>
                <ModalContainer modalId="DashboardModuleSearch">
                    {({ api }) => (
                        <R.Button onClick={() => api.open()}>
                            +
                        </R.Button>
                    )}
                </ModalContainer>
                <DashboardModuleSearch removeModule={this.props.removeModule} addModule={this.props.addModule} dashboard={dashboard} />
            </div>
        )
    }
})
