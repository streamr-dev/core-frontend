import React from 'react'
import cx from 'classnames'
import sortBy from 'lodash/sortBy'
import isEqual from 'lodash/isEqual'
import zipObject from 'lodash/zipObject'
import { Responsive, WidthProvider } from 'react-grid-layout'

import ModuleHeader from '$editor/shared/components/ModuleHeader'
import ModuleUI from '$editor/shared/components/ModuleUI'

import { SelectionContext } from '$shared/hooks/useSelection'

import 'react-grid-layout/css/styles.css'
import ModuleStyles from '$editor/shared/components/Module.pcss'
import CanvasStyles from '$editor/canvas/components/Canvas.pcss'
import dashboardConfig from '../config'
import Background from './Background'
import styles from './Dashboard.pcss'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

function generateItemId(item) {
    return `${item.canvas}-${item.module}`
}

function normalizeLayoutItem(item) {
    return {
        i: item.i || 0,
        h: item.h || 0,
        isDraggable: item.isDraggable,
        isResizable: item.isResizable,
        maxH: item.maxH,
        maxW: item.maxW,
        minH: item.minH || 0,
        minW: item.minW || 0,
        moved: item.moved || false,
        static: item.static || false,
        w: item.w || 0,
        x: item.x || 0,
        y: item.y || 0,
        title: item.title,
        type: item.type,
    }
}

const normalizeItemList = (itemList = []) => (
    sortBy(itemList, 'i').map(normalizeLayoutItem)
)

export const normalizeLayout = (targetLayout) => dashboardConfig.layout.sizes.reduce((obj, size) => (
    Object.assign(obj, {
        [size]: (targetLayout && targetLayout[size]) ? normalizeItemList(targetLayout[size]) : [],
    })
), {})

export function generateLayout(dashboard) {
    return dashboard && zipObject(
        dashboardConfig.layout.sizes,
        dashboardConfig.layout.sizes.map((size) => (
            dashboard.items.map((item) => {
                if (!item.webcomponent) { return {} }
                const id = generateItemId(item)
                const layoutInfo = ((dashboard.layout && dashboard.layout[size]) && dashboard.layout[size].find((l) => l.i === id)) || {}
                return {
                    ...dashboardConfig.layout.defaultLayout,
                    ...dashboardConfig.layout.layoutsBySizeAndModule[size][item.webcomponent],
                    ...layoutInfo,
                    i: id,
                    title: item.title,
                    type: item.webcomponent,
                }
            })
        )),
    )
}

/**
 * Each module on a dashboard is a DashboardItem
 */

class DashboardItem extends React.Component {
    state = {}
    renameItem = (title) => {
        this.props.setDashboard({ type: 'Rename Item' }, (dashboard) => ({
            ...dashboard,
            items: dashboard.items.map((item) => {
                if (item.id !== this.props.item.id) { return item }
                return {
                    ...item,
                    title,
                }
            }),
        }))
    }

    onError = (error) => {
        if (this.unmounted) { return }
        console.warn('Dashboard Module Load Error', error) // eslint-disable-line no-console
        this.setState({ error })
    }

