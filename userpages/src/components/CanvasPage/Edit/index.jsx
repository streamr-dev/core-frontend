import React, { Component } from 'react'
import { connect } from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'
import update from 'lodash/fp/update'

import { getCanvas } from '../../../modules/canvas/actions'
import Canvas from './Canvas/index'
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

    static findModuleForPort(portId, canvas) {
        return canvas.modules.find((m) => (
            m.params.find(({ id }) => id === portId)
            || m.outputs.find(({ id }) => id === portId)
            || m.inputs.find(({ id }) => id === portId)
        ))
    }

    static findPort(portId, canvas) {
        const m = this.findModuleForPort(portId, canvas)
        return m && (
            m.params.find(({ id }) => id === portId)
            || m.outputs.find(({ id }) => id === portId)
            || m.inputs.find(({ id }) => id === portId)
        )
    }

    static isOutputPortConnected(portId, canvas) {
        return canvas.modules.find((m) => (
            m.params.find(({ sourceId }) => sourceId === portId)
            || m.inputs.find(({ sourceId }) => sourceId === portId)
        ))
    }

    static updatePort(portId, { module, location }, fn, canvas) {
        const moduleIndex = canvas.modules.findIndex((m) => m.hash === module.hash)
        const portIndex = module[location].findIndex((p) => p.id === portId)
        return update(['modules', moduleIndex, location, portIndex], fn, canvas)
    }

    onDropModule = (props, monitor) => {
        const { module } = monitor.getItem()
        const { hash } = module
        const diff = monitor.getDifferenceFromInitialOffset()
        this.setState(({ canvas }) => {
            const index = canvas.modules.findIndex((m) => m.hash === hash)
            const newCanvas = update(['modules', index, 'layout', 'position'], (position) => {
                if (!position) { return null }
                return {
                    ...position,
                    top: `${Number.parseInt(position.top, 10) + diff.y}px`,
                    left: `${Number.parseInt(position.left, 10) + diff.x}px`,
                }
            }, canvas)
            return { canvas: newCanvas }
        })
    }

    onCanDropPort = (to, monitor) => {
        const from = monitor.getItem()
        if (from.direction === to.direction) { return false }

        const ports = [from.port, to.port]
        if (from.direction === 'output') {
            ports.reverse()
        }

        const [input, output] = ports
        if (!input.canConnect) { return false }
        const inputTypes = new Set(input.acceptedTypes)
        if (output.type === 'Object' || inputTypes.has('Object')) { return true }
        return inputTypes.has(output.type)
    }

    onDragModule = (props) => props

    onDragPort = (props) => props

    onDropPort = (props, monitor) => {
        const item = monitor.getItem()
        let from
        let to
        if (item.direction === 'input') {
            from = props
            to = item
        } else {
            from = item
            to = props
        }

        this.setState(({ canvas }) => {
            let newCanvas = CanvasEdit.updatePort(from.port.id, from, (port) => ({
                ...port,
                connected: true,
            }), canvas)

            newCanvas = CanvasEdit.updatePort(to.port.id, to, (port) => ({
                ...port,
                sourceId: from.port.id,
                connected: true,
            }), newCanvas)

            if (to.port.connected) {
                // disconnect previous inputs
                newCanvas = CanvasEdit.updatePort(to.port.sourceId, {
                    module: CanvasEdit.findModuleForPort(to.port.sourceId, newCanvas),
                    location: 'outputs',
                }, (port) => ({
                    ...port,
                    connected: CanvasEdit.isOutputPortConnected(to.port.sourceId, newCanvas),
                }), newCanvas)
            }

            return { canvas: newCanvas }
        })
    }

    dndPort = {
        onDrag: this.onDragPort,
        onDrop: this.onDropPort,
        onCanDrop: this.onCanDropPort,
        onCanDrag: () => true,
    }

    dndModule = {
        onDrag: this.onDragModule,
        onDrop: this.onDropModule,
        onCanDrop: () => true,
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

