import React, { useRef, useState, useCallback, useLayoutEffect, useEffect, useMemo, useContext } from 'react'
import { useSpring, animated, to } from 'react-spring'
import cx from 'classnames'
import styles from './Camera.pcss'

import isEditableElement from '$editor/shared/utils/isEditableElement'

import { useThrottled } from '$shared/hooks/wrapCallback'

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

/**
 * Allows interaction events to bubble from this element
 * and be handled by camera controls
 */
export const { cameraControl } = styles

const defaultFit = {
    x: 0,
    y: 0,
    scale: 1,
}

function scaleToFit({ bounds, fit, maxScale = 1, padding = 20 } = {}) {
    const totalPadding = 2 * padding
    const maxWidth = fit.width - totalPadding
    const maxHeight = fit.height - totalPadding
    return Math.min(maxScale, Math.min(maxWidth / bounds.width, maxHeight / bounds.height))
}

function centerBoundsTo({ bounds, fit, scale }) {
    // vertically & horizontally center content
    const offsetY = fit.height / 2
    const offsetX = fit.width / 2

    return {
        x: -((bounds.x + (bounds.width / 2)) * scale) + offsetX,
        y: -((bounds.y + (bounds.height / 2)) * scale) + offsetY,
    }
}

function toPrecision(v, precision = 0) {
    if (!precision) { return v }
    const p = 10 ** precision
    return Math.round((v * p)) / p
}

function fitBoundsTo({ bounds, fit, padding }) {
    const scale = scaleToFit({
        bounds,
        fit,
        padding,
    })

    if (!scale) { return defaultFit }

    const { x, y } = centerBoundsTo({
        bounds,
        fit,
        scale,
    })

    return {
        x,
        y,
        scale,
    }
}

function updateScaleState(s, { x, y, scale: newScale }) {
    const { scale: currentScale } = s

    // adjust for offset created by scale change
    const ratio = (1 - (newScale / currentScale))
    const x2 = s.x + ((x - s.x) * ratio)
    const y2 = s.y + ((y - s.y) * ratio)

    return {
        ...s,
        scale: newScale,
        x: x2,
        y: y2,
    }
}
const defaultCameraOptions = {
    scaleFactor: 0.1,
    scaleLevels: [
        0.1,
        0.25,
        0.5,
        1.0,
        1.25,
        1.50,
        2.0,
        3.0,
    ],
}

function hasParentMatching(el, selector) {
    if (!el) { return false }
    if (el.matches(selector)) { return true }
    return hasParentMatching(el.parentElement, selector)
}

