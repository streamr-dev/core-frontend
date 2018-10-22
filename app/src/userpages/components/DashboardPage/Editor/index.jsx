// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { MenuItem } from 'reactstrap'
import Fullscreen from 'react-full-screen'
import { Responsive, WidthProvider } from 'react-grid-layout'
import _ from 'lodash'

import { parseDashboard } from '$userpages/helpers/parseState'
import {
    StreamrBreadcrumb,
    StreamrBreadcrumbItem,
    StreamrBreadcrumbDropdownButton,
    StreamrBreadcrumbToolbar,
    StreamrBreadcrumbToolbarButton,
} from '../../Breadcrumb'
import 'react-grid-layout/css/styles.css'

import ShareDialog from '../../ShareDialog'

import {
    updateDashboardChanges,
    lockDashboardEditing,
    unlockDashboardEditing,
    updateDashboardLayout,
} from '$userpages/modules/dashboard/actions'

import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { Dashboard, DashboardId, Layout, LayoutItem } from '$userpages/flowtype/dashboard-types'
import links from '$userpages/../links'
import DashboardItem from './DashboardItem'

import styles from './editor.pcss'

type StateProps = {
    dashboard: ?Dashboard,
    canShare: boolean,
    canWrite: boolean,
    editorLocked: boolean
}

type DispatchProps = {
    update: (id: DashboardId, changes: {}) => Promise<Dashboard>,
    lockEditing: (id: DashboardId) => void,
    unlockEditing: (id: DashboardId) => void,
    updateDashboardLayout: (id: DashboardId, layout: Layout) => void
}

type GivenProps = {
    keyId: ?string,
}

type RouterProps = {
    history: {
        push: Function
    }
}

type Props = StateProps & DispatchProps & GivenProps & RouterProps

type State = {
    breakpoints: {
        lg: number,
        md: number,
        sm: number,
        xs: number
    },
    cols: {
        lg: number,
        md: number,
        sm: number,
        xs: number
    },
    layoutsByItemId: {
        [DashboardItem.id]: DashboardItem.layout
    },
    isFullscreen: boolean,
    sharingDialogIsOpen: boolean
}

const ResponsiveReactGridLayout = WidthProvider(Responsive)
const dashboardConfig = require('../dashboardConfig')

export class Editor extends Component<Props, State> {
    static generateItemId(item: DashboardItem): string {
        return `${item.canvas}-${item.module}`
    }

    static defaultProps = {
        dashboard: {
            name: '',
            items: [],
        },
    }

    state = {
        breakpoints: dashboardConfig.layout.breakpoints,
        cols: dashboardConfig.layout.cols,
        layoutsByItemId: {},
        isFullscreen: false,
        sharingDialogIsOpen: false,
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.onBeforeUnload)

