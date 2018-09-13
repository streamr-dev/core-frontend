import React, { Component } from 'react'
import { connect } from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'

import { getCanvas } from '../../../modules/canvas/actions'
import Canvas from './Canvas/index'
import * as CanvasState from './Canvas/state'
import CanvasToolbar from './Toolbar'

import styles from './index.pcss'

class CanvasEdit extends Component {
    state = {
        canvas: undefined,
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.canvas) {
            return { canvas: undefined }
        }
        if (state.canvas) {
            return null
        }
        return {
            canvas: cloneDeep(props.canvas),
        }
    }

    onDropModule = (props, monitor) => {
        const { moduleId } = monitor.getItem()
        const diff = monitor.getDifferenceFromInitialOffset()

        this.setState(({ canvas }) => ({
            canvas: CanvasState.updateModulePosition(canvas, moduleId, diff),
        }))
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
        return CanvasState.canConnectPorts(this.state.canvas, fromId, props.port.id)
    }

    onDragPort = ({ port }) => ({
        portId: port.id,
        sourceId: port.sourceId,
    })

    onDragEndPort = ({ port }, monitor) => {
        if (!monitor.didDrop() && port.sourceId) {
            // disconnect if dragging from connected input into nowhere
            this.setState(({ canvas }) => ({
                canvas: CanvasState.disconnectPorts(canvas, port.sourceId, port.id),
            }))
        }
    }

    onDropPort = (props, monitor) => {
        const from = monitor.getItem()
        this.setState(({ canvas }) => {
            let nextCanvas = canvas
            if (from.sourceId) {
                // if dragging from an already connected input, treat as if dragging output
                nextCanvas = CanvasState.disconnectPorts(nextCanvas, from.sourceId, from.portId)
                nextCanvas = CanvasState.connectPorts(nextCanvas, from.sourceId, props.port.id)
            } else {
                nextCanvas = CanvasState.connectPorts(nextCanvas, from.portId, props.port.id)
            }
            return { canvas: nextCanvas }
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
        return (
            <div className={styles.CanvasEdit}>
                <Canvas
                    className={styles.Canvas}
                    canvas={this.state.canvas}
                    dndModule={this.dndModule}
                    dndPort={this.dndPort}
                />
                <CanvasToolbar
                    className={styles.CanvasToolbar}
                    canvas={this.state.canvas}
                />
            </div>
        )
    }
}

export default connect((state, props) => ({
    canvas: state.canvas.byId[props.match.params.id],
}), {
    getCanvas,
})(class CanvasEditLoader extends React.PureComponent {
    componentDidMount() {
        this.props.getCanvas(this.props.match.params.id)
    }

    render() {
        const { canvas } = this.props
        if (!canvas) { return null }
        return <CanvasEdit key={canvas.id + canvas.updated} {...this.props} />
    }
})
