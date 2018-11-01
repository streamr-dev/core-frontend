import update from 'lodash/fp/update'
import get from 'lodash/get'

export const DragTypes = {
    Module: 'Module',
    Port: 'Port',
}

/**
 * Module hash -> path to module in canvas
 */

function indexModules(canvas) {
    return canvas.modules.reduce((o, m, index) => Object.assign(o, {
        [m.hash]: ['modules', index],
    }), {})
}

/**
 * Port Id -> path to port in canvas
 */

function indexPorts(canvas, moduleIndex) {
    return Object.values(moduleIndex).reduce((o, modulePath) => {
        const module = get(canvas, modulePath)
        // create port paths by appending
        // module path + inputs/outputs/params + port's index
        module.params.forEach((port, index) => {
            o[port.id] = modulePath.concat('params', index)
        })
        module.inputs.forEach((port, index) => {
            o[port.id] = modulePath.concat('inputs', index)
        })
        module.outputs.forEach((port, index) => {
            o[port.id] = modulePath.concat('outputs', index)
        })
        return o
    }, {})
}

/**
 * Module and Port Indexes
 */

function createIndex(canvas) {
    if (!canvas || typeof canvas !== 'object') {
        throw new Error('bad canvas')
    }
    const modules = indexModules(canvas)
    const ports = indexPorts(canvas, modules)
    return {
        canvas,
        modules,
        ports,
    }
}

const memoize = (fn) => {
    const cache = new WeakMap()
    return (item) => {
        const cached = cache.get(item)
        if (cached) { return cached }
        const result = fn(item)
        cache.set(item, result)
        return result
    }
}

/**
 * Memoized Index
 */

export const getIndex = memoize(createIndex)

/**
 * Determine if port is input/output/param
 */

function getPortType(canvas, portId) {
    const canvasIndex = getIndex(canvas)
    const path = canvasIndex.ports[portId]
    if (!path) { return }
    return path[path.length - 2].slice(0, -1) // inputs -> input, outputs -> output
}

/**
 * Path to port's parent module
 */

function getPortModulePath(canvas, portId) {
    const canvasIndex = getIndex(canvas)
    const path = canvasIndex.ports[portId]
    if (!path) { return }
    return path.slice(0, -2)
}

/**
 * True if port is an output port
 */

function getIsOutput(canvas, portId) {
    const type = getPortType(canvas, portId)
    return type === 'output'
}

/**
 * Parent module for port
 */

export function getModuleForPort(canvas, portId) {
    return get(canvas, getPortModulePath(canvas, portId))
}

export function getModule(canvas, moduleHash) {
    const { modules } = getIndex(canvas)
    return get(canvas, modules[moduleHash])
}

export function getPort(canvas, portId) {
    const { ports } = getIndex(canvas)
    return get(canvas, ports[portId])
}

export function getModulePorts(canvas, moduleHash) {
    const module = getModule(canvas, moduleHash)
    const ports = {}
    module.params.forEach((port) => {
        ports[port.id] = getPort(canvas, port.id)
    })
    module.inputs.forEach((port) => {
        ports[port.id] = getPort(canvas, port.id)
    })
    module.outputs.forEach((port) => {
        ports[port.id] = getPort(canvas, port.id)
    })

    return ports
}

export function getConnectedPortIds(canvas, portId) {
    const port = getPort(canvas, portId)
    if (!getIsOutput(canvas, portId)) {
        return [port.sourceId].filter(Boolean)
    }

    const { ports } = getIndex(canvas)
    return Object.keys(ports).filter((id) => {
        const { sourceId } = getPort(canvas, id)
        return sourceId === portId
    }).filter(Boolean)
}

export function isPortConnected(canvas, portId) {
    const conn = getConnectedPortIds(canvas, portId)
    return !!conn.length
}

export function updatePort(canvas, portId, fn) {
    const { ports } = getIndex(canvas)
    return update(ports[portId], fn, canvas)
}

export function updateModule(canvas, moduleHash, fn) {
    const { modules } = getIndex(canvas)
    return update(modules[moduleHash], fn, canvas)
}

export function updateModulePosition(canvas, moduleHash, diff) {
    const { modules } = getIndex(canvas)
    const modulePath = modules[moduleHash]
    return update(modulePath.concat('layout', 'position'), (position) => ({
        ...position,
        top: `${Number.parseInt(position.top, 10) + diff.y}px`,
        left: `${Number.parseInt(position.left, 10) + diff.x}px`,
    }), canvas)
}

export function updateModuleSize(canvas, moduleHash, size) {
    const { modules } = getIndex(canvas)
    const modulePath = modules[moduleHash]
    return update(modulePath.concat('layout'), (layout) => ({
        ...layout,
        height: `${size.height}px`,
        width: `${size.width}px`,
    }), canvas)
}

