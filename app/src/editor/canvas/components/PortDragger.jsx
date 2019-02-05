/* eslint-disable react/no-unused-state */

import React from 'react'
import cx from 'classnames'

import * as CanvasState from '../state'
import { DragDropContext, Draggable } from './DragDropContext'
import styles from './Ports.pcss'

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

    connectPorts() {
        const { data } = this.context
        const { sourceId, portId, overId } = data
        if (portId === overId) { return null } // noop if reconnecting to self
        this.props.api.setCanvas({ type: 'Connect Ports' }, (canvas) => {
            let nextCanvas = canvas
            if (sourceId) {
                // if dragging from an already connected input, treat as if dragging output
                nextCanvas = CanvasState.disconnectPorts(nextCanvas, sourceId, portId)
                nextCanvas = CanvasState.connectPorts(nextCanvas, sourceId, overId)
            } else {
                nextCanvas = CanvasState.connectPorts(nextCanvas, portId, overId)
            }
            return nextCanvas
        })
    }

    disconnectPorts() {
        const { data } = this.context
        const { sourceId, portId } = data
        if (!sourceId) { return } // not connected
        this.props.api.setCanvas({ type: 'Disconnect Ports' }, (canvas) => (
            CanvasState.disconnectPorts(canvas, sourceId, portId)
        ))
    }

    onStartDragPort = () => {
        const { port } = this.props

        return {
            portId: port.id,
            sourceId: port.sourceId,
        }
    }

    render() {
        return (
            <Draggable
                defaultClassNameDragging={styles.isDragging}
                handle={`.${styles.dragHandle}`}
                cancel={`.${styles.dragCancel}`}
                onStop={this.onDropPort}
                onStart={this.onStartDragPort}
                onDrag={this.onDragPort}
            >
                {this.props.children}
            </Draggable>
        )
    }
}

export function DragSource({ api, port }) {
    return (
        <DraggablePort api={api} port={port}>
            <div className={cx(styles.portDragger, styles.portDragSource, styles.dragHandle)} />
        </DraggablePort>
    )
}

export class DropTarget extends React.PureComponent {
    static contextType = DragDropContext

    onMouseOverTarget = () => {
        const dragPortInProgress = this.context.isDragging && this.context.data.portId != null
        if (!dragPortInProgress) { return }
        this.context.updateData({
            overId: this.props.port.id,
        })
    }

    onMouseOutTarget = () => {
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
                className={cx(styles.portDragger, styles.portDropTarget)}
                onMouseOver={this.onMouseOverTarget}
                onMouseOut={this.onMouseOutTarget}
            />
        )
    }
}
