/* eslint-disable react/no-unused-state */
import React, { useMemo, useState, useLayoutEffect, useContext, useCallback } from 'react'
import cx from 'classnames'
import { animated, to, useSprings } from 'react-spring'
import { moduleHasPort, isConnectedToModule } from '../state'
import styles from './Canvas.pcss'
import { DragDropContext } from './DragDropContext'

function applyOffset({ x, y, ...rest }, [x2 = 0, y2 = 0] = []) {
    return {
        ...rest,
        x: x + x2,
        y: y + y2,
    }
}

function applyEdgeOffset([src, dest, ...rest]) {
    // adjust offset to edge based on curve direction
    // i.e. connect to left edge if curve going L->R,
    // connect to right edge if curve going R->L
    const direction = src.x < dest.x ? 1 : -1
    src = applyOffset(src, [(0.5 * (src.width || 0) * direction), 0]) // connect to edge of src
    dest = applyOffset(dest, [(0.5 * (dest.width || 0) * -direction), 0]) // connect to edge of dest
    return [src, dest, ...rest]
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

function curvedHorizontalState(x1, y1, x2, y2) {
    const STEEPNESS = 1
    const mx = ((x2 - x1) / 2) * STEEPNESS

    return {
        src: [x1, y1],
        c1: [x1 + mx, y1],
        c2: [x2 - mx, y2],
        dest: [x2, y2],
    }
}

function curvedHorizontal(x1, y1, x2, y2) {
    const STEEPNESS = 1
    const line = []
    const mx = ((x2 - x1) / 2) * STEEPNESS

    line.push('M', x1, y1)
    line.push('C', x1 + mx, y1, x2 - mx, y2, x2, y2)

    return line.join(' ')
}

/**
 * Regular static cable e.g. preview
 */
function CableStatic({ className, cable, ...props }) {
    let [src, dest] = cable
    // eslint-disable-next-line semi-style
    ;[src, dest] = applyEdgeOffset([src, dest])
    const d = curvedHorizontal(
        src.x,
        src.y,
        dest.x,
        dest.y,
    )
    return (
        <path
            className={cx(styles.Connection, className)}
            d={d}
            stroke="#525252"
            fill="none"
            strokeWidth="1"
            {...props}
        />
    )
}

/**
 * Cable with spring transitions
 */

function CableSpring({ className, spring, cable, ...props }) {
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

export function Cable({ cable, spring, ...props }) {
    if (!cable) { return null }
    if (spring) { return <CableSpring cable={cable} spring={spring} {...props} /> }
    return <CableStatic cable={cable} {...props} />
}

export function getCableKey([src, dest] = []) {
    return `${src && src.id}-${dest && dest.id}`
}

const CABLE_SPRING_CONFIG = {
    mass: 1,
    friction: 32,
    tension: 700,
}

function useCableSprings(cables, config = CABLE_SPRING_CONFIG) {
    // create springs for each cable
    const setCableSpring = useCallback((i, offset = [0, 0]) => {
        const cable = cables[i]
        if (!cable) { return }
        let [src, dest] = cable
        // apply drag offsets, if required
        src = !src.useOffset ? src : applyOffset(src, offset)
        dest = !dest.useOffset ? dest : applyOffset(dest, offset)
        // eslint-disable-next-line semi-style
        ;[src, dest] = applyEdgeOffset([src, dest])

        return {
            to: curvedHorizontalState(src.x, src.y, dest.x, dest.y),
            // only allow transition on control points
            immediate: (key) => !key.startsWith('c'),
            config,
        }
    }, [cables, config])

    const [cableSprings, setSprings] = useSprings(cables.length, (i) => setCableSpring(i))

    // update cable offsets on drag
    useOnDrag(useCallback((offset) => {
        setSprings((i) => setCableSpring(i, offset))
    }, [setSprings, setCableSpring]))

    // provide mapping between CableKey & cable index, so we can find cable spring
    const cableIndex = useMemo(() => (
        cables.reduce((o, cable, index) => Object.assign(o, {
            [getCableKey(cable)]: cableSprings[index],
        }), {})
    ), [cables, cableSprings])

    // get spring for cable
    const getCableSpring = useCallback((cable) => (
        cableIndex[getCableKey(cable)]
    ), [cableIndex])
    return getCableSpring
}

const DRAG_CABLE_ID = 'DRAG_CABLE_ID'
const LAYER_0 = 0
const LAYER_1 = 1

/**
 * Generates cable data based on canvas module ports, position data
 * and drag/drop state
 */
function useCables({ canvas, positions, shouldHighlight }) {
    const dragDrop = useContext(DragDropContext)
    const { isDragging, data } = dragDrop

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
            .map(([src, dest]) => [positions[src], positions[dest]])
            // clean out any bad cables
            .filter(([src, dest]) => src && dest)

            .map((cable) => {
                // use layer 1 if highlighted
                cable[2] = shouldHighlight(cable) ? LAYER_1 : LAYER_0
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

        return staticCables.map(([src, dest]) => {
            // flag cables using ports from dragged module
            let srcNew = src
            let destNew = dest
            let layer = LAYER_0
            if (moduleHasPort(canvas, moduleHash, src.id)) {
                srcNew = {
                    ...src,
                    useOffset: true,
                }
                layer = LAYER_1
            }
            if (moduleHasPort(canvas, moduleHash, dest.id)) {
                destNew = {
                    ...dest,
                    useOffset: true,
                }
                layer = LAYER_1
            }
            return [srcNew, destNew, layer]
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

        return [
            ...staticCables,
            dragCable, // append dragging cable
        ].filter(Boolean)
    }, [staticCables, isDragging, dragCable])

    // switch cables based on drag type
    return useMemo(() => {
        if (isDragging && data.moduleHash != null) {
            return cablesDraggingModule
        }

        if (isDragging && data.portId != null) {
            return cablesDraggingPort
        }

        return staticCables
    }, [isDragging, data, staticCables, cablesDraggingModule, cablesDraggingPort])
}

/**
 * Returns cached version of value while preventUpdate is truthy
 */

function useCachedValue({ value, preventUpdate } = {}) {
    const [cachedValue, setCachedValue] = useState(value)
    useLayoutEffect(() => {
        // cache positions while drag operation is in progress
        if (preventUpdate && !cachedValue) {
            setCachedValue((s) => {
                if (s) { return s }
                return value
            })
        }
        if (!preventUpdate && cachedValue) {
            setCachedValue(undefined)
        }
    }, [preventUpdate, value, cachedValue])

    return cachedValue !== undefined ? cachedValue : value
}

export default function Cables({ canvas, selectedModuleHash, positions: positionsProp }) {
    const dragDrop = useContext(DragDropContext)
    const { isDragging, data } = dragDrop
    const { sourceId, portId } = data

    const shouldHide = useCallback(([src, dest]) => {
        if (src.id === DRAG_CABLE_ID || dest.id === DRAG_CABLE_ID) { return false }
        return (src.id === sourceId && dest.id === portId) // hide currently dragged cable
    }, [sourceId, portId])

    const shouldFade = useCallback(([src, dest]) => {
        if (selectedModuleHash == null) { return false } // no fade if no selection
        if (src.id === DRAG_CABLE_ID || dest.id === DRAG_CABLE_ID) { return false } // no fade if dragging cable
        return !isConnectedToModule(canvas, selectedModuleHash, src.id, dest.id) // fade if not connected to selection
    }, [canvas, selectedModuleHash])

    const shouldHighlight = useCallback(([src, dest]) => {
        if (selectedModuleHash == null) { return false } // no highlight if no selection
        if (src.id === DRAG_CABLE_ID || dest.id === DRAG_CABLE_ID) { return false } // no highlight if dragging cable
        return !shouldFade([src, dest])
    }, [shouldFade, selectedModuleHash])

    // use cached positions while dragging
    const positions = useCachedValue({
        value: positionsProp,
        preventUpdate: isDragging,
    })

    const cables = useCables({
        canvas,
        positions,
        shouldHighlight,
    })

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
                            [styles.hidden]: shouldHide(cable),
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
                            [styles.hidden]: shouldHide(cable),
                            [styles.fade]: shouldFade(cable),
                            [styles.highlight]: shouldHighlight(cable),
                        })}
                    />
                ))}
            </svg>
        </React.Fragment>
    )
}
