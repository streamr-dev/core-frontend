import React from 'react'
import cx from 'classnames'
import sortBy from 'lodash/sortBy'
import isEqual from 'lodash/isEqual'
import zipObject from 'lodash/zipObject'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'

import RenameInput from '$editor/components/RenameInput'

import ModuleStyles from '$editor/components/Module.pcss'
import CanvasStyles from '$editor/components/Canvas.pcss'

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
    }
}

const normalizeItemList = (itemList = []) => (
    sortBy(itemList, 'i').map(normalizeLayoutItem)
)

const normalizeLayout = (targetLayout) => dashboardConfig.layout.sizes.reduce((obj, size) => (
    Object.assign(obj, {
        [size]: (targetLayout && targetLayout[size]) ? normalizeItemList(targetLayout[size]) : [],
    })
), {})

class DashboardItem extends React.Component {
    render() {
        const { item, isSelected } = this.props
        return (
            <div
                className={cx(styles.dashboardItem, ModuleStyles.ModuleBase, {
                    [ModuleStyles.isSelected]: isSelected,
                })}
            >
                <div className={ModuleStyles.moduleHeader}>
                    <RenameInput
                        className={ModuleStyles.name}
                        value={item.title}
                        onChange={console.info}
                        required
                    />
                </div>
                <div>
                    {item.webcomponent}
                </div>
            </div>
        )
    }
}

export default WidthProvider(class DashboardEditor extends React.Component {
    state = {
        breakpoints: dashboardConfig.layout.breakpoints,
        layoutsByItemId: {},
        isFullscreen: false,
    }

    updateDashboardLayout = (layout) => {
        const { dashboard } = this.props
        if (isEqual(normalizeLayout(layout), normalizeLayout(dashboard.layout))) { return }
        this.props.setDashboard({ type: 'Update Layout' }, (dashboard) => ({
            ...dashboard,
            layout,
        }))
    }

    generateLayout = () => {
        const { dashboard } = this.props
        const layout = dashboard && zipObject(
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
                    }
                })
            )),
        )
        return layout
    }

    onLayoutChange = (layout, allLayouts) => {
        console.log('onLayoutChange', {
            layout,
            allLayouts,
        })
        this.onResize(layout)
        this.updateDashboardLayout(allLayouts)
    }

    onFullscreenToggle = (value) => {
        this.setState(({ isFullscreen }) => ({
            isFullscreen: value !== undefined ? value : !isFullscreen,
        }))
    }

    onResize = (layout) => {
        this.setState({
            layoutsByItemId: layout.reduce((result, item) => (
                Object.assign(result, {
                    [item.i]: item,
                })
            ), {}),
        })
    }

    onDragStop = () => {

    }

    render() {
        const { className, dashboard, editorLocked } = this.props
        if (!dashboard) { return null }
        const layout = dashboard && dashboard.items && this.generateLayout()
        const items = dashboard && dashboard.items ? sortBy(dashboard.items, ['canvas', 'module']) : []
        const dragCancelClassName = `cancelDragging${Date.now()}`
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
                    className={CanvasStyles.CanvasElements}
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
                        compactType={null}
                        draggableCancel={`.${dragCancelClassName}`}
                        onLayoutChange={this.onLayoutChange}
                        onDragStop={this.onDragStop}
                        onResize={this.onResize}
                        isDraggable={!locked}
                        isResizable={!locked}
                    >
                        {items.map((dbItem) => {
                            const id = generateItemId(dbItem)
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
            </div>
        )
    }
})
