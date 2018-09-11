import React from 'react'
import { DragSource, DropTarget } from './dnd'

import styles from './index.pcss'
import { DragTypes } from './state'

import Port from './Port'
import Cables from './Cables'

class CanvasModule extends React.Component {
    render() {
        const { module, getOnPort, connectDragSource, isDragging } = this.props

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
                                module={module}
                                direction="input"
                                location="params"
                                ref={getOnPort(port)}
                                {...this.props.dndPort}
                            />
                        ))}
                        {inputs.map((port) => (
                            <Port
                                key={port.id}
                                port={port}
                                module={module}
                                direction="input"
                                location="inputs"
                                ref={getOnPort(port)}
                                {...this.props.dndPort}
                            />
                        ))}
                    </div>
                    <div className={`${styles.ports} ${styles.outputs}`}>
                        {outputs.map((port) => (
                            <Port
                                key={port.id}
                                port={port}
                                module={module}
                                direction="output"
                                location="outputs"
                                ref={getOnPort(port)}
                                {...this.props.dndPort}
                            />
                        ))}
                    </div>
                </div>
            </div>
        ))
    }
}

const CanvasModuleDragDrop = DragSource(DragTypes.Module)(CanvasModule)

class CanvasElements extends React.Component {
    ports = {}

    positions = {}

    componentDidMount() {
        this.update()
    }

    componentWillUnmount() {
        clearTimeout(this.k)
    }

    getOnPort = (port) => (el) => {
        this.ports = {
            ...this.ports,
            [port.id]: el,
        }
        if (!el) {
            this.positions = {
                ...this.positions,
                [port.id]: undefined,
            }
        }
        this.update()
    }

    update = () => {
        if (!this.modules) {
            return
        }

        const offset = this.modules.getBoundingClientRect()
        this.positions = Object.entries(this.ports).reduce((r, [id, el]) => {
            if (!el) { return r }
            const elRect = el.getBoundingClientRect()
            if (elRect.width === 0 || elRect.height === 0) { return r }
            const rect = {
                top: elRect.top - offset.top,
                left: elRect.left - offset.left,
                right: elRect.right - offset.right,
                bottom: elRect.bottom - offset.bottom,
                width: elRect.width,
                height: elRect.height,
            }
            return Object.assign(r, {
                [id]: rect,
            })
        }, {})
        this.forceUpdate()
    }

    modulesRef = (el) => {
        this.modules = el
        this.update()
    }

    render() {
        const { connectDropTarget, canvas, dndModule, dndPort } = this.props
        if (!canvas) { return null }

        return connectDropTarget((
            <div className={styles.CanvasElements}>
                <div className={styles.Modules} ref={this.modulesRef}>
                    {canvas.modules.map((m) => (
                        <CanvasModuleDragDrop
                            key={m.hash}
                            module={m}
                            canvas={canvas}
                            getOnPort={this.getOnPort}
                            {...dndModule}
                            dndPort={dndPort}
                        />
                    ))}
                </div>
                <Cables canvas={canvas} positions={this.positions} />
            </div>
        ))
    }
}

const CanvasElementsDropTarget = DropTarget(DragTypes.Module)(CanvasElements)

export default CanvasElementsDropTarget
