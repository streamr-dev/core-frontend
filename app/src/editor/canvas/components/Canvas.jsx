import React, { useState, useRef, useCallback, useLayoutEffect, useMemo } from 'react'
import cx from 'classnames'
import debounce from 'lodash/debounce'

import * as CanvasState from '../state'
import { useCanvasCameraDragEffects } from '../hooks/useCanvasCamera'

import Module from './Module'
import { DragDropProvider } from './DragDropContext'
import { CanvasWindowProvider } from './CanvasWindow'
import Cables from './Cables'

import styles from './Canvas.pcss'
import Camera, { useCameraState, cameraControl } from './Camera'

export default function Canvas(props) {
    const propsRef = useRef()
    propsRef.current = props

    const setPortUserValue = useCallback((portId, value, done) => {
        const { current: props } = propsRef
        props.setCanvas({ type: 'Set Port Value' }, (canvas) => (
            CanvasState.setPortUserValue(canvas, portId, value)
        ), done)
    }, [propsRef])

    const setPortOptions = useCallback((portId, options) => {
        const { current: props } = propsRef
        props.setCanvas({ type: 'Set Port Options' }, (canvas) => (
            CanvasState.setPortOptions(canvas, portId, options)
        ))
    }, [propsRef])

    const updateModuleSize = useCallback((moduleHash, diff) => {
        const { current: props } = propsRef
        props.setCanvas({ type: 'Resize Module' }, (canvas) => (
            CanvasState.updateModuleSize(canvas, moduleHash, diff)
        ))
    }, [propsRef])

    /**
     * Module & Port Drag/Drop APIs
     * note: don't add state to this as the api object doesn't change
     */

    const api = useMemo(() => ({
        selectModule: (...args) => (
            propsRef.current.selectModule(...args)
        ),
        renameModule: (...args) => (
            propsRef.current.renameModule(...args)
        ),
        moduleSidebarOpen: (...args) => (
            propsRef.current.moduleSidebarOpen(...args)
        ),
        updateModule: (...args) => (
            propsRef.current.updateModule(...args)
        ),
        loadNewDefinition: (...args) => (
            propsRef.current.loadNewDefinition(...args)
        ),
        pushNewDefinition: (...args) => (
            propsRef.current.pushNewDefinition(...args)
        ),
        updateModuleSize,
        setCanvas: (...args) => (
            propsRef.current.setCanvas(...args)
        ),
        port: {
            onChange: setPortUserValue,
            setPortOptions,
        },
    }), [propsRef, setPortUserValue, setPortOptions, updateModuleSize])

    const {
        className,
        canvas,
        selectedModuleHash,
        moduleSidebarIsOpen,
        children,
    } = props

    const { selectModule } = api

    const onFocus = useCallback((event) => {
        // deselect + close when clicking canvas
        if (event.target !== event.currentTarget) { return }
        selectModule()
    }, [selectModule])

    return (
        <div
            className={cx(styles.Canvas, className)}
            onFocus={onFocus}
            tabIndex="0"
            role="grid"
        >
            <DragDropProvider>
                <Camera>
                    <CanvasWindowProvider className={styles.CanvasWindow}>
                        <CanvasElements
                            key={canvas.id}
                            canvas={canvas}
                            api={api}
                            selectedModuleHash={selectedModuleHash}
                            moduleSidebarIsOpen={moduleSidebarIsOpen}
                        />
                    </CanvasWindowProvider>
                </Camera>
            </DragDropProvider>
            {children}
        </div>
    )
}

function CanvasElements(props) {
    const { canvas, api, selectedModuleHash, moduleSidebarIsOpen } = props
    const modulesRef = useRef()
    const portsRef = useRef(new Map())
    const [positions, setPositions] = useState({})
    const updatePositionsRef = useRef()

    const camera = useCameraState()
    const getCurrentScaleRef = useRef()
    getCurrentScaleRef.current = camera.getCurrentScale

    const updatePositionsNow = useCallback(() => {
        if (updatePositionsRef.current) {
            updatePositionsRef.current.cancel() // cancel any delayed call
        }

        if (!modulesRef.current) { return }
        const offset = modulesRef.current.getBoundingClientRect()
        const { current: ports } = portsRef
        const positions = [...ports.entries()].reduce((r, [id, el]) => {
            if (!el) { return r }
            const rect = el.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) { return r }
            return Object.assign(r, {
                [id]: {
                    id,
                    x: ((rect.left - offset.left) + (rect.width / 2)),
                    y: ((rect.top - offset.top) + (rect.height / 2)),
                    width: rect.width,
                    height: rect.height,
                },
            })
        }, {})

        setPositions(positions)
    }, [setPositions, modulesRef, portsRef, updatePositionsRef])

    // debounce as many updates will be triggered in quick succession
    // only needs to be done once at the end
    const updatePositions = useCallback(debounce(updatePositionsNow), [updatePositionsNow])
    if (updatePositionsRef.current && updatePositionsRef.current !== updatePositions) {
        updatePositionsRef.current.cancel()
    }
    updatePositionsRef.current = updatePositions

    // update positions when canvas changes
    useLayoutEffect(() => {
        updatePositionsNow()
    }, [canvas, updatePositionsNow])

    const onPort = useCallback((portId, el) => {
        portsRef.current.set(portId, el)
        updatePositions()
    }, [portsRef, updatePositions])

    const scaledPositions = useMemo(() => {
        // Always pass positions as if no scaling was performed.
        // Positions are read from DOM with current scaling applied
        // but since the cables rendered using these positions are also scaled
        // we need to unscale the values first.
        // note: does not update when scale changes, only when positions change
        // only need to reverse the scaling at time the positions are captured
        const scale = getCurrentScaleRef.current()

        return Object.values(positions).reduce((o, p) => Object.assign(o, {
            [p.id]: {
                ...p,
                x: (p.x / scale),
                y: (p.y / scale),
                width: (p.width / scale),
                height: (p.height / scale),
            },
        }), {})
    }, [positions, getCurrentScaleRef])

    useCanvasCameraDragEffects()

    if (!canvas) { return null }

    return (
        <div className={styles.CanvasElements}>
            <div
                className={cx(styles.Modules, cameraControl)}
                ref={modulesRef}
                role="grid"
            >
                {canvas.modules.map((m) => (
                    <Module
                        key={m.hash}
                        module={m}
                        canvas={canvas}
                        onPort={onPort}
                        api={api}
                        isSelected={selectedModuleHash === m.hash}
                        moduleSidebarIsOpen={moduleSidebarIsOpen}
                        {...api.module}
                    />
                ))}
            </div>
            <Cables
                canvas={canvas}
                positions={scaledPositions}
                selectedModuleHash={selectedModuleHash}
            />
        </div>
    )
}
