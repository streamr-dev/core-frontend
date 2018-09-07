import React from 'react'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import cx from 'classnames'
import update from 'lodash/fp/update'

import styles from './Canvas.pcss'

function curvedHorizontal(x1, y1, x2, y2) {
    const line = []
    const mx = x1 + ((x2 - x1) / 2)

    line.push('M', x1, y1)
    line.push('C', mx, y1, mx, y2, x2, y2)

    return line.join(' ')
}

class Cables extends React.Component {
    render() {
        const { canvas, positions } = this.props
        const cables = canvas.modules.reduce((c, m) => {
            m.params.forEach((port) => {
                if (!port.connected) { return }
                c.push([port.sourceId, port.id])
            })
            m.inputs.forEach((port) => {
                if (!port.connected) { return }
                c.push([port.sourceId, port.id])
            })
            return c
        }, [])
        return (
            <svg
                className={styles.Cables}
                preserveAspectRatio="xMidYMid meet"
                height="100%"
                width="100%"
            >
                {cables.map(([from, to]) => {
                    if (!positions[from] || !positions[to]) { return null }
                    const halfHeight = positions[from].height / 2
                    const halfWidth = positions[from].width / 2
                    return (
                        <path
                            key={`${from}-${to}`}
                            className={styles.Connection}
                            d={curvedHorizontal(
                                positions[from].left + halfWidth,
                                positions[from].top + halfHeight,
                                positions[to].left + halfWidth,
                                positions[to].top + halfHeight,
                            )}
                        />
                    )
                })}
            </svg>
        )
    }
}

const Port = React.forwardRef((props, ref) => (
    <React.Fragment>
        <div className={styles.port}>
            {props.displayName || props.name}
        </div>
        <div
            ref={ref}
            key={props.id}
            className={cx(styles.portIcon, {
                [styles.connected]: props.connected,
            })}
        />
    </React.Fragment>
))

class CanvasModule extends React.Component {
    render() {
        const {
            name,
            layout,
            params,
            inputs,
            outputs,
            getOnPort,
            connectDragSource,
            isDragging,
        } = this.props

        return connectDragSource((
            <div
                className={styles.Module}
                hidden={isDragging}
                style={{
                    top: layout.position.top,
                    left: layout.position.left,
                    width: layout.width,
                    height: layout.height,
                }}
            >
                <div className={styles.moduleHeader}>
                    <div className={styles.name}>{name}</div>
                </div>
                <div className={styles.portsContainer}>
                    <div className={`${styles.ports} ${styles.inputs}`}>
                        {params.map((port) => (
                            <Port key={port.id} {...port} ref={getOnPort(port)} />
                        ))}
                        {inputs.map((port) => (
                            <Port key={port.id} {...port} ref={getOnPort(port)} />
                        ))}
                    </div>
                    <div className={`${styles.ports} ${styles.outputs}`}>
                        {outputs.map((port) => (
                            <Port key={port.id} {...port} ref={getOnPort(port)} />
                        ))}
                    </div>
                </div>
            </div>
        ))
    }
}

const DragTypes = {
    Module: 'Module',
}

const CanvasModuleDragDrop = DragSource(DragTypes.Module, {
    beginDrag({ hash }) {
        return { hash }
    },
}, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))(CanvasModule)

class CanvasElements extends React.Component {
    ports = {}

    positions = {}

    componentDidMount() {
        this.update()
    }

    componentWillUnmount() {
        clearTimeout(this.k)
    }

    onDrop(monitor) {
        const { hash } = monitor.getItem()
        const diff = monitor.getDifferenceFromInitialOffset()
        const index = this.props.canvas.modules.findIndex((m) => m.hash === hash)
        this.props.updateCanvas((
            update(['modules', index, 'layout', 'position'], (position) => ({
                ...position,
                top: `${Number.parseInt(position.top, 10) + diff.y}px`,
                left: `${Number.parseInt(position.left, 10) + diff.x}px`,
            }), this.props.canvas)
        ))

        this.update()
    }

    getOnPort = (port) => (el) => {
        this.ports = {
            ...this.ports,
            [port.id]: el,
        }
        if (!el) {
            this.positions = {
                ...this.positions,
                [port.id]: undefined,
            }
        }
        this.update()
    }

    update = () => {
        if (!this.modules) {
            return
        }

        const offset = this.modules.getBoundingClientRect()
        this.positions = Object.entries(this.ports).reduce((r, [id, el]) => {
            if (!el) { return r }
            const elRect = el.getBoundingClientRect()
            if (elRect.width === 0 || elRect.height === 0) { return r }
            const rect = {
                top: elRect.top - offset.top,
                left: elRect.left - offset.left,
                right: elRect.right - offset.right,
                bottom: elRect.bottom - offset.bottom,
                width: elRect.width,
                height: elRect.height,
            }
            return Object.assign(r, {
                [id]: rect,
            })
        }, {})
        this.forceUpdate()
    }

    modulesRef = (el) => {
        this.modules = el
        this.update()
    }

    render() {
        const { connectDropTarget, canvas } = this.props
        if (!canvas) { return null }

        return connectDropTarget((
            <div className={styles.CanvasElements}>
                <div className={styles.Modules} ref={this.modulesRef}>
                    {canvas.modules.map((m) => (
                        <CanvasModuleDragDrop
                            key={m.hash}
                            {...m}
                            getOnPort={this.getOnPort}
                        />
                    ))}
                </div>
                <Cables canvas={canvas} positions={this.positions} />
            </div>
        ))
    }
}

const CanvasElementsDropTarget = DropTarget(DragTypes.Module, {
    drop(props, monitor, component) {
        component.onDrop(monitor)
    },
}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
}))(CanvasElements)

export default DragDropContext(HTML5Backend)(class Canvas extends React.Component {
    render() {
        const { className, ...props } = this.props

        return (
            <div className={cx(styles.Canvas, className)}>
                {props.canvas && (
                    <CanvasElementsDropTarget
                        key={props.canvas.id}
                        {...props}
                    />
                )}
            </div>
        )
    }
})