function useCameraSimpleApi(opts) {
    const { scaleFactor, scaleLevels } = Object.assign({}, defaultCameraOptions, opts)
    const minScale = scaleLevels[0]
    const maxScale = scaleLevels[scaleLevels.length - 1]
    const [state, setActualState] = useState({
        scale: 1,
        x: 0,
        y: 0,
    })

    const elRef = useRef()

    const { scale, x, y } = state

    // clamps scale
    const setState = useCallback((v) => {
        setActualState((state) => {
            const nextState = (typeof v === 'function') ? v(state) : v
            return {
                ...nextState,
                scale: clamp(nextState.scale, minScale, maxScale),
            }
        })
    }, [setActualState, minScale, maxScale])

    // updates scale of camera, centers scaling on x,y
    const updateScale = useCallback(({ x, y, delta }) => {
        setState((s) => {
            const factor = Math.abs(scaleFactor * (delta / 120))
            const actualScaleFactor = delta < 0 ? 1 + factor : 1 - factor
            return updateScaleState(s, {
                x,
                y,
                scale: clamp(s.scale * actualScaleFactor, minScale, maxScale),
            })
        })
    }, [setState, scaleFactor, minScale, maxScale])

    // init needed to reset last values before starting pan
    const initUpdatePosition = useCallback(({ x, y }) => {
        setState((s) => ({
            ...s,
            lastX: x,
            lastY: y,
        }))
    }, [setState])

    // changes current camera position
    const setPosition = useCallback(({ x, y }) => {
        setState((s) => ({
            ...s,
            x,
            y,
        }))
    }, [setState])

    // changes current camera offset i.e. pans camera
    const updatePosition = useCallback(({ x, y }) => {
        setState(({ lastX = x, lastY = y, ...s }) => ({
            ...s,
            lastX: x,
            lastY: y,
            x: s.x + (x - lastX),
            y: s.y + (y - lastY),
        }))
    }, [setState])

    // set scale to value, centered on middle of camera el
    const setScale = useCallback((value) => {
        setState((s) => {
            const rect = elRef.current.getBoundingClientRect()
            return updateScaleState(s, {
                x: rect.left + (rect.width / 2),
                y: rect.top + (rect.height / 2),
                scale: clamp(toPrecision(value, 2), minScale, maxScale),
            })
        })
    }, [setState, minScale, maxScale])

    // zoom in to next largest scale level
    const zoomIn = useCallback(() => {
        const currentScale = toPrecision(scale, 2)
        const nextLevel = scaleLevels.find((v) => v > currentScale) || scale
        setScale(nextLevel)
    }, [setScale, scale, scaleLevels])

    // zoom out to next largest scale level
    const zoomOut = useCallback(() => {
        const currentScale = toPrecision(scale, 2)
        const nextLevel = scaleLevels.slice().reverse().find((v) => v < currentScale) || scale
        setScale(nextLevel)
    }, [setScale, scale, scaleLevels])

    const pan = useCallback(({ x = 0, y = 0 } = {}) => {
        setState((s) => ({
            ...s,
            x: s.x + x,
            y: s.y + y,
        }))
    }, [setState])

    // fit camera to supplied bounds
    const fitBounds = useCallback((opts) => {
        setState((s) => ({
            ...s,
            ...fitBoundsTo(opts),
        }))
    }, [setState])

    // fit supplied bounds to camera element bounds
    const fitView = useCallback((opts) => {
        const { current: cameraEl } = elRef
        const { width, height } = cameraEl.getBoundingClientRect()
        return fitBounds({
            ...opts,
            fit: {
                width,
                height,
            },
        })
    }, [fitBounds, elRef])

    // move bounds into center
    const centerBounds = useCallback(({ bounds }) => {
        const { current: cameraEl } = elRef
        const { width, height } = cameraEl.getBoundingClientRect()

        return setState((s) => ({
            ...s,
            ...centerBoundsTo({
                bounds,
                fit: {
                    width,
                    height,
                },
                scale: s.scale,
            }),
        }))
    }, [setState, elRef])

    const areBoundsInView = useCallback(({ bounds, padding = 0 }) => {
        const { current: cameraEl } = elRef
        const { width, height } = cameraEl.getBoundingClientRect()

        return (
            ((bounds.x * scale) + x) >= padding
            && ((bounds.y * scale) + y) >= padding
            && (((bounds.x + bounds.width) * scale) + x) < (width - padding)
            && (((bounds.y + bounds.height) * scale) + y) < (height - padding)
        )
    }, [scale, x, y])

    // minimally move bounds into view, if not already in view
    const panIntoViewIfNeeded = useCallback(({ bounds, padding }) => {
        const inView = areBoundsInView({
            bounds,
            padding,
        })
        if (inView) { return }

        const { current: cameraEl } = elRef
        const { width, height } = cameraEl.getBoundingClientRect()

        const [overLeft, overTop, overRight, overBottom] = [
            padding - ((bounds.x * scale) + x),
            padding - ((bounds.y * scale) + y),
            (((bounds.x + bounds.width) * scale) + x) - (width - padding),
            (((bounds.y + bounds.height) * scale) + y) - (height - padding),
        ].map((v) => Math.max(0, v))

        // if too big to fit on screen rescale and center
        if ((overLeft > 0 && overRight > 0) || (overTop > 0 && overBottom > 0)) {
            return fitView({
                bounds,
                padding,
            })
        }

        // prioritise top & left offsets over right & bottom
        const offsetX = overLeft > 0 ? overLeft : -overRight
        const offsetY = overTop > 0 ? overTop : -overBottom

        return setState((s) => ({
            ...s,
            x: s.x + offsetX,
            y: s.y + offsetY,
        }))
    }, [setState, scale, x, y, areBoundsInView, fitView, elRef])

    // convert bounds in screen/camera coordinates to world coordinates
    const cameraToWorldBounds = useCallback((bounds) => {
        const canvasX = (bounds.x - x) / scale
        const canvasY = (bounds.y - y) / scale
        return {
            x: canvasX,
            y: canvasY,
            width: bounds.width / scale,
            height: bounds.height / scale,
        }
    }, [x, y, scale])

    // convert point in screen/camera coordinates to world coordinates
    const cameraToWorldPoint = useCallback((point) => {
        const { x, y } = cameraToWorldBounds({
            ...point,
            width: 1,
            height: 1,
        })
        return {
            x,
            y,
        }
    }, [cameraToWorldBounds])

    const eventToWorldPoint = useCallback((event) => {
        const point = {
            x: 0,
            y: 0,
        }

        if (event.target === elRef.current) {
            // if target is camera el then we can just use event offsets
            point.x = event.offsetX
            point.y = event.offsetY
        } else {
            const rect = elRef.current.getBoundingClientRect()
            // otherwise need to calculate offset
            point.x = event.clientX - rect.left
            point.y = event.clientY - rect.top
        }

        const { x, y } = cameraToWorldBounds({
            ...point,
            width: 1,
            height: 1,
        })
        return {
            x,
            y,
        }
    }, [cameraToWorldBounds])

    const shouldIgnoreEvent = useCallback((event) => {
        const { current: el } = elRef

        // do not ignore if has cameraControl class
        if (event.target.classList.contains(styles.cameraControl)) { return false }
        // always ignore if target is editable
        if (isEditableElement(event.target)) { return true }

        // do not ignore if is within parent with cameraControl class
        if (hasParentMatching(event.target, `.${styles.cameraControl}`)) { return false }

        return (
            // ignore if target not within camera el and isn't body
            !el.contains(event.target) && event.target !== document.body
        )
    }, [elRef])

    return useMemo(() => ({
        ...state,
        elRef,
        updateScale,
        setPosition,
        initUpdatePosition,
        updatePosition,
        setState,
        zoomIn,
        zoomOut,
        pan,
        setScale,
        fitBounds,
        fitView,
        centerBounds,
        areBoundsInView,
        cameraToWorldBounds,
        cameraToWorldPoint,
        panIntoViewIfNeeded,
        eventToWorldPoint,
        shouldIgnoreEvent,
        scaleFactor,
        minScale,
        maxScale,
    }), [
        state,
        setState,
        updateScale,
        updatePosition,
        initUpdatePosition,
        setPosition,
        zoomIn,
        zoomOut,
        pan,
        setScale,
        fitBounds,
        fitView,
        centerBounds,
        areBoundsInView,
        cameraToWorldBounds,
        cameraToWorldPoint,
        panIntoViewIfNeeded,
        eventToWorldPoint,
        shouldIgnoreEvent,
        scaleFactor,
        minScale,
        maxScale,
    ])
}

