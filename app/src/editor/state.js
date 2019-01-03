import update from 'lodash/fp/update'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import uuid from 'uuid'

export const RunStates = {
    Running: 'RUNNING',
    Stopped: 'STOPPED',
}

export const DragTypes = {
    Module: 'Module',
    Port: 'Port',
}

// these look like selectors for backwards compatibility with legacy UI
export const RunTabs = {
    realtime: '#tab-realtime',
    historical: '#tab-historical',
}

export const PortTypes = {
    input: 'input',
    output: 'output',
    param: 'param',
}

export function emptyCanvas() {
    return {
        name: 'Untitled Canvas',
        settings: {},
        modules: [],
    }
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
        const canvasModule = get(canvas, modulePath)
        // create port paths by appending
        // canvasModule path + inputs/outputs/params + port's index
        canvasModule.params.forEach((port, index) => {
            o[port.id] = modulePath.concat('params', index)
        })
        canvasModule.inputs.forEach((port, index) => {
            o[port.id] = modulePath.concat('inputs', index)
        })
        canvasModule.outputs.forEach((port, index) => {
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
        throw new Error(`bad canvas (${typeof canvas})`)
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
    return (item, ...args) => {
        const cached = cache.get(item)
        if (cached) { return cached }
        const result = fn(item, ...args)
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
 * True iff port is an output port
 */

function getIsOutput(canvas, portId) {
    const type = getPortType(canvas, portId)
    return type === PortTypes.output
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
    const canvasModule = getModule(canvas, moduleHash)
    const ports = {}
    canvasModule.params.forEach((port) => {
        ports[port.id] = getPort(canvas, port.id)
    })
    canvasModule.inputs.forEach((port) => {
        ports[port.id] = getPort(canvas, port.id)
    })
    canvasModule.outputs.forEach((port) => {
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

    const moduleA = getModuleForPort(canvas, portIdA)
    const moduleB = getModuleForPort(canvas, portIdB)
    // cannot connect module to self
    if (moduleA.hash === moduleB.hash) { return false }

    const [output, input] = getOutputInputPorts(canvas, portIdA, portIdB)

    if (!input.canConnect || !output.canConnect) { return false }

    // verify compatible types
    const inputTypes = new Set(input.acceptedTypes)
    // Object type can connect to anything
    if (output.type === 'Object' || inputTypes.has('Object')) { return true }
    return inputTypes.has(output.type)
}

function hasVariadicPort(canvas, moduleHash) {
    const canvasModule = getModule(canvas, moduleHash)
    return canvasModule.inputs.some(({ variadic }) => variadic)
}

function getVariadicPorts(canvas, moduleHash) {
    const canvasModule = getModule(canvas, moduleHash)
    return canvasModule.inputs.filter(({ variadic }) => variadic)
}

function findLastVariadicPort(canvas, moduleHash) {
    const variadics = getVariadicPorts(canvas, moduleHash)
    return variadics.find(({ variadic }) => (
        variadic.isLast
    )) || variadics[variadics.length - 1]
}

function findPreviousLastVariadicPort(canvas, moduleHash) {
    const variadics = getVariadicPorts(canvas, moduleHash)
    const last = findLastVariadicPort(canvas, moduleHash)
    const index = variadics.indexOf(last)
    return variadics[index - 1]
}

function addVariadic(canvas, moduleHash) {
    const port = findLastVariadicPort(canvas, moduleHash)

    // update current last port
    const nextCanvas = updatePort(canvas, port.id, (port) => ({
        ...port,
        variadic: {
            ...port.variadic,
            isLast: false,
            requiresConnection: true,
        },
    }))

    const index = port.variadic.index + 1
    const id = uuid.v4()
    const newPort = Object.assign(cloneDeep(port), {
        id,
        // reset port info
        longName: undefined,
        sourceId: undefined,
        name: `endpoint-${id}`,
        displayName: `in${index}`,
        requiresConnection: false,
        connected: false,
        export: false,
        variadic: {
            ...port.variadic,
            isLast: true,
            index,
        },
    })

    // append new last port
    return updateModule(nextCanvas, moduleHash, (canvasModule) => ({
        ...canvasModule,
        inputs: canvasModule.inputs.concat(newPort),
    }))
}

function removeVariadic(canvas, moduleHash) {
    const lastVariadicPort = findLastVariadicPort(canvas, moduleHash)
    const prevVariadicPort = findPreviousLastVariadicPort(canvas, moduleHash)
    // make second-last variadic port the last
    const nextCanvas = updatePort(canvas, prevVariadicPort.id, (port) => ({
        ...port,
        variadic: {
            ...port.variadic,
            isLast: true,
            requiresConnection: false,
        },
    }))

    // remove last variadic port
    return updateModule(nextCanvas, moduleHash, (canvasModule) => ({
        ...canvasModule,
        inputs: canvasModule.inputs.filter(({ id }) => id !== lastVariadicPort.id),
    }))
}

export function updateVariadicModule(canvas, moduleHash) {
    if (!hasVariadicPort(canvas, moduleHash)) {
        return canvas // ignore if no variadic ports
    }

    const lastVariadicPort = findLastVariadicPort(canvas, moduleHash)
    if (!lastVariadicPort) {
        throw new Error('no last variadic port') // should not happen
    }

    if (isPortConnected(canvas, lastVariadicPort.id)) {
        // add new port if last variadic port is connected
        return addVariadic(canvas, moduleHash)
    }

    const variadics = getVariadicPorts(canvas, moduleHash)
    const lastConnected = variadics.slice().reverse().find(({ id }) => (
        isPortConnected(canvas, id)
    ))

    // remove all variadics after last connected variadic + 1 placeholder
    const variadicsToRemove = variadics.slice(variadics.indexOf(lastConnected) + 2)
    if (variadicsToRemove.length) {
        // remove last variadic for each variadic that needs removing
        // TODO: remove all in one go
        let newCanvas = canvas
        variadicsToRemove.forEach(() => {
            newCanvas = removeVariadic(newCanvas, moduleHash)
        })
        return newCanvas
    }

    // otherwise ignore
    return canvas
}

export function updateVariadic(canvas) {
    return canvas.modules.reduce((nextCanvas, { hash }) => (
        updateVariadicModule(nextCanvas, hash)
    ), canvas)
}

export function disconnectPorts(canvas, portIdA, portIdB) {
    const [output, input] = getOutputInputPorts(canvas, portIdA, portIdB)
    if (input.sourceId !== output.id) {
        return canvas // not connected
    }

    // disconnect input
    const nextCanvas = updatePort(canvas, input.id, (port) => ({
        ...port,
        sourceId: null,
        connected: false,
    }))

    // disconnect output
    return updatePort(nextCanvas, output.id, (port) => ({
        ...port,
        connected: isPortConnected(nextCanvas, output.id),
    }))
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
    return updatePort(nextCanvas, output.id, (port) => ({
        ...port,
        connected: isPortConnected(nextCanvas, output.id),
    }))
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
        disconnectAllFromPort(prevCanvas, port.id)
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
    const canvasModule = { ...moduleData }
    canvasModule.hash = Date.now()
    canvasModule.layout = {
        position: {
            top: 0,
            left: 0,
        },
        width: '100px',
        height: '100px',
    }
    return {
        ...canvas,
        modules: canvas.modules.concat(canvasModule),
    }
}

/**
 * Sets initialValue for inputs
 * Sets value for output/params
 */

export function setPortUserValue(canvas, portId, value) {
    const portType = getPortType(canvas, portId)
    const key = {
        [PortTypes.input]: 'initialValue',
        [PortTypes.param]: 'value',
        [PortTypes.output]: 'value', // not really user-configurable but whatever
    }[portType]

    if (JSON.stringify(getPort(canvas, portId)[key]) === JSON.stringify(value)) {
        // noop if no change
        return canvas
    }

    return updatePort(canvas, portId, (port) => {
        if (port[key] === value) { return port }
        return {
            ...port,
            [key]: value,
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

export function updateCanvas(canvas, path, fn) {
    return updateVariadic(update(path, fn, canvas))
}

function moduleTreeIndex(modules = [], path = [], index = []) {
    modules.forEach((m) => {
        if (m.metadata.canAdd) {
            index.push({
                id: m.metadata.id,
                name: m.data,
                path: path.join(', '),
            })
        }
        if (m.children && m.children.length) {
            moduleTreeIndex(m.children, path.concat(m.data), index)
        }
    })
    return index
}

const getModuleTreeIndex = memoize(moduleTreeIndex)

export function moduleTreeSearch(moduleTree, search) {
    const moduleIndex = getModuleTreeIndex(moduleTree)
    search = search.trim().toLowerCase()
    if (!search) { return moduleIndex }
    const nameMatches = moduleIndex.filter((m) => (
        m.name.toLowerCase().includes(search)
    ))
    const found = new Set(nameMatches.map(({ id }) => id))
    const pathMatches = moduleIndex.filter((m) => (
        m.path.toLowerCase().includes(search) && !found.has(m.id)
    ))
    return nameMatches.concat(pathMatches)
}
