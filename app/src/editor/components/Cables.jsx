import React from 'react'
import { DragTypes, getModulePorts } from '../state'
import Dragger from '../utils/Dragger'
import styles from './Canvas.pcss'

function curvedHorizontal(x1, y1, x2, y2) {
    const line = []
    const mx = x1 + ((x2 - x1) / 2)

    line.push('M', x1, y1)
    line.push('C', mx, y1, mx, y2, x2, y2)

    return line.join(' ')
}

export default class Cables extends React.Component {
    el = React.createRef()

    state = {}

    dragger = new Dragger(this.el, (diff) => {
        this.setState({ diff })
    }, () => {
        this.setState({ diff: undefined })
    })

    getCables() {
        const { itemType } = this.props

        if (itemType === DragTypes.Port) {
            return this.getCablesDraggingPort()
        }
        if (itemType === DragTypes.Module) {
            return this.getCablesDraggingModule()
        }
        return this.getStaticCables()
    }

    /**
     * Get static cable positions according to connections & supplied port positions.
     */

    getStaticCables() {
        const { canvas, positions } = this.props
        return canvas.modules
            .reduce((c, m) => {
                [].concat(m.params, m.inputs, m.outputs).forEach((port) => {
                    if (!port.connected) { return }
                    c.push([port.sourceId, port.id])
                })
                return c
            }, [])
            .map(([from, to]) => [positions[from], positions[to]])
            .filter(([from, to]) => from && to)
    }

    /**
     * Cable config when dragging a module
     */

    getCablesDraggingModule() {
        const { monitor, canvas } = this.props
        const { diff } = this.state
        if (!diff) {
            return this.getStaticCables()
        }

        const { moduleHash } = monitor.getItem()
        const ports = getModulePorts(canvas, moduleHash)
        return this.getStaticCables().map(([from, to]) => {
            // update the positions of ports in dragged module
            let fromNew = from
            let toNew = to
            if (ports[from.id]) {
                fromNew = {
                    id: from.id,
                    top: from.top + diff.y,
                    left: from.left + diff.x,
                }
            }
            if (ports[to.id]) {
                toNew = {
                    id: to.id,
                    top: to.top + diff.y,
                    left: to.left + diff.x,
                }
            }
            return [fromNew, toNew]
        })
    }

    /**
     * Cable config when dragging a port
     */

    getCablesDraggingPort() {
        const { monitor, positions } = this.props
        const { diff } = this.state
        if (!diff || !monitor.getItem()) {
            return this.getStaticCables()
        }
        const { portId, sourceId } = monitor.getItem()

        const cables = this.getStaticCables().filter(([from, to]) => {
            // remove currently dragged cable
            if (sourceId) {
                return !(from.id === sourceId && to.id === portId)
            }
            return true
        })

        // add new dynamic cable for drag operation
        const p = positions[portId]
        if (!p) { return cables } // ignore if no position e.g. variadic removed
        const dragCable = [
            positions[sourceId || portId],
            {
                id: 'drag',
                top: p.top + diff.y,
                left: p.left + diff.x,
                bottom: p.bottom + diff.y,
                right: p.right + diff.x,
            },
        ]

        return [
            ...cables,
            dragCable,
        ]
    }

    render() {
        const cables = this.getCables()
        const { monitor } = this.props
        this.dragger.update(monitor.getItem() || monitor.didDrop(), monitor)

        return (
            <svg
                ref={this.el}
                className={styles.Cables}
                preserveAspectRatio="xMidYMid meet"
                height="100%"
                width="100%"
            >
                {cables.map(([from, to]) => (
                    <path
                        key={`${from.id}-${to.id}`}
                        className={styles.Connection}
                        d={curvedHorizontal(
                            from.left,
                            from.top,
                            to.left,
                            to.top,
                        )}
                    />
                ))}
            </svg>
        )
    }
}
