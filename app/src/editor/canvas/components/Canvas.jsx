import React, { useState, useRef, useCallback, useLayoutEffect, useMemo } from 'react'
import cx from 'classnames'
import debounce from 'lodash/debounce'

import * as CanvasState from '../state'

import Module from './Module'
import { DragDropProvider } from './DragDropContext'
import { CanvasWindowProvider } from './CanvasWindow'
import Cables from './Cables'

import styles from './Canvas.pcss'
import Camera, { cameraControl } from './Camera'

export default class Canvas extends React.PureComponent {
    setPortUserValue = (portId, value, done) => {
        this.props.setCanvas({ type: 'Set Port Value' }, (canvas) => (
            CanvasState.setPortUserValue(canvas, portId, value)
        ), done)
    }

    setPortOptions = (portId, options) => {
        this.props.setCanvas({ type: 'Set Port Options' }, (canvas) => (
            CanvasState.setPortOptions(canvas, portId, options)
        ))
    }

    updateModuleSize = (moduleHash, diff) => {
        this.props.setCanvas({ type: 'Resize Module' }, (canvas) => (
            CanvasState.updateModuleSize(canvas, moduleHash, diff)
        ))
    }

    /**
     * Module & Port Drag/Drop APIs
     * note: don't add state to this as the api object doesn't change
     */

    api = {
        selectModule: (...args) => (
            this.props.selectModule(...args)
        ),
        renameModule: (...args) => (
            this.props.renameModule(...args)
        ),
        moduleSidebarOpen: (...args) => (
            this.props.moduleSidebarOpen(...args)
        ),
        updateModule: (...args) => (
            this.props.updateModule(...args)
        ),
        loadNewDefinition: (...args) => (
            this.props.loadNewDefinition(...args)
        ),
        pushNewDefinition: (...args) => (
            this.props.pushNewDefinition(...args)
        ),
        updateModuleSize: this.updateModuleSize,
        setCanvas: (...args) => (
            this.props.setCanvas(...args)
        ),
        port: {
            onChange: this.setPortUserValue,
            setPortOptions: this.setPortOptions,
        },
    }

    render() {
        const {
            className,
            canvas,
            selectedModuleHash,
            moduleSidebarIsOpen,
            children,
        } = this.props

        return (
            <CanvasWindowProvider className={styles.CanvasWindow}>
                <div className={cx(styles.Canvas, className)}>
                    <CanvasElements
                        key={canvas.id}
                        canvas={canvas}
                        api={this.api}
                        selectedModuleHash={selectedModuleHash}
                        moduleSidebarIsOpen={moduleSidebarIsOpen}
                        {...this.api.module}
                    />
                    {children}
                </div>
            </CanvasWindowProvider>
        )
    }
}

function CanvasElements(props) {
    const { canvas, api, selectedModuleHash, moduleSidebarIsOpen } = props
    const modulesRef = useRef()
    const portsRef = useRef(new Map())
    const [positions, setPositions] = useState({})
    const updatePositionsRef = useRef()

    const [camera, setCamera] = useState(1)

    const onChangeCamera = useCallback((camera) => {
        setCamera(camera)
    }, [setCamera])

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
                    top: ((rect.top - offset.top) + (rect.height / 2)),
                    bottom: ((rect.bottom - offset.bottom) + (rect.height / 2)),
                    left: ((rect.left - offset.left) + (rect.width / 2)),
                    right: ((rect.right - offset.right) + (rect.width / 2)),
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

    const { selectModule } = api
    const onFocus = useCallback((event) => {
        // deselect + close when clicking canvas
        if (event.target !== event.currentTarget) { return }
        selectModule()
    }, [selectModule])

    const onPort = useCallback((portId, el) => {
        portsRef.current.set(portId, el)
        updatePositions()
    }, [portsRef, updatePositions])

    const cameraRef = useRef()
    cameraRef.current = camera

    const scaledPositions = useMemo(() => {
        // Always pass positions as if no scaling was performed.
        // Positions are read from DOM with current scaling applied
        // but since the cables rendered using these positions are also scaled
        // we need to unscale the values first.
        // note: does not update when scale changes, only when positions change
        // only need to reverse the scaling at time the positions are captured
        const { current: camera } = cameraRef
        return Object.values(positions).reduce((o, p) => Object.assign(o, {
            [p.id]: {
                ...p,
                top: (p.top / camera.scale),
                bottom: (p.bottom / camera.scale),
                left: (p.left / camera.scale),
                right: (p.right / camera.scale),
                width: (p.width / camera.scale),
                height: (p.height / camera.scale),
            },
        }), {})
    }, [positions, cameraRef])

    if (!canvas) { return null }

    return (
        <Camera className={styles.CanvasElements} onChange={onChangeCamera}>
            <DragDropProvider>
                <div
                    className={cx(styles.Modules, cameraControl)}
                    onFocus={onFocus}
                    ref={modulesRef}
                    tabIndex="0"
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
            </DragDropProvider>
        </Camera>
    )
}
