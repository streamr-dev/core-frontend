/* eslint-disable react/no-unused-state */
import React, { useEffect, useState, useContext } from 'react'
import cx from 'classnames'
import { useSpring, animated, interpolate } from 'react-spring'
import { moduleHasPort, isConnectedToModule } from '../state'
import styles from './Canvas.pcss'
import { DragDropContext } from './DragDropContext'

const CABLE_SPRING_CONFIG = {
    mass: 1,
    friction: 32,
    tension: 700,
}

function useCurvedHorizontal(x1, y1, x2, y2) {
    const STEEPNESS = 1
    const mx = ((x2 - x1) / 2) * STEEPNESS

    const [c, set] = useSpring(() => ({
        c1: [x1 + mx, y1],
        c2: [x2 - mx, y2],
        config: CABLE_SPRING_CONFIG,
    }))
    set({
        c1: [x1 + mx, y1],
        c2: [x2 - mx, y2],
    })

    return interpolate([c.c1, c.c2], (c1, c2) => {
        const l = []
        l.push('M', x1, y1)
        l.push('C', ...c1, ...c2, x2, y2)
        return l.join(' ')
    })
}

const LAYER_0 = 0
const LAYER_1 = 1

export function Cable({ cable, ...props }) {
    if (!cable) { return null }
    return <CableInner cable={cable} {...props} />
}

function CableInner({ className, cable, ...props }) {
    const [from, to] = cable
    // adjust offset to edge based on curve direction
    // i.e. connect to left edge if curve going L->R,
    // connect to right edge if curve going R->L
    const direction = from.x < to.x ? 1 : -1
    const d = useCurvedHorizontal(
        from.x + (0.5 * (from.width || 0) * direction), // connect to edge of from
        from.y,
        to.x + (0.5 * (to.width || 0) * -direction), // connect to edge of to
        to.y,
    )
    return (
        <animated.path
            className={cx(styles.Connection, className)}
            d={d}
            stroke="#525252"
            fill="none"
            strokeWidth="1"
            {...props}
        />
    )
}

export function getCableKey([from, to] = []) {
    return `${from && from.id}-${to && to.id}`
}

const DRAG_CABLE_ID = 'DRAG_CABLE_ID'

class Cables extends React.PureComponent {
    el = React.createRef()

    state = {}

    shouldFade = ([a, b]) => {
        const { canvas, selectedModuleHash } = this.props
        // no fade if no selection
        if (selectedModuleHash == null) { return false }
        // no fade if dragging cable
        if (a.id === DRAG_CABLE_ID || b.id === DRAG_CABLE_ID) { return false }
        // fade if not connected to selection
        return !isConnectedToModule(canvas, selectedModuleHash, a.id, b.id)
    }

    shouldHighlight = ([a, b]) => {
        const { selectedModuleHash } = this.props
        // no highlight if no selection
        if (selectedModuleHash == null) { return false }
        // no highlight if dragging cable
        if (a.id === DRAG_CABLE_ID || b.id === DRAG_CABLE_ID) { return false }
        return !this.shouldFade([a, b])
    }

    getCables() {
        const hasMoved = this.props.isDragging && !(this.props.diff.x === 0 && this.props.diff.y === 0)
        if (this.props.isDragging && this.props.data.moduleHash != null && hasMoved) {
            return this.getCablesDraggingModule()
        }

        if (this.props.isDragging && this.props.data.portId != null && hasMoved) {
            return this.getCablesDraggingPort()
        }

        return this.getStaticCables()
    }

    getPositions() {
        // cache positions while drag operation is in progress
        if (this.props.isDragging) {
            if (!this.positions) {
                this.positions = this.props.positions
            }
            return this.positions
        }
        if (this.positions) {
            this.positions = undefined
        }
        return this.props.positions
    }

    /**
     * Get static cable positions according to connections & supplied port positions.
     */

    getStaticCables() {
        const { canvas } = this.props
        const positions = this.getPositions()
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

        return this.getStaticCables().map(([from, to]) => {
            // update the positions of ports in dragged module
            let fromNew = from
            let toNew = to
            let layer = LAYER_0
            if (moduleHasPort(canvas, moduleHash, from.id)) {
                fromNew = {
                    ...from,
                    y: from.y + diff.y,
                    x: from.x + diff.x,
                }
                layer = LAYER_1
            }
            if (moduleHasPort(canvas, moduleHash, to.id)) {
                toNew = {
                    ...to,
                    y: to.y + diff.y,
                    x: to.x + diff.x,
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
        const { data, diff, isDragging } = this.props
        const positions = this.getPositions()
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
                ...p,
                id: DRAG_CABLE_ID,
                y: p.y + diff.y,
                x: p.x + diff.x,
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
                    className={cx(styles.Cables, styles.layer0)}
                    preserveAspectRatio="xMidYMid meet"
                    height="100%"
                    width="100%"
                >
                    {layer0.filter(Boolean).map((cable) => (
                        <Cable
                            key={getCableKey(cable)}
                            cable={cable}
                            className={cx({
                                [styles.fade]: this.shouldFade(cable),
                                [styles.highlight]: this.shouldHighlight(cable),
                            })}
                        />
                    ))}
                </svg>
                <svg
                    className={cx(styles.Cables, styles.layer1)}
                    preserveAspectRatio="xMidYMid meet"
                    height="100%"
                    width="100%"
                >
                    {layer1.filter(Boolean).map((cable) => (
                        <Cable
                            key={getCableKey(cable)}
                            cable={cable}
                            className={cx({
                                [styles.fade]: this.shouldFade(cable),
                                [styles.highlight]: this.shouldHighlight(cable),
                            })}
                        />
                    ))}
                </svg>
            </React.Fragment>
        )
    }
}

export default function CablesContainer(props) {
    const dragDrop = useContext(DragDropContext)
    const [diff, setDiff] = useState(dragDrop.getDiff())
    const { onMove, offMove, isDragging, data } = dragDrop
    useEffect(() => {
        onMove(setDiff)
        return () => {
            offMove(setDiff)
        }
    }, [onMove, offMove, setDiff])

    useEffect(() => {
        if (isDragging) { return }
        // reset
        setDiff({
            x: 0,
            y: 0,
        })
    }, [isDragging])

    return (
        <Cables
            isDragging={isDragging}
            data={data}
            diff={diff}
            {...props}
        />
    )
}