const defaultCameraConfig = {
    config: {
        mass: 1,
        friction: 62,
        tension: 700,
        precision: 0.00001,
    },
}

function useCameraSpringApi() {
    const camera = useCameraSimpleApi()
    const {
        x,
        y,
        scale,
        scaleFactor,
        setState,
        minScale,
        maxScale,
    } = camera

    const destStateRef = useRef({
        x,
        y,
        scale,
    })

    const springRef = useRef()
    const commitSpringState = useCallback(() => {
        setState({
            x: springRef.current.x.value,
            y: springRef.current.y.value,
            scale: springRef.current.scale.value,
        })
    }, [setState])

    const commitDestState = useCallback(() => {
        setState(destStateRef.current)
    }, [setState])

    const [cameraConfig, setCameraConfig] = useState({
        ...defaultCameraConfig,
    })

    const onSpring = () => ({
        x,
        y,
        scale,
        ...cameraConfig,
    })

    const [spring, set, stop] = useSpring(onSpring)

    const lastRef = useRef()

    springRef.current = spring
    const isTransitioning = !(spring.x.done && spring.y.done && spring.scale.done)

    useLayoutEffect(() => {
        // update dest state to current state if not transitioning
        if (isTransitioning) { return }
        destStateRef.current = {
            x,
            y,
            scale,
        }
        set({
            x,
            y,
            scale,
            ...cameraConfig,
        })
    }, [x, y, set, scale, cameraConfig, isTransitioning])

    const startSmoothPan = useCallback(({ x, y }) => {
        lastRef.current = {
            lastX: x,
            lastY: y,
        }
    }, [])

    const smoothPan = useCallback(({ x: px, y: py }) => {
        const { lastX = px, lastY = py } = lastRef.current || {}
        const { x, y } = destStateRef.current
        destStateRef.current = {
            ...destStateRef.current,
            x: x + (px - lastX),
            y: y + (py - lastY),
        }
        lastRef.current = {
            lastX: px,
            lastY: py,
        }
        set(destStateRef.current)
    }, [set])

    const smoothUpdateScale = useCallback(({ x, y, delta }) => {
        const factor = Math.abs(scaleFactor * (delta / 120))
        const actualScaleFactor = delta < 0 ? 1 + factor : 1 - factor
        const currentScale = destStateRef.current.scale

        destStateRef.current = updateScaleState(destStateRef.current, {
            x,
            y,
            scale: clamp(currentScale * actualScaleFactor, minScale, maxScale),
        })
        set(destStateRef.current)
    }, [set, scaleFactor, minScale, maxScale])

    const stopRef = useRef()
    stopRef.current = stop

    const getSpring = useCallback(() => (
        springRef.current
    ), [springRef])

    const getCurrentScale = useCallback(() => (
        springRef.current.scale.getValue()
    ), [springRef])

    const resetCameraConfig = useCallback(() => (
        setCameraConfig(defaultCameraConfig)
    ), [setCameraConfig])

    const stopSpring = useCallback(() => (
        stopRef.current()
    ), [stopRef])

    return useMemo(() => ({
        resetCameraConfig,
        defaultCameraConfig,
        setCameraConfig,
        getCurrentScale,
        getSpring,
        stopSpring,
        ...camera,
        smoothPan,
        startSmoothPan,
        commitSpringState,
        commitDestState,
        smoothUpdateScale,
    }), [
        getSpring,
        startSmoothPan,
        smoothPan,
        commitSpringState,
        commitDestState,
        smoothUpdateScale,
        camera,
        setCameraConfig,
        getCurrentScale,
        resetCameraConfig,
        stopSpring,
    ])
}

