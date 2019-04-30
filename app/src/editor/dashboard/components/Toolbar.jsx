import React from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'

import EditableText from '$shared/components/EditableText'
import UseState from '$shared/components/UseState'
import Meatball from '$shared/components/Meatball'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'
import DropdownActions from '$shared/components/DropdownActions'
import SvgIcon from '$shared/components/SvgIcon'
import Tooltip from '$shared/components/Tooltip'

import { ModalContainer } from '$editor/shared/components/Modal'
import Toolbar from '$editor/shared/components/Toolbar'
import DashboardModuleSearch from './DashboardModuleSearch'

import ShareDialog from './ShareDialog'

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

        if (!dashboard) {
            return <div className={cx(className, styles.CanvasToolbar)} />
        }

        return (
            <div className={cx(className, styles.CanvasToolbar)}>
                <ModalContainer modalId="ShareDialog">
                    {({ api: shareDialog }) => (
                        <ModalContainer modalId="DashboardModuleSearch">
                            {({ api: moduleSearch }) => (
                                <React.Fragment>
                                    <UseState initialValue={false}>
                                        {(editing, setEditing) => (
                                            <div className={styles.ToolbarLeft}>
                                                <EditableText
                                                    className={cx(Toolbar.styles.entityName, styles.DashboardEntityName)}
                                                    editing={editing}
                                                    onChange={this.renameDashboard}
                                                    setEditing={setEditing}
                                                >
                                                    {dashboard.name}
                                                </EditableText>
                                                <DropdownActions
                                                    title={
                                                        <R.Button className={cx(styles.MeatballContainer, styles.ToolbarButton)}>
                                                            <Meatball alt="Select" />
                                                        </R.Button>
                                                    }
                                                    noCaret
                                                    className={styles.DropdownMenu}
                                                    menuProps={{
                                                        className: styles.DropdownMenuMenu,
                                                    }}
                                                >
                                                    <DropdownActions.Item onClick={newDashboard}>New Dashboard</DropdownActions.Item>
                                                    <DropdownActions.Item onClick={() => shareDialog.open()}>Share</DropdownActions.Item>
                                                    <DropdownActions.Item
                                                        onClick={() => setEditing(true)}
                                                    >
                                                        Rename
                                                    </DropdownActions.Item>
                                                    <DropdownActions.Item onClick={() => duplicateDashboard()}>Duplicate</DropdownActions.Item>
                                                    <DropdownActions.Item onClick={() => deleteDashboard()}>Delete</DropdownActions.Item>
                                                </DropdownActions>
                                            </div>
                                        )}
                                    </UseState>
                                    <div className={styles.ToolbarRight}>
                                        <R.Button
                                            className={styles.ToolbarButton}
                                            onClick={() => moduleSearch.open()}
                                        >
                                            <SvgIcon name="plus" className={styles.icon} />
                                        </R.Button>
                                    </div>
                                    <div className={cx(styles.ToolbarLeft, styles.DashboardButtons)}>
                                        <div className={styles.ModalButtons}>
                                            <Tooltip value="Share">
                                                <R.Button
                                                    className={cx(styles.ToolbarButton, styles.ShareButton)}
                                                    onClick={() => shareDialog.open()}
                                                >
                                                    <SvgIcon name="share" />
                                                </R.Button>
                                            </Tooltip>
                                            <Tooltip value={<React.Fragment>Keyboard<br />shortcuts</React.Fragment>}>
                                                <R.Button
                                                    className={cx(styles.ToolbarButton, styles.KeyboardButton)}
                                                >
                                                    <SvgIcon name="keyboard" />
                                                </R.Button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        </ModalContainer>
                    )}
                </ModalContainer>
                <DashboardModuleSearch removeModule={this.props.removeModule} addModule={this.props.addModule} dashboard={dashboard} />
                <ShareDialog dashboard={dashboard} />
            </div>
        )
    }
})