        const menuToggle = document.getElementById('main-menu-toggle')
        if (menuToggle) {
            menuToggle.addEventListener('click', this.onMenuToggle)
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.dashboard && nextProps.dashboard && this.props.dashboard.id !== nextProps.dashboard.id) {
            this.props.history.push(`${links.userpages.dashboardEditor}/${nextProps.dashboard.id || ''}`)
        }
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onBeforeUnload)
    }

    onMenuToggle = () => {
        const menuIsOpen = document.body && document.body.classList && document.body.classList.contains('mmc')
        if (this.props.dashboard) {
            if (menuIsOpen) {
                this.props.unlockEditing(this.props.dashboard.id)
            } else {
                this.props.lockEditing(this.props.dashboard.id)
            }
        }
    }

    onDragStop = () => {

    }

    onLayoutChange = (layout: DashboardItem.layout, allLayouts: Layout) => {
        this.onResize(layout)
        if (this.props.dashboard) {
            this.props.updateDashboardLayout(this.props.dashboard.id, allLayouts)
        }
    }

    onFullscreenToggle = (value?: boolean) => {
        this.setState(({ isFullscreen }) => ({
            isFullscreen: value !== undefined ? value : !isFullscreen,
        }))
    }

    onResize = (layout: Array<LayoutItem>) => {
        this.setState({
            layoutsByItemId: layout.reduce((result, item) => (
                Object.assign(result, {
                    [item.i]: item,
                })
            ), {}),
        })
    }

    onBeforeUnload = (e: Event & { returnValue: ?string }): ?string => {
        if (this.props.dashboard && this.props.dashboard.id && !this.props.dashboard.saved) {
            const message = 'You have unsaved changes in your Dashboard. Are you sure you want to leave?'
            e.returnValue = message
            return message
        }

        return undefined
    }

    generateLayout = (): ?Layout => {
        const db = this.props.dashboard
        const layout = db && _.zipObject(
            dashboardConfig.layout.sizes,
            _.map(dashboardConfig.layout.sizes, (size: 'lg' | 'md' | 'sm' | 'xs') => (
                db.items.map((item) => {
                    const id = Editor.generateItemId(item)
                    const layoutInfo = (db.layout && db.layout[size]) ? db.layout[size].find((l) => l.i === id) : undefined
                    return item.webcomponent ? {
                        ...dashboardConfig.layout.defaultLayout,
                        ...dashboardConfig.layout.layoutsBySizeAndModule[size][item.webcomponent],
                        ...(layoutInfo || {}),
                        i: id,
                    } : {}
                })
            )),
        )
        return layout
    }

    render() {
        const { dashboard } = this.props
        const layout = dashboard && dashboard.items && this.generateLayout()
        const items = dashboard && dashboard.items ? _.sortBy(dashboard.items, ['canvas', 'module']) : []
        const dragCancelClassName = `cancelDragging${Date.now()}`
        const locked = this.props.editorLocked || this.state.isFullscreen
        return dashboard ? (
            <div
                id="content-wrapper"
                className={`scrollable ${styles.editor}`}
            >
                <Fullscreen
                    enabled={this.state.isFullscreen}
                    onChange={this.onFullscreenToggle}
                >
                    <div className={styles.wrapper}>
                        <StreamrBreadcrumb>
                            <StreamrBreadcrumbItem href={links.userpages.dashboards}>
                                Dashboards
                            </StreamrBreadcrumbItem>
                            <StreamrBreadcrumbItem active>
                                {dashboard ? dashboard.name : 'New Dashboard'}
                            </StreamrBreadcrumbItem>
                            {(this.props.canShare || this.props.canWrite) && (
                                <StreamrBreadcrumbDropdownButton
                                    title="Settings"
                                >
                                    {this.props.canShare && (
                                        <MenuItem
                                            onClick={() => this.setState({
                                                sharingDialogIsOpen: true,
                                            })}
                                            className={styles.dropdownShareButton}
                                        >
                                            Share
                                        </MenuItem>
                                    )}
                                    {/* {this.props.canWrite && (
                                        // TODO: Different way to handle this other than depreciated componentClass
                                        <DeleteButton
                                            className={styles.dropdownDeleteButton}
                                            buttonProps={{
                                                componentClass: MenuItem,
                                            }}
                                        >
                                            <FontAwesome name="trash-o" /> Delete
                                        </DeleteButton>
                                    )} */}
                                    <ShareDialog
                                        isOpen={this.state.sharingDialogIsOpen}
                                        onClose={() => this.setState({
                                            sharingDialogIsOpen: false,
                                        })}
                                        resourceType="DASHBOARD"
                                        resourceId={this.props.dashboard && this.props.dashboard.id}
                                        resourceTitle={`Dashboard ${this.props.dashboard ? this.props.dashboard.name : ''}`}
                                    />
                                </StreamrBreadcrumbDropdownButton>
                            )}
                            <StreamrBreadcrumbToolbar>
                                <StreamrBreadcrumbToolbarButton
                                    iconName="expand"
                                    onClick={() => this.onFullscreenToggle()}
                                />
                            </StreamrBreadcrumbToolbar>
                        </StreamrBreadcrumb>
                        <ResponsiveReactGridLayout
                            layouts={layout}
                            rowHeight={60}
                            breakpoints={this.state.breakpoints}
                            cols={this.state.cols}
                            draggableCancel={`.${dragCancelClassName}`}
                            onLayoutChange={this.onLayoutChange}
                            onDragStop={this.onDragStop}
                            onResize={this.onResize}
                            isDraggable={!locked}
                            isResizable={!locked}
                            containerPadding={[18, 0]}
                        >
                            {items.map((dbItem) => {
                                const id = Editor.generateItemId(dbItem)
                                return (
                                    <div key={id}>
                                        <DashboardItem
                                            item={dbItem}
                                            currentLayout={this.state.layoutsByItemId[id]}
                                            dragCancelClassName={dragCancelClassName}
                                            isLocked={locked}
                                        />
                                    </div>
                                )
                            })}
                        </ResponsiveReactGridLayout>
                    </div>
                </Fullscreen>
            </div>
        ) : null
    }
}

export const mapStateToProps = (state: StoreState): StateProps => {
    const baseState = parseDashboard(state)
    const { dashboard } = baseState
    return {
        ...baseState,
        editorLocked: !!dashboard && (dashboard.editingLocked || (!dashboard.new && !baseState.canWrite)),
    }
}

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    update(id: DashboardId, changes: {}) {
        return dispatch(updateDashboardChanges(id, changes))
    },
    lockEditing(id: DashboardId) {
        dispatch(lockDashboardEditing(id))
    },
    unlockEditing(id: DashboardId) {
        dispatch(unlockDashboardEditing(id))
    },
    updateDashboardLayout(id: DashboardId, layout: Layout) {
        dispatch(updateDashboardLayout(id, layout))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Editor))
