/* eslint-disable react/no-unused-state */
import React from 'react'
import { getModulePorts } from '../state'
import styles from './Canvas.pcss'
import { DragDropContext } from './DragDropContext'

function curvedHorizontal(x1, y1, x2, y2) {
    const STEEPNESS = 1
    const line = []
    const mx = ((x2 - x1) / 2) * STEEPNESS

    line.push('M', x1, y1)
    line.push('C', x1 + mx, y1, x2 - mx, y2, x2, y2)

    return line.join(' ')
}

const LAYER_0 = 0
const LAYER_1 = 1

export function Cable({ cable }) {
    if (!cable) { return null }
    const [from, to] = cable
    return (
        <path
            className={styles.Connection}
            d={curvedHorizontal(
                from.left,
                from.top,
                to.left,
                to.top,
            )}
        />
    )
}

export function getCableKey([from, to] = []) {
    return `${from && from.id}-${to && to.id}`
}

class Cables extends React.PureComponent {
    el = React.createRef()

    state = {}

    getCables() {
        if (this.props.isDragging && this.props.data.moduleHash != null) {
            return this.getCablesDraggingModule()
        }

        if (this.props.isDragging && this.props.data.portId != null) {
            return this.getCablesDraggingPort()
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
        const { canvas, diff, data, isDragging } = this.props
        if (!isDragging) {
            return this.getStaticCables()
        }

        const { moduleHash } = data

        const ports = getModulePorts(canvas, moduleHash)
        return this.getStaticCables().map(([from, to]) => {
            // update the positions of ports in dragged module
            let fromNew = from
            let toNew = to
            let layer = LAYER_0
            if (ports[from.id]) {
                fromNew = {
                    id: from.id,
                    top: from.top + diff.y,
                    left: from.left + diff.x,
                }
                layer = LAYER_1
            }
            if (ports[to.id]) {
                toNew = {
                    id: to.id,
                    top: to.top + diff.y,
                    left: to.left + diff.x,
                }
                layer = LAYER_1
            }
            return [fromNew, toNew, layer]
        })
    }

    /**
     * Cable config when dragging a port
     */

    getCablesDraggingPort() {
        const { data, isDragging } = this.props
        if (!isDragging) {
            return this.getStaticCables()
        }

        const { portId, sourceId } = data

        const cables = this.getStaticCables().filter(([from, to]) => {
            // remove currently dragged cable
            if (sourceId) {
                return !(from.id === sourceId && to.id === portId)
            }
            return true
        })

        return [
            ...cables,
            this.getDragCable(), // append dragging cable
        ].filter(Boolean)
    }

    getDragCable() {
        const { positions, data, diff, isDragging } = this.props
        const { portId, sourceId } = data
        if (!isDragging || portId == null) {
            return null
        }

        // add new dynamic cable for drag operation
        const p = positions[portId]
        if (!p) { return null } // ignore if no position e.g. variadic removed
        return [
            positions[sourceId || portId],
            {
                id: 'drag',
                top: p.top + diff.y,
                left: p.left + diff.x,
                bottom: p.bottom + diff.y,
                right: p.right + diff.x,
            },
            LAYER_1, // drag cable goes on layer 1
        ]
    }

    render() {
        const cables = this.getCables()
        const layer0 = cables.filter(([, , layer]) => !layer)
        const layer1 = cables.filter(([, , layer]) => layer === LAYER_1)
        return (
            <React.Fragment>
                <svg
                    className={styles.Cables}
                    preserveAspectRatio="xMidYMid meet"
                    height="100%"
                    width="100%"
                >
                    {layer0.filter(Boolean).map((cable) => (
                        <Cable key={getCableKey(cable)} cable={cable} />
                    ))}
                </svg>
                <svg
                    className={styles.Cables}
                    preserveAspectRatio="xMidYMid meet"
                    height="100%"
                    width="100%"
                >
                    {layer1.filter(Boolean).map((cable) => (
                        <Cable key={getCableKey(cable)} cable={cable} />
                    ))}
                </svg>
            </React.Fragment>
        )
    }
}

export default class CablesContainer extends React.PureComponent {
    static contextType = DragDropContext
    initialState = {
        diff: {
            x: 0,
            y: 0,
        },
    }

    state = {
        ...this.initialState,
    }

    onUpdate = () => {
        if (!this.context.isDragging) { return }
        this.setState(({ diff }) => {
            const newDiff = this.context.getDiff()
            if (diff.x === newDiff.x && diff.y === newDiff.y) {
                return null
            }

            return {
                diff: newDiff,
            }
        }, () => {
            requestAnimationFrame(this.onUpdate)
        })
    }

    reset() {
        this.setState(this.initialState)
    }

    componentDidUpdate(prev) {
        if (this.context.isDragging && !prev.isDragging) {
            requestAnimationFrame(this.onUpdate)
        }

        if (!this.context.isDragging && prev.isDragging) {
            this.reset()
        }
    }

    render() {
        return (
            <Cables
                isDragging={this.context.isDragging}
                data={this.context.data}
                diff={this.state.diff}
                {...this.props}
            />
        )
    }
}
