import React from 'react'
import { DragSource } from './dnd'

import styles from './index.pcss'
import { DragTypes } from './state'

import Port from './Port'

class CanvasModule extends React.Component {
    portRefs = new Map()

    getPortRef = (portId) => {
        if (!this.portRefs.has(portId)) {
            this.portRefs.set(portId, (el) => this.props.onPort(portId, el))
        }
        return this.portRefs.get(portId)
    }

    render() {
        const { dnd, module, connectDragSource, isDragging } = this.props

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
                                onPort={this.props.onPort}
                                {...dnd.port}
                            />
                        ))}
                        {inputs.map((port) => (
                            <Port
                                key={port.id}
                                port={port}
                                onPort={this.props.onPort}
                                {...dnd.port}
                            />
                        ))}
                    </div>
                    <div className={`${styles.ports} ${styles.outputs}`}>
                        {outputs.map((port) => (
                            <Port
                                key={port.id}
                                port={port}
                                onPort={this.props.onPort}
                                {...dnd.port}
                            />
                        ))}
                    </div>
                </div>
            </div>
        ))
    }
}

export default DragSource(DragTypes.Module)(CanvasModule)
