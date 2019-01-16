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
import ModuleUI from '$editor/components/ModuleUI'
import { withAuthKey } from '$editor/components/Subscription'

import dashboardConfig from '../config'
import * as services from '../services'

import { SelectionContext } from './Selection'

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

const DashboardItem = withAuthKey(class DashboardItem extends React.Component {
    state = {
        module: undefined,
    }

    componentDidMount() {
        this.load()
    }

    async load() {
        const module = await services.getModuleData(this.props)
        this.setState({ module })
    }

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

    render() {
        const { item, disabled, selectItem, isSelected } = this.props
        return (
            /* eslint-disable-next-line max-len */
            /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-tabindex */
            <div
                className={cx(styles.dashboardItem, ModuleStyles.ModuleBase, {
                    [styles.isSelected]: isSelected,
                    [styles.isInactive]: !this.state.module,
                })}
                tabIndex="0"
                onFocus={() => selectItem(item.id)}
                data-itemid={item.id}
            >
                <div className={ModuleStyles.moduleHeader}>
                    <RenameInput
                        className={ModuleStyles.name}
                        value={item.title}
                        onChange={this.renameItem}
                        disabled={disabled}
                        required
                    />
                </div>
                {!!this.state.module && (
                    <ModuleUI className={styles.dashboardModule} module={this.state.module} isActive />
                )}
            </div>
        )
    }
})

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
        this.onResize(layout)
        this.updateDashboardLayout(allLayouts)
        this.userChangedLayout = false
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
        this.userChangedLayout = true
    }

    render() {
        const { className, dashboard, editorLocked } = this.props
        const select = this.context
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
                        compactType="horizontal"
                        draggableCancel={`.${dragCancelClassName}`}
                        onLayoutChange={this.onLayoutChange}
                        onDragStop={this.onDragStop}
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
                                        isSelected={select.selection.has(id)}
                                        selectItem={() => select.api.only(id)}
                                        currentLayout={this.state.layoutsByItemId[id]}
                                        dragCancelClassName={dragCancelClassName}
                                        disabled={locked}
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
