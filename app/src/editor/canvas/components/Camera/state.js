import isEditableElement from '$editor/shared/utils/isEditableElement'
import styles from './Camera.pcss'

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

function getParentMatching(el, selector) {
    if (!el) { return false }
    if (el.matches(selector)) { return el }
    return getParentMatching(el.parentElement, selector)
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

const defaultFit = {
    x: 0,
    y: 0,
    scale: 1,
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

export function updateScaleState(s, { x, y, scale: newScale }) {
    const { scale: currentScale } = s
    if (!currentScale) { throw new Error(`invalid current scale: ${currentScale}`) }
    if (!newScale) { throw new Error(`invalid new scale: ${newScale}`) }

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

export function createCamera(opts = {}) {
    const { scaleFactor, scaleLevels } = Object.assign({}, defaultCameraOptions, opts)
    const minScale = scaleLevels[0]
    const maxScale = scaleLevels[scaleLevels.length - 1]
    return {
        scale: 1,
        x: 0,
        y: 0,
        elRef: opts.elRef || { current: undefined },
        scaleFactor,
        scaleLevels,
        minScale,
        maxScale,
    }
}

// clamps scale
export function setState(state, v) {
    const nextState = (typeof v === 'function') ? v(state) : v
    const { minScale, maxScale } = nextState
    return {
        ...nextState,
        scale: clamp(nextState.scale, minScale, maxScale),
    }
}

// updates scale of camera, centers scaling on x,y
export function updateScale(state, { x, y, delta }) {
    const { minScale, maxScale, scaleFactor } = state
    const factor = Math.abs(scaleFactor * (delta / 120))
    const actualScaleFactor = delta < 0 ? 1 + factor : 1 - factor
    return setState(state, (s) => (
        updateScaleState(s, {
            x,
            y,
            scale: clamp(s.scale * actualScaleFactor, minScale, maxScale),
        })
    ))
}

// changes current camera position
export function setPosition(state, { x, y }) {
    return setState(state, {
        ...state,
        x,
        y,
    })
}

function getBounds(state) {
    return state.elRef.current.getBoundingClientRect()
}

// set scale to value, centered on middle of camera el
export function setScale(state, value) {
    return setState(state, (s) => {
        const { width, height } = getBounds(s)
        return updateScaleState(s, {
            x: width / 2,
            y: height / 2,
            scale: toPrecision(value, 2),
        })
    })
}

// zoom in to next largest scale level
export function zoomIn(state) {
    const { scale, scaleLevels } = state
    const currentScale = toPrecision(scale, 2)
    const nextLevel = scaleLevels.find((v) => v > currentScale) || scale
    return setScale(state, nextLevel)
}

// zoom out to next largest scale level
export function zoomOut(state) {
    const { scale, scaleLevels } = state
    const currentScale = toPrecision(scale, 2)
    const nextLevel = scaleLevels.slice().reverse().find((v) => v < currentScale) || scale
    return setScale(state, nextLevel)
}

// changes current camera offset i.e. pans camera
export function pan(state, { x = 0, y = 0 } = {}) {
    return setState(state, (s) => ({
        ...s,
        x: s.x + x,
        y: s.y + y,
    }))
}

// fit camera to supplied bounds
export function fitBounds(state, opts) {
    return setState(state, (s) => ({
        ...s,
        ...fitBoundsTo(opts),
    }))
}

// fit supplied bounds to camera element bounds
export function fitView(state, opts) {
    const { width, height } = getBounds(state)
    return fitBounds(state, {
        ...opts,
        fit: {
            width,
            height,
        },
    })
}

// move bounds into center
export function centerBounds(state, { bounds }) {
    const { width, height } = getBounds(state)
    return setState(state, (s) => ({
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
}

export function areBoundsInView(state, { bounds, padding = 0 }) {
    const { x, y, scale } = state
    const { width, height } = getBounds(state)

    return (
        ((bounds.x * scale) + x) >= padding
        && ((bounds.y * scale) + y) >= padding
        && (((bounds.x + bounds.width) * scale) + x) < (width - padding)
        && (((bounds.y + bounds.height) * scale) + y) < (height - padding)
    )
}

// minimally move bounds into view, if not already in view
export function panIntoViewIfNeeded(state, { bounds, padding }) {
    const inView = areBoundsInView(state, {
        bounds,
        padding,
    })
    if (inView) { return state }

    const { x, y, scale } = state
    const { width, height } = getBounds(state)

    const [overLeft, overTop, overRight, overBottom] = [
        padding - ((bounds.x * scale) + x),
        padding - ((bounds.y * scale) + y),
        (((bounds.x + bounds.width) * scale) + x) - (width - padding),
        (((bounds.y + bounds.height) * scale) + y) - (height - padding),
    ].map((v) => Math.max(0, v))

    // if too big to fit on screen rescale and center
    if ((overLeft > 0 && overRight > 0) || (overTop > 0 && overBottom > 0)) {
        return fitView(state, {
            bounds,
            padding,
        })
    }

    // prioritise top & left offsets over right & bottom
    const offsetX = overLeft > 0 ? overLeft : -overRight
    const offsetY = overTop > 0 ? overTop : -overBottom

    return setState(state, (s) => ({
        ...s,
        x: s.x + offsetX,
        y: s.y + offsetY,
    }))
}

// convert bounds in screen/camera coordinates to world coordinates
export function cameraToWorldBounds(state, bounds) {
    const { x, y, scale } = state
    const canvasX = (bounds.x - x) / scale
    const canvasY = (bounds.y - y) / scale
    return {
        x: canvasX,
        y: canvasY,
        width: bounds.width / scale,
        height: bounds.height / scale,
    }
}

// convert point in screen/camera coordinates to world coordinates
export function cameraToWorldPoint(state, point) {
    const { x, y } = cameraToWorldBounds(state, {
        ...point,
        width: 1,
        height: 1,
    })
    return {
        x,
        y,
    }
}

/**
 * Get world point at center of screen
 */

export function getCenterWorldPoint(state) {
    const { width, height } = getBounds(state)
    return cameraToWorldPoint(state, {
        x: width / 2,
        y: height / 2,
    })
}

export function eventToWorldPoint(state, event) {
    const point = {
        x: 0,
        y: 0,
    }

    const { elRef } = state
    if (event.target === elRef.current) {
        // if target is camera el then we can just use event offsets
        point.x = event.offsetX
        point.y = event.offsetY
    } else {
        const { left, top } = getBounds(state)
        // otherwise need to calculate offset
        point.x = event.clientX - left
        point.y = event.clientY - top
    }

    const { x, y } = cameraToWorldBounds(state, {
        ...point,
        width: 1,
        height: 1,
    })
    return {
        x,
        y,
    }
}

export function shouldIgnoreEvent(state, event) {
    const { current: el } = state.elRef

    // do not ignore if has cameraControl class
    if (event.target.classList.contains(styles.cameraControl)) { return false }
    // always ignore if has noCameraControl class
    if (event.target.classList.contains(styles.noCameraControl)) { return true }
    // always ignore if target is editable
    if (isEditableElement(event.target)) { return true }

    // do not ignore if is within parent with cameraControl class
    const cameraControlEl = getParentMatching(event.target, `.${styles.cameraControl}`)
    // ignore if is within parent with noCameraControl class
    const noCameraControlEl = getParentMatching(event.target, `.${styles.noCameraControl}`)
    if (cameraControlEl && noCameraControlEl) {
        return cameraControlEl.contains(noCameraControlEl)
    }
    if (cameraControlEl) { return false }
    if (noCameraControlEl) { return false }

    return (
        // ignore if target not within camera el and isn't body
        !el.contains(event.target) && event.target !== document.body
    )
}
