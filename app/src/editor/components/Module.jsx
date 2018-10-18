import React from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import { DragSource } from '../utils/dnd'
import { DragTypes } from '../state'

import Port from './Port'

import styles from './Module.pcss'

class CanvasModule extends React.Component {
    state = {
        isDraggable: true,
        minPortSize: 0,
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

    adjustMinPortSize = (minPortSize) => {
        this.setState({ minPortSize })
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

        const isSelected = module.hash === this.props.selectedModuleHash
        const portSize = Math.min(module.params.reduce((size, { value, defaultValue }) => (
            Math.max(size, String(value || defaultValue).length)
        ), Math.max(4, this.state.minPortSize)), 40)

        const PortPlaceholder = () => <React.Fragment><div /><div /><div /></React.Fragment>

        return maybeConnect((
            /* eslint-disable-next-line max-len */
            /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-tabindex */
            <div
                role="rowgroup"
                tabIndex="0"
                onMouseDown={() => api.selectModule({ hash: module.hash })}
                onFocus={() => api.selectModule({ hash: module.hash })}
                className={cx(styles.Module, {
                    [styles.isDraggable]: isDraggable,
                    [styles.isSelected]: isSelected,
                })}
                hidden={isDragging}
                style={{
                    top: layout.position.top,
                    left: layout.position.left,
                }}
                data-modulehash={module.hash}
            >
                <div className={styles.moduleHeader}>
                    <div className={styles.name}>{startCase(name)}</div>
                </div>
                <div className={styles.ports}>
                    {rows.map((ports) => (
                        <div key={ports.map((p) => p && p.id).join(',')} className={styles.portRow} role="row">
                            {ports.map((port, index) => (
                                /* eslint-disable react/no-array-index-key */
                                !port ? <PortPlaceholder key={index} /> /* placeholder for alignment */ : (
                                    <Port
                                        key={port.id + index}
                                        port={port}
                                        onPort={this.props.onPort}
                                        size={portSize}
                                        adjustMinPortSize={this.adjustMinPortSize}
                                        setIsDraggable={this.setIsDraggable}
                                        {...api.port}
                                    />
                                )
                                /* eslint-enable react/no-array-index-key */
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        ))
        /* eslint-enable */
    }
}

export default DragSource(DragTypes.Module)(CanvasModule)
