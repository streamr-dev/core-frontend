import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import cx from 'classnames'
import debounce from 'lodash/debounce'

import { DropTarget } from './dnd'
import Module from './Module'
import Cables from './Cables'
import * as CanvasState from './state'

import styles from './index.pcss'

const { DragTypes } = CanvasState

export default DragDropContext(HTML5Backend)(class Canvas extends React.Component {
    onDropModule = (props, monitor) => {
        const { moduleId } = monitor.getItem()
        const diff = monitor.getDifferenceFromInitialOffset()

        this.props.setCanvas((canvas) => (
            CanvasState.updateModulePosition(canvas, moduleId, diff)
        ))
    }

    onDragModule = (props) => ({ moduleId: props.module.hash })

    onCanDropPort = (props, monitor) => {
        const from = monitor.getItem()
        const fromId = from.sourceId || from.portId
        return CanvasState.canConnectPorts(this.props.canvas, fromId, props.port.id)
    }

    onDragPort = ({ port }) => ({
        portId: port.id,
        sourceId: port.sourceId,
    })

    onDragEndPort = ({ port }, monitor) => {
        if (!monitor.didDrop() && port.sourceId) {
            // disconnect if dragging from connected input into nowhere
            this.props.setCanvas((canvas) => (
                CanvasState.disconnectPorts(canvas, port.sourceId, port.id)
            ))
        }
    }

    onDropPort = (props, monitor) => {
        const from = monitor.getItem()
        this.props.setCanvas((canvas) => {
            let nextCanvas = canvas
            if (from.sourceId) {
                // if dragging from an already connected input, treat as if dragging output
                nextCanvas = CanvasState.disconnectPorts(nextCanvas, from.sourceId, from.portId)
                nextCanvas = CanvasState.connectPorts(nextCanvas, from.sourceId, props.port.id)
            } else {
                nextCanvas = CanvasState.connectPorts(nextCanvas, from.portId, props.port.id)
            }
            return nextCanvas
        })
    }

    dnd = {
        module: {
            onDrag: this.onDragModule,
            onDrop: this.onDropModule,
            onCanDrop: () => true,
            onCanDrag: () => true,
        },
        port: {
            onDrag: this.onDragPort,
            onDrop: this.onDropPort,
            onCanDrop: this.onCanDropPort,
            onDragEnd: this.onDragEndPort,
            onCanDrag: () => true,
        },
    }

    render() {
        const { className, ...props } = this.props

        return (
            <div className={cx(styles.Canvas, className)}>
                <CanvasElements
                    key={props.canvas.id}
                    {...props}
                    dnd={this.dnd}
                    {...this.dnd.module}
                />
            </div>
        )
    }
})

const CanvasElements = DropTarget(DragTypes.Module)(class CanvasElements extends React.PureComponent {
    ports = new Map()

    state = {
        positions: {},
    }

    componentDidMount() {
        this.update()
    }

    onPort = (portId, el) => {
        this.ports.set(portId, el)
        this.update()
    }

    update = debounce(() => {
        if (!this.modules) {
            return
        }

        const offset = this.modules.getBoundingClientRect()
        const positions = [...this.ports.entries()].reduce((r, [id, el]) => {
            if (!el) { return r }
            const rect = el.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) { return r }
            return Object.assign(r, {
                [id]: {
                    id,
                    top: rect.top - offset.top + (rect.height / 2),
                    bottom: rect.bottom - offset.bottom + (rect.height / 2),
                    left: rect.left - offset.left + (rect.width / 2),
                    right: rect.right - offset.right + (rect.width / 2),
                    width: rect.width,
                    height: rect.height,
                },
            })
        }, {})

        this.setState({ positions })
    }, {
        leading: true,
        timeout: 100,
    })

    modulesRef = (el) => {
        this.modules = el
        this.update()
    }

    render() {
        const {
            connectDropTarget,
            canvas,
            dnd,
            monitor,
            itemType,
        } = this.props
        if (!canvas) { return null }
        return connectDropTarget((
            <div className={styles.CanvasElements}>
                <div className={styles.Modules} ref={this.modulesRef}>
                    {canvas.modules.map((m) => (
                        <Module
                            key={m.hash}
                            module={m}
                            canvas={canvas}
                            onPort={this.onPort}
                            dnd={dnd}
                            {...dnd.module}
                        />
                    ))}
                </div>
                <Cables
                    canvas={canvas}
                    monitor={monitor}
                    itemType={itemType}
                    positions={this.state.positions}
                />
            </div>
        ))
    }
})
