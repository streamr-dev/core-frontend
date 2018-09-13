import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import cx from 'classnames'

import * as CanvasState from './state'
import Modules from './Modules'

import styles from './index.pcss'

export default DragDropContext(HTML5Backend)(class Canvas extends React.Component {
    onDropModule = (props, monitor) => {
        const { moduleId } = monitor.getItem()
        const diff = monitor.getDifferenceFromInitialOffset()

        this.props.setCanvas((canvas) => (
            CanvasState.updateModulePosition(canvas, moduleId, diff)
        ))
    }

    onDragModule = (props) => ({ moduleId: props.module.hash })

    dndModule = {
        onDrag: this.onDragModule,
        onDrop: this.onDropModule,
        onCanDrop: () => true,
        onCanDrag: () => true,
    }

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

    dndPort = {
        onDrag: this.onDragPort,
        onDrop: this.onDropPort,
        onCanDrop: this.onCanDropPort,
        onDragEnd: this.onDragEndPort,
        onCanDrag: () => true,
    }

    render() {
        const { className, ...props } = this.props

        return (
            <div className={cx(styles.Canvas, className)}>
                <Modules
                    key={props.canvas.id}
                    {...props}
                    dndPort={this.dndPort}
                    {...this.dndModule}
                />
            </div>
        )
    }
})