export const CameraContext = React.createContext({})

export function useCameraState() {
    const { x, y, scale, getCurrentScale } = useContext(CameraContext)
    return useMemo(() => ({
        x,
        y,
        scale,
        getCurrentScale,
    }), [x, y, scale, getCurrentScale])
}

export function useCameraContext() {
    return useContext(CameraContext)
}

export function CameraProvider({ onChange, children, ...props }) {
    const camera = useCameraSpringApi(props)
    useEffect(() => {
        if (typeof onChange !== 'function') { return }
        onChange(camera)
    }, [onChange, camera])

    return (
        <CameraContext.Provider value={camera}>
            {children}
        </CameraContext.Provider>
    )
}

function useWheelControls(elRef) {
    const { smoothUpdateScale, commitDestState, shouldIgnoreEvent } = useCameraContext()

    const commitDebounced = useThrottled(useCallback(() => {
        commitDestState()
    }, [commitDestState]), 500)

    const onChangeScale = useCallback((event) => {
        if (shouldIgnoreEvent(event)) { return }
        event.preventDefault()
        const el = elRef.current
        const { deltaY: delta } = event
        if (delta === 0) { return }
        const { left, top } = el.getBoundingClientRect()
        // find current location on screen
        const x = event.clientX - left
        const y = event.clientY - top
        smoothUpdateScale({
            x,
            y,
            delta,
        })
        commitDebounced()
    }, [elRef, commitDebounced, smoothUpdateScale, shouldIgnoreEvent])

    useEffect(() => {
        const el = elRef.current
        el.addEventListener('wheel', onChangeScale)
        return () => {
            el.removeEventListener('wheel', onChangeScale)
        }
    }, [elRef, onChangeScale])
}

