import React from 'react'
import cx from 'classnames'

import { DragSource } from '../utils/dnd'
import { DragTypes } from '../state'

import RenameInput from './RenameInput'
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

    // for disabling dragging when cursor is over interactive controls e.g. inputs
    setIsDraggable = (isDraggable) => {
        this.setState({
            isDraggable,
        })
    }

    // for resizing all port widths to match longest port value
    adjustMinPortSize = (minPortSize) => {
        this.setState({ minPortSize })
    }

    onClickOptions = () => {
        const { api, module, moduleSidebarIsOpen, selectedModuleHash } = this.props
        const isSelected = module.hash === selectedModuleHash
        if (isSelected) {
            // toggle sidebar if same module
            api.moduleSidebarOpen(!moduleSidebarIsOpen)
        } else {
            // only open if different
            api.selectModule({ hash: module.hash })
            api.moduleSidebarOpen(true)
        }
    }

    render() {
        const { api, module, connectDragSource, isDragging } = this.props
        const { outputs, layout } = module
        const { isDraggable } = this.state

        const inputs = module.params.concat(module.inputs)

        // map inputs and outputs into visual rows
        const rows = []
        const maxRows = Math.max(inputs.length, outputs.length)
        for (let i = 0; i < maxRows; i += 1) {
            rows.push([inputs[i], outputs[i]])
        }

        const isSelected = module.hash === this.props.selectedModuleHash
        const portSize = Math.min(module.params.reduce((size, { value, defaultValue }) => (
            Math.max(size, String(value || defaultValue).length)
        ), Math.max(4, this.state.minPortSize)), 40)

        // this is the `display: table` equivalent of `<td colspan="3" />`. For alignment.
        const PortPlaceholder = () => <React.Fragment><div /><div /><div /></React.Fragment>

        const maybeConnectDragging = (el) => (
            isDraggable ? connectDragSource(el) : el
        )

        return maybeConnectDragging((
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
                    <RenameInput
                        className={styles.name}
                        value={module.displayName || module.name}
                        onChange={(value) => api.renameModule(module.hash, value)}
                    />
                    <button type="button" className={styles.optionsButton} onClick={this.onClickOptions}>
                        <HamburgerIcon />
                    </button>
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

function HamburgerIcon(props = {}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
            <g fill="none" fillRule="evenodd" stroke="#CDCDCD" strokeLinecap="round" strokeWidth="1.5">
                <path d="M7 16h10M7 12h10M7 8h10" />
            </g>
        </svg>
    )
}

export default DragSource(DragTypes.Module)(CanvasModule)
