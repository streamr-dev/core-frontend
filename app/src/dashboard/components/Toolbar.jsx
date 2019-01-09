/* eslint-disable react/no-unused-state */
import React from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'
import Meatball from '$shared/components/Meatball'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'

import RenameInput from '$editor/components/RenameInput'

import styles from '$editor/components/Toolbar.pcss'

export default withErrorBoundary(ErrorComponentView)(class DashboardToolbar extends React.PureComponent {
    state = {
        dashboardSearchIsOpen: false,
    }

    onRenameRef = (el) => {
        this.renameEl = el
    }

    onRename = () => {
        this.renameEl.focus() // just focus the input to start renaming
    }

    renameDashboard = (name) => {
        this.props.setDashboard({ type: 'Rename Dashboard' }, (dashboard) => ({
            ...dashboard,
            name,
        }))
    }

    dashboardSearchOpen = (show = true) => {
        this.setState({
            dashboardSearchIsOpen: !!show,
        })
    }

    onKeyDown = (event) => {
        if (this.state.dashboardSearchIsOpen && event.code === 'Escape') {
            this.dashboardSearchOpen(false)
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
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
                <R.ButtonGroup className={cx(styles.Hollow, styles.CanvasNameContainer)}>
                    <RenameInput
                        value={dashboard.name}
                        onChange={this.renameDashboard}
                        innerRef={this.onRenameRef}
                        required
                    />
                    <R.UncontrolledDropdown>
                        <R.DropdownToggle className={styles.Hollow}>
                            <Meatball />
                        </R.DropdownToggle>
                        <R.DropdownMenu>
                            <R.DropdownItem onClick={newDashboard}>New Dashboard</R.DropdownItem>
                            <R.DropdownItem>Share</R.DropdownItem>
                            <R.DropdownItem onClick={this.onRename}>Rename</R.DropdownItem>
                            <R.DropdownItem onClick={() => duplicateDashboard()}>Duplicate</R.DropdownItem>
                            <R.DropdownItem onClick={() => deleteDashboard()}>Delete</R.DropdownItem>
                        </R.DropdownMenu>
                    </R.UncontrolledDropdown>
                </R.ButtonGroup>
                <R.ButtonGroup style={{ position: 'relative' }}>
                    <R.Button onClick={() => this.dashboardSearchOpen(!this.state.dashboardSearchIsOpen)}>Open</R.Button>
                </R.ButtonGroup>
                <R.Button>
                    +
                </R.Button>
            </div>
        )
    }
})