    onLoad = () => {
        if (this.unmounted) { return }
        this.setState({ error: undefined })
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    render() {
        const { item, disabled, selectItem, isSelected } = this.props
        return (
            /* eslint-disable-next-line max-len */
            /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-tabindex */
            <div
                className={cx(styles.dashboardItem, ModuleStyles.ModuleBase, {
                    [styles.isSelected]: isSelected,
                    [styles.isInactive]: !!this.state.error,
                })}
                tabIndex="0"
                onFocus={() => selectItem(item.id)}
                data-itemid={item.id}
            >
                <ModuleHeader
                    className={cx(styles.header, ModuleStyles.dragHandle)}
                    editable={!disabled}
                    label={item.title}
                    limitWidth
                    onLabelChange={this.renameItem}
                />
                <ModuleUI
                    className={cx(styles.dashboardModuleUI, ModuleStyles.dragCancel)}
                    canvasId={item.canvas}
                    dashboardId={item.dashboard}
                    moduleHash={item.module}
                    onError={this.onError}
                    onLoad={this.onLoad}
                    isActive
                    isSubscriptionActive
                />
            </div>
        )
    }
}

export default WidthProvider(class DashboardEditor extends React.Component {
    static contextType = SelectionContext

    state = {
        breakpoints: dashboardConfig.layout.breakpoints,
        layoutsByItemId: {},
        isFullscreen: false,
    }

    updateDashboardLayout = (layout) => {
        const { dashboard } = this.props
        if (isEqual(normalizeLayout(layout), normalizeLayout(dashboard.layout))) { return }

        if (this.userChangedLayout) {
            // create new undo item if user changed layout
            this.props.setDashboard({ type: 'Update Layout' }, (dashboard) => ({
                ...dashboard,
                layout,
            }))
        } else {
            // replace state if layout update was not triggered by user changing layout
            // e.g. new item added
            this.props.replaceDashboard((dashboard) => ({
                ...dashboard,
                layout,
            }))
        }
    }

    onLayoutChange = (layout, allLayouts) => {
        this.updateLayout(layout)
        this.updateDashboardLayout(allLayouts)
        this.userChangedLayout = false
    }

    onFullscreenToggle = (value) => {
        // TODO: this is not currently hooked up
        this.setState(({ isFullscreen }) => ({
            isFullscreen: value !== undefined ? value : !isFullscreen,
        }))
    }

    updateLayout = (layout) => {
        this.setState({
            layoutsByItemId: layout.reduce((result, item) => (
                Object.assign(result, {
                    [item.i]: item,
                })
            ), {}),
        })
    }

    onResize = (layout) => {
        this.updateLayout(layout)
    }

    onResizeStop = (layout, oldItem, newItem) => {
        if (isEqual(oldItem, newItem)) { return } // noop if no change
        this.userChangedLayout = true
        this.updateLayout(layout)
    }

    onDragStop = (layout, oldItem, newItem) => {
        if (isEqual(oldItem, newItem)) { return } // noop if no change
        this.userChangedLayout = true
        this.updateLayout(layout)
    }

    render() {
        const { className, dashboard, editorLocked, children } = this.props
        if (!dashboard) { return null }

        const select = this.context

        const layout = dashboard && dashboard.items && generateLayout(dashboard)
        const items = dashboard && dashboard.items ? sortBy(dashboard.items, ['canvas', 'module']) : []
        const locked = editorLocked || this.state.isFullscreen
        const { breakpoints } = dashboardConfig.layout
        const [breakpoint] = sortBy(Object.entries(breakpoints), '1')
            .find((k, index, arr) => (
                k[1] >= this.props.width || index === arr.length - 1
            ))
        const cols = dashboardConfig.layout.cols[breakpoint]
        const gridSize = Math.floor(this.props.width / (cols - 4))
        const cellSize = (gridSize + 10) / 4

        return (
            <div className={cx(className, CanvasStyles.Canvas)}>
                <div
                    className={cx(CanvasStyles.CanvasElements, styles.DashboardElements)}
                    style={{
                        backgroundImage: `url(${Background({
                            width: cellSize,
                            height: cellSize,
                            stroke: '#E7E7E7',
                        })})`,
                    }}
                >
                    <ResponsiveReactGridLayout
                        layouts={layout}
                        containerPadding={[cellSize, cellSize]}
                        rowHeight={gridSize}
                        margin={[cellSize, cellSize]}
                        breakpoints={this.state.breakpoints}
                        cols={this.props.props}
                        compactType="horizontal"
                        draggableCancel={`.${ModuleStyles.dragCancel}`}
                        draggableHandle={`.${ModuleStyles.dragHandle}`}
                        onLayoutChange={this.onLayoutChange}
                        onDragStop={this.onDragStop}
                        onResizeStop={this.onResizeStop}
                        onResize={this.onResize}
                        isDraggable={!locked}
                        isResizable={!locked}
                    >
                        {items.map((item) => {
                            const id = generateItemId(item)
                            return (
                                <div key={id}>
                                    <DashboardItem
                                        item={item}
                                        dashboard={dashboard}
                                        setDashboard={this.props.setDashboard}
                                        isSelected={select.has(id)}
                                        selectItem={() => select.only(id)}
                                        currentLayout={this.state.layoutsByItemId[id]}
                                        disabled={locked}
                                    />
                                </div>
                            )
                        })}
                    </ResponsiveReactGridLayout>
                </div>
                {children}
            </div>
        )
    }
})
