import React from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'

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

        const inputs = module.params.concat(module.inputs)
        const rows = []
        const maxRows = Math.max(inputs.length, outputs.length)
        for (let i = 0; i < maxRows; i += 1) {
            rows.push([inputs[i], outputs[i]])
        }

        const maybeConnect = (el) => (
            isDraggable ? connectDragSource(el) : el
        )

        const isSelected = module.hash === this.props.selectedModuleId

        return maybeConnect((
            /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
            <div
                role="rowgroup"
                onMouseDown={() => api.selectModule({ id: module.hash })}
                className={cx(styles.Module, {
                    [styles.isDraggable]: isDraggable,
                    [styles.isSelected]: isSelected,
                })}
                hidden={isDragging}
                style={{
                    top: layout.position.top,
                    left: layout.position.left,
                }}
            >
                <div className={styles.moduleHeader}>
                    <div className={styles.name}>{startCase(name)}</div>
                </div>
                <div className={styles.ports}>
                    {rows.map((ports) => (
                        <div key={ports.map((p) => p && p.id).join(',')} className={styles.portRow} role="row">
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
