import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import cx from 'classnames'

import { DropTarget } from '../utils/dnd'
import * as CanvasState from '../state'

import Module from './Module'
import Cables from './Cables'

import styles from './Canvas.pcss'

const { DragTypes } = CanvasState

export default DragDropContext(HTML5Backend)(class Canvas extends React.Component {
    onDropModule = (props, monitor) => {
        const { moduleHash } = monitor.getItem()
        const diff = monitor.getDifferenceFromInitialOffset()

        this.props.setCanvas({ type: 'Move Module' }, (canvas) => (
            CanvasState.updateModulePosition(canvas, moduleHash, diff)
        ))
    }

    onDragModule = (props) => ({ moduleHash: props.module.hash })

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
            this.props.setCanvas({ type: 'Disconnect Ports' }, (canvas) => (
                CanvasState.disconnectPorts(canvas, port.sourceId, port.id)
            ))
        }
    }

    onDropPort = (props, monitor) => {
        const from = monitor.getItem()
        this.props.setCanvas({ type: 'Connect Ports' }, (canvas) => {
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

    setPortValue = (portId, value) => {
        this.props.setCanvas({ type: 'Set Port Value' }, (canvas) => (
            CanvasState.setPortValue(canvas, portId, value)
        ))
    }

    /**
     * Module & Port Drag/Drop APIs
     */

    api = {
        selectModule: this.props.selectModule,
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
            onChange: this.setPortValue,
        },
    }

    render() {
        const { className, canvas, selectedModuleHash } = this.props

        return (
            <div className={cx(styles.Canvas, className)}>
                <CanvasElements
                    key={canvas.id}
                    canvas={canvas}
                    api={this.api}
                    selectedModuleHash={selectedModuleHash}
                    {...this.api.module}
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

    componentDidUpdate(prevProps) {
        if (prevProps.canvas === this.props.canvas) { return }
        this.update()
    }

    onPort = (portId, el) => {
        this.ports.set(portId, el)
        this.update()
    }

    update = () => {
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
                    top: (rect.top - offset.top) + (rect.height / 2),
                    bottom: (rect.bottom - offset.bottom) + (rect.height / 2),
                    left: (rect.left - offset.left) + (rect.width / 2),
                    right: (rect.right - offset.right) + (rect.width / 2),
                    width: rect.width,
                    height: rect.height,
                },
            })
        }, {})

        this.setState({ positions })
    }

    modulesRef = (el) => {
        this.modules = el
        this.update()
    }

    render() {
        const {
            connectDropTarget,
            canvas,
            api,
            monitor,
            itemType,
            selectedModuleHash,
        } = this.props
        if (!canvas) { return null }
        return connectDropTarget((
            <div className={styles.CanvasElements}>
                <div className={styles.Modules} ref={this.modulesRef} role="grid">
                    {canvas.modules.map((m) => (
                        <Module
                            key={m.hash}
                            module={m}
                            canvas={canvas}
                            onPort={this.onPort}
                            api={api}
                            selectedModuleHash={selectedModuleHash}
                            {...api.module}
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