function usePanControls(elRef) {
    const { smoothPan, startSmoothPan, commitSpringState } = useCameraContext()
    const [isPanning, setPanning] = useState(false)

    const startPanning = useCallback((event) => {
        if (event.buttons !== 1) { return }
        // ignore bubbled, unless has cameraControl style
        if (
            event.currentTarget !== event.target &&
            !event.target.classList.contains(styles.cameraControl)
        ) { return }

        if (isPanning) { return }
        event.stopPropagation()
        const el = elRef.current
        const { left, top } = el.getBoundingClientRect()
        // find current location on screen
        const x = event.clientX - left
        const y = event.clientY - top
        startSmoothPan({
            x,
            y,
        })
        setPanning(true)
    }, [elRef, isPanning, startSmoothPan, setPanning])

    const stopPanning = useCallback(() => {
        if (!isPanning) { return }
        commitSpringState()
        setPanning(false)
    }, [isPanning, commitSpringState])

    const pan = useCallback((event) => {
        if (!isPanning) { return }
        if (event.buttons !== 1) {
            stopPanning(event)
            return
        }

        const el = elRef.current
        const { left, top } = el.getBoundingClientRect()
        // find current location on screen
        const x = event.clientX - left
        const y = event.clientY - top
        smoothPan({
            x,
            y,
        })
    }, [isPanning, elRef, stopPanning, smoothPan])

    useEffect(() => {
        if (!isPanning) { return }
        window.addEventListener('mousemove', pan)
        window.addEventListener('mouseup', stopPanning)
        return () => {
            window.removeEventListener('mousemove', pan)
            window.removeEventListener('mouseup', stopPanning)
        }
    }, [isPanning, pan, stopPanning])

    useEffect(() => {
        const el = elRef.current
        el.addEventListener('mousedown', startPanning)
        return () => {
            el.removeEventListener('mousedown', startPanning)
        }
    }, [elRef, startPanning])
}

function useKeyboardPanControls({ panAmount = 25 } = {}) {
    const { pan, shouldIgnoreEvent } = useCameraContext()
    const onKeyDown = useCallback((event) => {
        if (shouldIgnoreEvent(event)) { return }
        if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            pan({ x: panAmount })
        }
        if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
            event.preventDefault()
            event.stopPropagation()
            pan({ x: -panAmount })
        }
        if ((!event.shiftKey && event.key === 'ArrowUp') || event.key.toLowerCase() === 'w') {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            pan({ y: panAmount })
        }

        if ((!event.shiftKey && event.key === 'ArrowDown') || event.key.toLowerCase() === 's') {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            pan({ y: -panAmount })
        }
    }, [pan, panAmount, shouldIgnoreEvent])
    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [onKeyDown])
}

function useKeyboardZoomControls() {
    const { zoomIn, zoomOut, shouldIgnoreEvent } = useCameraContext()
    const onKeyDown = useCallback((event) => {
        if (shouldIgnoreEvent(event)) { return }
        const meta = (event.metaKey || event.ctrlKey)
        if (((event.key === '+' || event.key === '=') && meta) || (event.key === 'ArrowUp' && event.shiftKey)) {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            zoomIn()
        }
        if ((event.key === '-' && meta) || (event.key === 'ArrowDown' && event.shiftKey)) {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            zoomOut()
        }
    }, [zoomIn, zoomOut, shouldIgnoreEvent])
    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [onKeyDown])
}

function useCameraSpring() {
    const camera = useCameraContext()
    return camera.getSpring()
}

export default function Camera({ className, children }) {
    const elRef = useRef()
    const camera = useCameraContext()
    useLayoutEffect(() => {
        camera.elRef.current = elRef.current
    })

    useWheelControls(elRef)
    usePanControls(elRef)
    useKeyboardPanControls()
    useKeyboardZoomControls()

    const spring = useCameraSpring()

    return (
        <div className={cx(className, styles.root)} ref={elRef}>
            <animated.div
                className={styles.scaleLayer}
                style={{
                    transform: to([spring.x, spring.y, spring.scale], (x, y, scale) => (
                        `translate(${x}px, ${y}px) scale(${scale})`
                    )),
                }}
            >
                {children}
            </animated.div>
        </div>
    )
}
