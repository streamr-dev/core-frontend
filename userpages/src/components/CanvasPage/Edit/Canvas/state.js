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

export function getModuleForPort(canvas, portId) {
    return get(canvas, getPortModulePath(canvas, portId))
}

export function getPort(canvas, portId) {
    const { ports } = getIndex(canvas)
    return get(canvas, ports[portId])
}

export function getConnectedPortIds(canvas, portId) {
    const port = getPort(canvas, portId)
    if (!getIsOutput(canvas, portId)) {
        return [port.sourceId]
    }

    const { ports } = getIndex(canvas)
    return Object.keys(ports).filter((id) => {
        const { sourceId } = getPort(canvas, id)
        return sourceId === portId
    })
}

export function isPortConnected(canvas, portId) {
    const conn = getConnectedPortIds(canvas, portId)
    return !!conn.length
}

export function updatePort(canvas, portId, fn) {
    const { ports } = getIndex(canvas)
    return update(ports[portId], fn, canvas)
}

export function updateModulePosition(canvas, moduleId, diff) {
    const { modules } = getIndex(canvas)
    const modulePath = modules[moduleId]
    return update(modulePath.concat('layout', 'position'), (position) => ({
        ...position,
        top: `${Number.parseInt(position.top, 10) + diff.y}px`,
        left: `${Number.parseInt(position.left, 10) + diff.x}px`,
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
