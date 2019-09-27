/* eslint-disable react/no-unused-state */
import React, { useMemo, useEffect, useRef, useState, useContext, useCallback } from 'react'
import cx from 'classnames'
import { useSpring, animated, to } from 'react-spring'
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

    return to([c.c1, c.c2], (c1, c2) => {
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

function Cables(props) {
    const {
        canvas,
        selectedModuleHash,
        diff,
        isDragging,
        positions: positionsProp,
        data,
    } = props

    const shouldFade = useCallback(([a, b]) => {
        // no fade if no selection
        if (selectedModuleHash == null) { return false }
        // no fade if dragging cable
        if (a.id === DRAG_CABLE_ID || b.id === DRAG_CABLE_ID) { return false }
        // fade if not connected to selection
        return !isConnectedToModule(canvas, selectedModuleHash, a.id, b.id)
    }, [canvas, selectedModuleHash])

    const shouldHighlight = useCallback(([a, b]) => {
        // no highlight if no selection
        if (selectedModuleHash == null) { return false }
        // no highlight if dragging cable
        if (a.id === DRAG_CABLE_ID || b.id === DRAG_CABLE_ID) { return false }
        return !shouldFade([a, b])
    }, [shouldFade, selectedModuleHash])

    const positionsRef = useRef()
    const positions = useMemo(() => {
        // cache positions while drag operation is in progress
        if (isDragging) {
            if (!positionsRef.current) {
                positionsRef.current = positionsProp
            }
            return positionsRef.current
        }
        if (positionsRef.current) {
            positionsRef.current = undefined
        }
        return positionsProp
    }, [isDragging, positionsProp, positionsRef])

    /**
     * Get static cable positions according to connections & supplied port positions.
     */

    const staticCables = useMemo(() => (
        canvas.modules
            .reduce((c, m) => {
                [].concat(m.params, m.inputs, m.outputs).forEach((port) => {
                    if (!port.connected) { return }
                    c.push([port.sourceId, port.id])
                })
                return c
            }, [])
            .map(([from, to]) => [positions[from], positions[to]])
            .filter(([from, to]) => from && to)
    ), [positions, canvas])

    /**
     * Cable config when dragging a module
     */

    const cablesDraggingModule = useMemo(() => {
        if (!isDragging) {
            return staticCables
        }

        const { moduleHash } = data

        return staticCables.map(([from, to]) => {
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
    }, [staticCables, data, diff, canvas, isDragging])

    const dragCable = useMemo(() => {
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
    }, [data, diff, isDragging, positions])

    /**
     * Cable config when dragging a port
     */

    const cablesDraggingPort = useMemo(() => {
        if (!isDragging) {
            return staticCables
        }

        const { portId, sourceId } = data

        const cables = staticCables.filter(([from, to]) => {
            // remove currently dragged cable
            if (sourceId) {
                return !(from.id === sourceId && to.id === portId)
            }
            return true
        })

        return [
            ...cables,
            dragCable, // append dragging cable
        ].filter(Boolean)
    }, [staticCables, data, isDragging, dragCable])

    const cables = useMemo(() => {
        const hasMoved = isDragging && !(diff.x === 0 && diff.y === 0)
        if (isDragging && data.moduleHash != null && hasMoved) {
            return cablesDraggingModule
        }

        if (isDragging && data.portId != null && hasMoved) {
            return cablesDraggingPort
        }

        return staticCables
    }, [isDragging, diff, data, staticCables, cablesDraggingModule, cablesDraggingPort])

    const layer0 = useMemo(() => cables.filter(([, , layer]) => !layer).filter(Boolean), [cables])
    const layer1 = useMemo(() => cables.filter(([, , layer]) => layer === LAYER_1).filter(Boolean), [cables])
    return (
        <React.Fragment>
            <svg
                className={cx(styles.Cables, styles.layer0)}
                preserveAspectRatio="xMidYMid meet"
                height="100%"
                width="100%"
            >
                {layer0.map((cable) => (
                    <Cable
                        key={getCableKey(cable)}
                        cable={cable}
                        className={cx({
                            [styles.fade]: shouldFade(cable),
                            [styles.highlight]: shouldHighlight(cable),
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
                {layer1.map((cable) => (
                    <Cable
                        key={getCableKey(cable)}
                        cable={cable}
                        className={cx({
                            [styles.fade]: shouldFade(cable),
                            [styles.highlight]: shouldHighlight(cable),
                        })}
                    />
                ))}
            </svg>
        </React.Fragment>
    )
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
