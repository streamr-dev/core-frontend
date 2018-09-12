import React, { Component } from 'react'
import { connect } from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'

import { getCanvas } from '../../../modules/canvas/actions'
import Canvas from './Canvas/index'
import * as CanvasState from './Canvas/state'
import CanvasToolbar from './Toolbar'

import styles from './index.pcss'

export default connect((state, props) => ({
    canvas: state.canvas.byId[props.match.params.id],
}), {
    getCanvas,
})(class CanvasEdit extends Component {
    state = { canvas: undefined }

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

    componentDidMount() {
        this.props.getCanvas(this.props.match.params.id)
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
        return CanvasState.canConnectPorts(this.state.canvas, from.portId, props.port.id)
    }

    onDragPort = (props) => ({ portId: props.port.id })

    onDropPort = (props, monitor) => {
        const from = monitor.getItem()

        this.setState(({ canvas }) => ({
            canvas: CanvasState.connectPorts(canvas, from.portId, props.port.id),
        }))
    }

    dndPort = {
        onDrag: this.onDragPort,
        onDrop: this.onDropPort,
        onCanDrop: this.onCanDropPort,
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
})

