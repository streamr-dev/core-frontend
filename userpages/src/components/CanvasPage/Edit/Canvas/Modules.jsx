import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import update from 'lodash/fp/update'

import styles from './index.pcss'
import { DragTypes } from './state'

import Port from './Port'
import Cables from './Cables'

class CanvasModule extends React.Component {
    render() {
        const { module, getOnPort, connectDragSource, isDragging } = this.props

        const {
            name,
            layout,
            params,
            inputs,
            outputs,
        } = module

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
                            <Port
                                key={port.id}
                                port={port}
                                direction="input"
                                portType="param"
                                ref={getOnPort(port)}
                            />
                        ))}
                        {inputs.map((port) => (
                            <Port
                                key={port.id}
                                port={port}
                                direction="input"
                                portType="input"
                                ref={getOnPort(port)}
                            />
                        ))}
                    </div>
                    <div className={`${styles.ports} ${styles.outputs}`}>
                        {outputs.map((port) => (
                            <Port
                                key={port.id}
                                port={port}
                                direction="output"
                                portType="output"
                                ref={getOnPort(port)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        ))
    }
}

const CanvasModuleDragDrop = DragSource(DragTypes.Module, {
    beginDrag({ module }) {
        return module
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
                            module={m}
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
    drop(props, monitor) {
        const { hash } = monitor.getItem()
        const diff = monitor.getDifferenceFromInitialOffset()
        const index = props.canvas.modules.findIndex((m) => m.hash === hash)
        props.updateCanvas((
            update(['modules', index, 'layout', 'position'], (position) => {
                if (!position) { return null }
                return {
                    ...position,
                    top: `${Number.parseInt(position.top, 10) + diff.y}px`,
                    left: `${Number.parseInt(position.left, 10) + diff.x}px`,
                }
            }, props.canvas)
        ))
    },
}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
}))(CanvasElements)

export default CanvasElementsDropTarget
