import React, { useState, useRef, useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import cx from 'classnames'
import debounce from 'lodash/debounce'

import { getCanvasBounds } from '$editor/shared/utils/bounds'
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

    const [scale, setScale] = useState(1)

    const onChangeCamera = useCallback(({ scale }) => {
        setScale(scale)
    }, [setScale])

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

    const scaleRef = useRef()
    scaleRef.current = scale

    const animatedScaleRef = useRef()

    const scaledPositions = useMemo(() => {
        // Always pass positions as if no scaling was performed.
        // Positions are read from DOM with current scaling applied
        // but since the cables rendered using these positions are also scaled
        // we need to unscale the values first.
        // note: does not update when scale changes, only when positions change
        // only need to reverse the scaling at time the positions are captured
        let { current: scale } = scaleRef
        if (animatedScaleRef.current) {
            scale = animatedScaleRef.current.getValue()
        }

        return Object.values(positions).reduce((o, p) => Object.assign(o, {
            [p.id]: {
                ...p,
                x: (p.x / scale),
                y: (p.y / scale),
                width: (p.width / scale),
                height: (p.height / scale),
            },
        }), {})
    }, [positions, scaleRef])

    const [bounds, setBounds] = useState()

    useEffect(() => {
        if (!canvas) { return }
        if (!canvas.modules.length) {
            // use default bounds if no modules
            setBounds({})
            return
        }
        const { current: modulesEl } = modulesRef
        setBounds({
            ...getCanvasBounds(canvas),
            fitWidth: modulesEl.clientWidth,
            fitHeight: modulesEl.clientHeight,
            padding: 100,
        })
    }, [canvas])

    const onStart = useCallback((v) => {
        if (v.key !== 'scale') { return }
        animatedScaleRef.current = v.animated
    }, [animatedScaleRef])

    if (!canvas) { return null }

    return (
        <Camera bounds={bounds} className={styles.CanvasElements} onStart={onStart} onChange={onChangeCamera}>
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
