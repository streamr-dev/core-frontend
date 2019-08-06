/* eslint-disable react/no-unused-state */

import React from 'react'
import cx from 'classnames'

import * as CanvasState from '../state'
import { DragDropContext, Draggable } from './DragDropContext'
import Dragger from './Ports/Dragger'
import Plug from './Ports/Plug'

class DraggablePort extends React.Component {
    static contextType = DragDropContext

    componentWillUnmount() {
        this.unmounted = true
    }

    onDropPort = (event, stopData, reset) => {
        if (this.unmounted) { return }
        const { data } = this.context
        const { overId } = data

        if (overId == null) {
            this.disconnectPorts()
        } else {
            this.connectPorts()
        }

        reset()
    }

    canConnectPorts(canvas) {
        const { data } = this.context
        const { sourceId, portId, overId } = data
        if (portId === overId) { return false } // cannot re-connect to self
        const fromId = sourceId || portId // treat as if dragging sourceId
        return CanvasState.canConnectPorts(canvas, fromId, overId)
    }

    connectPorts() {
        if (this.unmounted) { return }
        const triggeredPorts = []
        const { data } = this.context
        const { sourceId, portId, overId } = data
        this.props.api.setCanvas({ type: 'Connect Ports' }, (canvas) => {
            if (!this.canConnectPorts(canvas)) { return null } // noop if incompatible
            let nextCanvas = canvas
            if (sourceId) {
                // if dragging from an already connected input, treat as if dragging output
                const disconnectedPort = CanvasState.getPort(canvas, sourceId)

                // disconnect and reload port with sourceId (if ethereum contract)
                if (disconnectedPort.type === 'EthereumContract') {
                    triggeredPorts.push({
                        portId,
                        oldValue: disconnectedPort.value,
                        newValue: undefined,
                    })
                }

                // connect and reload port with portId (if ethereum contract)
                const connectingPort = CanvasState.getPort(canvas, overId)
                nextCanvas = CanvasState.movePortConnection(nextCanvas, sourceId, overId, {
                    currentInputId: portId,
                })
                const connectedPort = CanvasState.getPort(nextCanvas, overId)

                if (connectingPort.type === 'EthereumContract') {
                    triggeredPorts.push({
                        portId: overId,
                        oldValue: connectingPort.value,
                        newValue: connectedPort.value,
                    })
                }
            } else {
                // Check if port is ethereum contract and should it reload.
                const connectingPort = CanvasState.getPort(canvas, overId)
                nextCanvas = CanvasState.connectPorts(nextCanvas, portId, overId)
                const connectedPort = CanvasState.getPort(nextCanvas, overId)

                if (connectingPort.type === 'EthereumContract') {
                    triggeredPorts.push({
                        portId: overId,
                        oldValue: connectingPort.value,
                        newValue: connectedPort.value,
                    })
                }
            }
            return nextCanvas
        }, () => {
            if (triggeredPorts.length > 0) {
                triggeredPorts.forEach(({ portId, oldValue, newValue }) => {
                    this.props.onValueChange(portId, newValue, oldValue)
                })
            }
        })
    }

    disconnectPorts() {
        if (this.unmounted) { return }
        const { data } = this.context
        const { sourceId, portId } = data
        if (!sourceId) { return } // not connected
        const triggeredPorts = []
        this.props.api.setCanvas({ type: 'Disconnect Ports' }, (canvas) => {
            const disconnectedPort = CanvasState.getPort(canvas, portId)
            const nextCanvas = CanvasState.disconnectPorts(canvas, sourceId, portId)

            if (disconnectedPort.type === 'EthereumContract') {
                triggeredPorts.push({
                    portId,
                    oldValue: disconnectedPort.value,
                })
            }

            return nextCanvas
        }, () => {
            if (triggeredPorts.length > 0) {
                triggeredPorts.forEach(({ portId, oldValue }) => {
                    this.props.onValueChange(portId, undefined, oldValue)
                })
            }
        })
    }

    onStartDragPort = () => {
        if (this.unmounted) { return }
        const { port } = this.props

        return {
            portId: port.id,
            sourceId: port.sourceId,
        }
    }

    render() {
        return (
            <Draggable
                defaultClassNameDragging={Plug.styles.isDragged}
                handle={`.${Dragger.styles.dragHandle}`}
                cancel={`.${Dragger.styles.dragCancel}`}
                onStop={this.onDropPort}
                onStart={this.onStartDragPort}
                onDrag={this.onDragPort}
            >
                {this.props.children}
            </Draggable>
        )
    }
}

export function DragSource({ api, port, onValueChange, className }) {
    return (
        <DraggablePort api={api} port={port} onValueChange={onValueChange}>
            <div
                className={cx(Dragger.styles.root, Dragger.styles.source, Dragger.styles.dragHandle, className)}
            />
        </DraggablePort>
    )
}

export class DropTarget extends React.PureComponent {
    static contextType = DragDropContext
    componentWillUnmount() {
        this.unmounted = true
    }

    onMouseOverTarget = () => {
        if (this.unmounted) { return }
        const dragPortInProgress = this.context.isDragging && this.context.data.portId != null
        if (!dragPortInProgress) { return }
        this.context.updateData({
            overId: this.props.port.id,
        })
    }

    onMouseOutTarget = () => {
        if (this.unmounted) { return }
        const dragPortInProgress = this.context.isDragging && this.context.data.portId != null
        if (!dragPortInProgress) { return }
        this.context.updateData({
            overId: undefined,
        })
    }

    render() {
        return (
            /* eslint-disable-next-line max-len */
            /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/mouse-events-have-key-events, jsx-a11y/no-noninteractive-tabindex */
            <div
                className={cx(Dragger.styles.root, Dragger.styles.target, this.props.className, this.props.className)}
                onMouseOver={this.onMouseOverTarget}
                onMouseOut={this.onMouseOutTarget}
            />
        )
    }
}
