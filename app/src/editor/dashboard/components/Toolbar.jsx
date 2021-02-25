import React from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'

import EditableText from '$shared/components/EditableText'
import UseState from '$shared/components/UseState'
import Meatball from '$shared/components/Meatball'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'
import Popover from '$shared/components/Popover'
import SvgIcon from '$shared/components/SvgIcon'
import Tooltip from '$shared/components/Tooltip'
import confirmDialog from '$shared/utils/confirm'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'

import Toolbar from '$editor/shared/components/Toolbar'

import styles from '$editor/canvas/components/Toolbar/Toolbar.pcss'
import ToolbarLayout from '$editor/canvas/components/Toolbar/ToolbarLayout'

/* eslint-disable react/no-unused-state */

export default withErrorBoundary(ErrorComponentView)((props) => {
    const {
        dashboard,
        hasSharePermission,
        hasDeletePermission,
        className,
        duplicateDashboard,
        deleteDashboard: deleteDashboardProp,
        setDashboard,
        newDashboard,
        moduleSearchOpen,
        sidebar,
    } = props

    const renameDashboard = React.useCallback((name) => {
        setDashboard({ type: 'Rename Dashboard' }, (dashboard) => ({
            ...dashboard,
            name,
        }))
    }, [setDashboard])

    const deleteDashboard = React.useCallback(async (hasDeletePermission) => {
        const confirmed = await confirmDialog('dashboard', {
            title: `${hasDeletePermission ? 'Delete' : 'Remove'} this dashboard?`,
            message: 'This is an unrecoverable action. Please confirm this is what you want before you proceed.',
            acceptButton: {
                title: `Yes, ${hasDeletePermission ? 'delete' : 'remove'}`,
                kind: 'destructive',
            },
            centerButtons: true,
            dontShowAgain: false,
        })

        if (confirmed) {
            try {
                await deleteDashboardProp()

                Notification.push({
                    title: `Dashboard ${hasDeletePermission ? 'deleted' : 'removed'} successfully!`,
                    icon: NotificationIcon.CHECKMARK,
                })
            } catch (e) {
                Notification.push({
                    title: e.message,
                    icon: NotificationIcon.ERROR,
                })
            }
        }
    }, [deleteDashboardProp])

    const elRef = React.useRef()

    const [renderedOnce, setRenderedOnce] = React.useState(false)
    React.useEffect(() => {
        if (renderedOnce) { return }
        setRenderedOnce(true)
    }, [renderedOnce])

    if (!dashboard) {
        return <div className={cx(className, styles.CanvasToolbar)} ref={elRef} />
    }

    return (
        <div className={cx(className, styles.CanvasToolbar)} ref={elRef}>
            {!!elRef.current && (
                <ToolbarLayout>
                    <div className={ToolbarLayout.classNames.LEFT}>
                        <UseState initialValue={false}>
                            {(editing, setEditing) => (
                                <div className={styles.CanvasNameContainer}>
                                    <EditableText
                                        className={cx(Toolbar.styles.entityName, styles.DashboardEntityName)}
                                        editing={editing}
                                        onChange={renameDashboard}
                                        setEditing={setEditing}
                                    >
                                        {dashboard.name}
                                    </EditableText>
                                    <Popover
                                        title={
                                            <R.Button className={cx(styles.MeatballContainer, styles.ToolbarButton)}>
                                                <Meatball alt="Select" />
                                            </R.Button>
                                        }
                                        caret={false}
                                        className={styles.DropdownMenu}
                                        menuProps={{
                                            className: styles.DropdownMenuMenu,
                                        }}
                                    >
                                        <Popover.Item onClick={newDashboard}>New Dashboard</Popover.Item>
                                        <Popover.Item
                                            disabled={!hasSharePermission}
                                            onClick={() => sidebar.open('share')}
                                        >
                                            Share
                                        </Popover.Item>
                                        <Popover.Item
                                            onClick={() => setEditing(true)}
                                        >
                                            Rename
                                        </Popover.Item>
                                        <Popover.Item onClick={() => duplicateDashboard()}>Duplicate</Popover.Item>
                                        <Popover.Item
                                            onClick={() => deleteDashboard(hasDeletePermission)}
                                        >
                                            {hasDeletePermission ? 'Delete' : 'Remove'}
                                        </Popover.Item>
                                    </Popover>
                                </div>
                            )}
                        </UseState>
                        <div>
                            <R.Button
                                className={styles.ToolbarButton}
                                onClick={moduleSearchOpen}
                            >
                                <SvgIcon name="plus" className={styles.icon} />
                            </R.Button>
                        </div>
                        <div />
                    </div>
                    <div className={ToolbarLayout.classNames.CENTER} />
                    <div className={ToolbarLayout.classNames.RIGHT}>
                        <div />
                        <div className={cx(styles.ToolbarLeft, styles.DashboardButtons)}>
                            <div className={styles.ModalButtons}>
                                <Tooltip value="Share">
                                    <R.Button
                                        className={cx(styles.ToolbarButton, styles.ShareButton)}
                                        onClick={() => sidebar.open('share')}
                                        disabled={!hasSharePermission}
                                    >
                                        <SvgIcon name="share" />
                                    </R.Button>
                                </Tooltip>
                                <Tooltip value="Keyboard shortcuts">
                                    <R.Button
                                        className={cx(styles.ToolbarButton, styles.KeyboardButton)}
                                        onClick={() => sidebar.open('keyboardShortcuts')}
                                    >
                                        <SvgIcon name="keyboard" />
                                    </R.Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </ToolbarLayout>
            )}
        </div>
    )
})
