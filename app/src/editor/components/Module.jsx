import React from 'react'

import { DragSource } from '../utils/dnd'
import { DragTypes } from '../state'

import Port from './Port'

import styles from './Canvas.pcss'

class CanvasModule extends React.Component {
    state = {
        isDraggable: true,
    }

    portRefs = new Map()

    getPortRef = (portId) => {
        // memoize ref functions
        if (!this.portRefs.has(portId)) {
            this.portRefs.set(portId, (el) => this.props.onPort(portId, el))
        }
        return this.portRefs.get(portId)
    }

    setIsDraggable = (isDraggable) => {
        this.setState({
            isDraggable,
        })
    }

    render() {
        const { api, module, connectDragSource, isDragging } = this.props
        const { name, outputs, layout } = module
        const { isDraggable } = this.state

        const inputs = module.inputs.concat(module.params)
        const rows = []
        const maxRows = Math.max(inputs.length, outputs.length)
        for (let i = 0; i < maxRows; i += 1) {
            rows.push([inputs[i], outputs[i]])
        }

        const maybeConnect = (el) => (
            isDraggable ? connectDragSource(el) : el
        )

        return maybeConnect((
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
                <div className={styles.ports}>
                    {rows.map((ports) => (
                        <div key={ports.map((p) => p && p.id).join(',')} className={styles.portRow}>
                            {ports.map((port) => (
                                !port ? null : (
                                    <Port
                                        key={port.id}
                                        port={port}
                                        onPort={this.props.onPort}
                                        setIsDraggable={this.setIsDraggable}
                                        {...api.port}
                                    />
                                )
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        ))
    }
}

export default DragSource(DragTypes.Module)(CanvasModule)