function getOutputInputPorts(canvas, portIdA, portIdB) {
    const ports = [getPort(canvas, portIdA), getPort(canvas, portIdB)]
    if (getIsOutput(canvas, portIdB)) {
        ports.reverse() // ensure output port is first
    }

    return ports
}

export function canConnectPorts(canvas, portIdA, portIdB) {
    if (getIsOutput(canvas, portIdA) === getIsOutput(canvas, portIdB)) {
        // if both inputs or both outputs, cannot connect
        return false
    }

    const [output, input] = getOutputInputPorts(canvas, portIdA, portIdB)

    if (!input.canConnect || !output.canConnect) { return false }

    // verify compatible types
    const inputTypes = new Set(input.acceptedTypes)
    // Object type can connect to anything
    if (output.type === 'Object' || inputTypes.has('Object')) { return true }
    return inputTypes.has(output.type)
}

export function disconnectPorts(canvas, portIdA, portIdB) {
    const [output, input] = getOutputInputPorts(canvas, portIdA, portIdB)
    if (input.sourceId !== output.id) {
        return canvas // not connected
    }

    // disconnect input
    let nextCanvas = updatePort(canvas, input.id, (port) => ({
        ...port,
        sourceId: null,
        connected: false,
    }))

    // disconnect output
    nextCanvas = updatePort(nextCanvas, output.id, (port) => ({
        ...port,
        connected: isPortConnected(nextCanvas, output.id),
    }))

    return nextCanvas
}

export function connectPorts(canvas, portIdA, portIdB) {
    if (!canConnectPorts(canvas, portIdA, portIdB)) {
        throw new Error(`cannot connect ${portIdA}, ${portIdB}`)
    }

    const [output, input] = getOutputInputPorts(canvas, portIdA, portIdB)

    let nextCanvas = canvas

    if (input.sourceId) {
        // disconnect existing input connection
        nextCanvas = disconnectPorts(nextCanvas, input.sourceId, input.id)
    }

    // connect input
    nextCanvas = updatePort(nextCanvas, input.id, (port) => ({
        ...port,
        sourceId: output.id,
        connected: true,
    }))

    // connect output
    nextCanvas = updatePort(nextCanvas, output.id, (port) => ({
        ...port,
        connected: isPortConnected(nextCanvas, output.id),
    }))

    return nextCanvas
}

export function disconnectAllFromPort(canvas, portId) {
    if (!isPortConnected(canvas, portId)) { return canvas }
    const portIds = getConnectedPortIds(canvas, portId)
    return portIds.reduce((prevCanvas, connectedPortId) => (
        disconnectPorts(prevCanvas, portId, connectedPortId)
    ), canvas)
}

export function disconnectAllModulePorts(canvas, moduleHash) {
    const allPorts = getModulePorts(canvas, moduleHash)
    return Object.values(allPorts).reduce((prevCanvas, port) => (
        disconnectAllFromPort(canvas, port.id)
    ), canvas)
}

export function removeModule(canvas, moduleHash) {
    const nextCanvas = disconnectAllModulePorts(canvas, moduleHash)
    return {
        ...nextCanvas,
        modules: nextCanvas.modules.filter((m) => m.hash !== moduleHash),
    }
}

export function addModule(canvas, moduleData) {
    const module = { ...moduleData }
    module.hash = Date.now()
    module.layout = {
        position: {
            top: 0,
            left: 0,
        },
        width: '100px',
        height: '100px',
    }
    return {
        ...canvas,
        modules: canvas.modules.concat(module),
    }
}

export function setPortValue(canvas, portId, value) {
    if (String(getPort(canvas, portId).value).trim() === String(value).trim()) {
        // noop if no change
        return canvas
    }
    return updatePort(canvas, portId, (port) => {
        if (port.value === value) { return port }
        return {
            ...port,
            value,
        }
    })
}

export function setPortOptions(canvas, portId, options = {}) {
    const port = getPort(canvas, portId)
    if (Object.entries(options).every(([key, value]) => port[key] === value)) {
        // noop if no change
        return canvas
    }

    return updatePort(canvas, portId, (port) => ({
        ...port,
        ...options,
    }))
}

export function setModuleOptions(canvas, moduleHash, newOptions = {}) {
    const { modules } = getIndex(canvas)
    const modulePath = modules[moduleHash]
    return update(modulePath.concat('options'), (options = {}) => (
        Object.keys(newOptions).reduce((options, key) => (
            update([key].concat('value'), () => newOptions[key], options)
        ), options)
    ), canvas)
}
