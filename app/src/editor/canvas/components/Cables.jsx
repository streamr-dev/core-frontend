/* eslint-disable react/no-unused-state */
import React, { useMemo, useState, useLayoutEffect, useContext, useCallback } from 'react'
import cx from 'classnames'
import { useSpring, animated, to, useSprings } from 'react-spring'
import { moduleHasPort, isConnectedToModule } from '../state'
import styles from './Canvas.pcss'
import { DragDropContext } from './DragDropContext'

const CABLE_SPRING_CONFIG = {
    mass: 1,
    friction: 32,
    tension: 700,
}

function applyOffset({ x, y, useOffset }, [x2 = 0, y2 = 0] = []) {
    if (!useOffset) {
        return [x, y]
    }
    return [
        x + x2,
        y + y2,
    ]
}

function useOnDrag(fn) {
    const dragDrop = useContext(DragDropContext)
    const { onMove, offMove, getDiff, isDragging } = dragDrop

    const setDiffValue = useCallback(() => {
        const { x = 0, y = 0 } = getDiff() || {}
        fn([x, y])
    }, [getDiff, fn])

    useLayoutEffect(() => {
        onMove(setDiffValue)
        return () => {
            offMove(setDiffValue)
        }
    }, [onMove, offMove, setDiffValue])

    useLayoutEffect(() => {
        if (isDragging) { return }
        // reset
        setDiffValue([0, 0])
    }, [isDragging, setDiffValue])
}

function useCurvedHorizontal(x1, y1, x2, y2) {
    const STEEPNESS = 1
    const mx = ((x2 - x1) / 2) * STEEPNESS

    const [c, set] = useSpring(() => ({
        c1: [x1 + mx, y1],
        c2: [x2 - mx, y2],
        immediate: true,
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

export function Cable({ cable, spring, ...props }) {
    if (!cable) { return null }
    if (spring) { return <CableInnerSpring cable={cable} spring={spring} {...props} /> }
    return <CableInner cable={cable} {...props} />
}

function curvedHorizontal(x1, y1, x2, y2) {
    const STEEPNESS = 1
    const mx = ((x2 - x1) / 2) * STEEPNESS

    return {
        src: [x1, y1],
        c1: [x1 + mx, y1],
        c2: [x2 - mx, y2],
        dest: [x2, y2],
    }
}

function CableInnerSpring({ className, spring, cable, ...props }) {
    return (
        <animated.path
            className={cx(styles.Connection, className)}
            d={to([spring.src, spring.c1, spring.c2, spring.dest], (src, c1, c2, dest) => {
                const l = []
                l.push('M', ...src)
                l.push('C', ...c1, ...c2, ...dest)
                return l.join(' ')
            })}
            stroke="#525252"
            fill="none"
            strokeWidth="1"
            {...props}
        />
    )
}

function CableInner({ className, cable, ...props }) {
    const [from, to] = cable
    const d = useCurvedHorizontal(
        from.x,
        from.y,
        to.x,
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

function useCableSprings(cables) {
    // create springs for each cable
    const setCableSpring = useCallback((i, offset = [0, 0]) => {
        const cable = cables[i]
        const [x1, y1] = applyOffset(cable[0], offset)
        const [x2, y2] = applyOffset(cable[1], offset)
        return {
            to: curvedHorizontal(x1, y1, x2, y2),
            // only allow transition on control points
            immediate: (key) => !key.startsWith('c'),
            config: CABLE_SPRING_CONFIG,
        }
    }, [cables])

    const [cableSprings, setSprings] = useSprings(cables.length, (i) => setCableSpring(i))

    useOnDrag(useCallback((offset) => {
        // update offsets on drag
        setSprings((i) => setCableSpring(i, offset))
    }, [setSprings, setCableSpring]))

    // provide mapping between CableKey & cable index, so we can find cable spring
    const cableIndex = useMemo(() => (
        cables.map((cable) => getCableKey(cable))
    ), [cables])

    // get spring for cable
    const getCableSpring = useCallback((cable) => (
        cableSprings[cableIndex.indexOf(getCableKey(cable))]
    ), [cableSprings, cableIndex])
    return getCableSpring
}

const DRAG_CABLE_ID = 'DRAG_CABLE_ID'

export default function Cables(props) {
    const { canvas, selectedModuleHash, positions: positionsProp } = props

    const dragDrop = useContext(DragDropContext)
    const { isDragging, data } = dragDrop

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

    const [positionsState, setPositions] = useState(positionsProp)
    useLayoutEffect(() => {
        // cache positions while drag operation is in progress
        if (isDragging && !positionsState) {
            setPositions((s) => {
                if (s) { return s }
                return positionsProp
            })
        }
        if (!isDragging && positionsState) {
            setPositions(undefined)
        }
    }, [isDragging, positionsProp, positionsState])

    const positions = positionsState || positionsProp

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
            .map(([from, to]) => {
                // adjust offset to edge based on curve direction
                // i.e. connect to left edge if curve going L->R,
                // connect to right edge if curve going R->L
                const direction = from.x < to.x ? 1 : -1
                return [{
                    ...from,
                    x: from.x + (0.5 * (from.width || 0) * direction), // connect to edge of from
                    y: from.y,
                }, {
                    ...to,
                    x: to.x + (0.5 * (to.width || 0) * -direction), // connect to edge of to
                    y: to.y,
                }]
            })
            .map((cable) => {
                cable[2] = shouldHighlight(cable) ? 1 : 0
                return cable
            })
    ), [positions, shouldHighlight, canvas])

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
                    useOffset: true,
                }
                layer = LAYER_1
            }
            if (moduleHasPort(canvas, moduleHash, to.id)) {
                toNew = {
                    ...to,
                    useOffset: true,
                }
                layer = LAYER_1
            }
            return [fromNew, toNew, layer]
        })
    }, [staticCables, data, canvas, isDragging])

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
                useOffset: true,
            },
            LAYER_1, // drag cable goes on layer 1
        ]
    }, [data, isDragging, positions])

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
        if (isDragging && data.moduleHash != null) {
            return cablesDraggingModule
        }

        if (isDragging && data.portId != null) {
            return cablesDraggingPort
        }

        return staticCables
    }, [isDragging, data, staticCables, cablesDraggingModule, cablesDraggingPort])

    const getCableSpring = useCableSprings(cables)

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
                        spring={getCableSpring(cable)}
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
                        spring={getCableSpring(cable)}
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
