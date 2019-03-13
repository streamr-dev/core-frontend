import update from 'lodash/fp/update'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import uuid from 'uuid'

const MISSING_ENTITY = 'EDITOR/MISSING_ENTITY'

export class MissingEntityError extends Error {
    constructor(message, detail = {}, ...args) {
        super(message, ...args)
        Object.assign(this, detail)
        this.code = MISSING_ENTITY

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingEntityError)
        }

        Object.setPrototypeOf(this, MissingEntityError.prototype)
    }
}

function createError(message, detail, ...args) {
    const error = new Error(message, ...args)
    Object.assign(error, detail)
    return error
}

function validateModule(m, { moduleHash, canvas, ...detail }) {
    if (!m) {
        throw new MissingEntityError(`Module Missing: ${moduleHash}`, {
            canvas,
            moduleHash,
            ...detail,
        })
    }
    return m
}

function validatePort(p, { portId, canvas, ...detail }) {
    if (!p) {
        throw new MissingEntityError(`Port Missing: ${portId}`, {
            canvas,
            portId,
            ...detail,
        })
    }
    return p
}

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

const DEFAULT_MODULE_LAYOUT = {
    position: {
        top: 0,
        left: 0,
    },
    width: '250px',
    height: '150px',
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
 * True iff port is an output port
 */

function getIsOutput(canvas, portId) {
    const type = getPortType(canvas, portId)
    return type === PortTypes.output
}

export function getModule(canvas, moduleHash) {
    const { modules } = getIndex(canvas)
    const m = get(canvas, modules[moduleHash])
    validateModule(m, {
        canvas,
        moduleHash,
    })
    return m
}

export function hasPort(canvas, portId) {
    const { ports } = getIndex(canvas)
    return !!ports[portId]
}

export function getPort(canvas, portId) {
    const { ports } = getIndex(canvas)
    const port = get(canvas, ports[portId])
    validatePort(port, {
        canvas,
        portId,
    })
    return port
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
 * Parent module for port
 */

export function getModuleForPort(canvas, portId) {
    const m = get(canvas, getPortModulePath(canvas, portId))
    if (!m) {
        const port = getPort(canvas, portId) // will throw if no port

        // should not get here, has port but no module?
        throw createError(`Port exists but could not find module? PortId ${portId}`, {
            canvas,
            portId,
            port,
        })
    }

    return m
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

export function findModule(canvas, matchFn) {
    return canvas.modules.find(matchFn)
}

export function findModulePort(canvas, moduleHash, matchFn) {
    const ports = getModulePorts(canvas, moduleHash)
    return Object.values(ports).find(matchFn)
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

export function updateModulePosition(canvas, moduleHash, offset) {
    const { modules } = getIndex(canvas)
    const modulePath = modules[moduleHash]
    return update(modulePath.concat('layout', 'position'), (position) => ({
        ...position,
        top: `${Number.parseInt(offset.top, 10)}px`,
        left: `${Number.parseInt(offset.left, 10)}px`,
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
    if (portIdA === portIdB) { return false } // cannot connect port to self
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

export function arePortsOfSameModule(canvas, portIdA, portIdB) {
    const moduleA = getModuleForPort(canvas, portIdA)
    const moduleB = getModuleForPort(canvas, portIdB)
    if (!moduleA || !moduleB) { return false }
    return moduleA.hash === moduleB.hash
}

function hasVariadicPort(canvas, moduleHash, type) {
    if (!type) { throw new Error('type missing') }
    const canvasModule = getModule(canvas, moduleHash)
    return canvasModule[type].some(({ variadic }) => variadic)
}

function getVariadicPorts(canvas, moduleHash, type) {
    if (!type) { throw new Error('type missing') }
    const canvasModule = getModule(canvas, moduleHash)
    return canvasModule[type].filter(({ variadic }) => variadic)
}

function findLastVariadicPort(canvas, moduleHash, type) {
    if (!type) { throw new Error('type missing') }
    const variadics = getVariadicPorts(canvas, moduleHash, type)
    return variadics.find(({ variadic }) => (
        variadic.isLast
    )) || variadics[variadics.length - 1]
}

function findPreviousLastVariadicPort(canvas, moduleHash, type) {
    const variadics = getVariadicPorts(canvas, moduleHash, type)
    const last = findLastVariadicPort(canvas, moduleHash, type)
    const index = variadics.indexOf(last)
    return variadics[index - 1]
}

function addVariadic(canvas, moduleHash, type) {
    if (!type) { throw new Error('type missing') }
    const port = findLastVariadicPort(canvas, moduleHash, type)
    const canvasModule = getModule(canvas, moduleHash)
    if (canvasModule.moduleClosed) { return canvas } // do nothing if module closed
    if (type === 'outputs' && port.variadic.disableGrow) { return canvas } // do nothing if grow disabled

    // update current last port
    const nextCanvas = updatePort(canvas, port.id, (port) => ({
        ...port,
        variadic: Object.assign({
            ...port.variadic,
            isLast: false,
        }, type === 'inputs' ? { requiresConnection: false } : {}),
    }))

    const index = port.variadic.index + 1
    const id = uuid.v4()

    let resetMask = {
        id,
        // reset port info
        longName: undefined,
        sourceId: undefined,
        name: `endpoint-${id}`,
        connected: false,
        export: false,
        variadic: {
            ...port.variadic,
            isLast: true,
            index,
        },
    }

    if (type === 'inputs') {
        resetMask = {
            ...resetMask,
            sourceId: undefined,
            name: `endpoint-${id}`,
            displayName: `in${index}`,
            requiresConnection: false,
        }
    } else {
        resetMask = {
            ...resetMask,
            displayName: `out${index}`,
        }
    }

    const newPort = Object.assign(cloneDeep(port), resetMask)

    // append new last port
    return updateModule(nextCanvas, moduleHash, (canvasModule) => ({
        ...canvasModule,
        [type]: canvasModule[type].concat(newPort),
    }))
}

function removeVariadic(canvas, moduleHash, type) {
    if (!type) { throw new Error('type missing') }
    const lastVariadicPort = findLastVariadicPort(canvas, moduleHash, type)
    if (!lastVariadicPort) { return canvas }
    const prevVariadicPort = findPreviousLastVariadicPort(canvas, moduleHash, type)
    let nextCanvas = canvas
    if (prevVariadicPort) {
        // make second-last variadic port the last
        nextCanvas = updatePort(canvas, prevVariadicPort.id, (port) => ({
            ...port,
            variadic: Object.assign({
                ...port.variadic,
                isLast: true,
            }, type === 'inputs' ? { requiresConnection: false } : {}),
        }))
    }

    // remove last variadic port
    return updateModule(nextCanvas, moduleHash, (canvasModule) => ({
        ...canvasModule,
        [type]: canvasModule[type].filter(({ id }) => id !== lastVariadicPort.id),
    }))
}

function updateVariadicModuleForType(canvas, moduleHash, type) {
    if (!type) { throw new Error('type missing') }
    if (!hasVariadicPort(canvas, moduleHash, type)) {
        return canvas // ignore if no variadic ports
    }

    const canvasModule = getModule(canvas, moduleHash)
    if (canvasModule.moduleClosed) { return canvas } // do nothing if module closed

    const lastVariadicPort = findLastVariadicPort(canvas, moduleHash, type)
    if (!lastVariadicPort) {
        throw new Error('no last variadic port') // should not happen
    }

    if (isPortConnected(canvas, lastVariadicPort.id)) {
        // add new port if last variadic port is connected
        return addVariadic(canvas, moduleHash, type)
    }

    const variadics = getVariadicPorts(canvas, moduleHash, type)
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
            newCanvas = removeVariadic(newCanvas, moduleHash, type)
        })
        return newCanvas
    }

    // otherwise ignore
    return canvas
}

export function updateVariadicModule(canvas, moduleHash) {
    const newCanvas = updateVariadicModuleForType(canvas, moduleHash, 'inputs')
    return updateVariadicModuleForType(newCanvas, moduleHash, 'outputs')
}

export function updateVariadic(canvas) {
    return canvas.modules.reduce((nextCanvas, { hash }) => (
        updateVariadicModule(nextCanvas, hash)
    ), canvas)
}

export function disconnectPorts(canvas, portIdA, portIdB) {
    const [output, input] = getOutputInputPorts(canvas, portIdA, portIdB)
    let nextCanvas = canvas

    // disconnect input
    if (input) {
        nextCanvas = updatePort(canvas, input.id, (port) => ({
            ...port,
            sourceId: null,
            connected: false,
        }))
    }

    // disconnect output
    if (output) {
        nextCanvas = updatePort(nextCanvas, output.id, (port) => ({
            ...port,
            connected: isPortConnected(nextCanvas, output.id),
        }))
    }

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

export function updatePortConnection(canvas, portId) {
    const portIds = getConnectedPortIds(canvas, portId)

    return portIds.reduce((prevCanvas, connectedPortId) => {
        const connectedModule = getModuleForPort(prevCanvas, connectedPortId)

        if (!connectedModule) {
            return disconnectPorts(prevCanvas, portId, connectedPortId)
        }

        return prevCanvas
    }, canvas)
}

export function updateModulePortConnections(canvas, moduleHash) {
    const allPorts = getModulePorts(canvas, moduleHash)
    return Object.values(allPorts).reduce((prevCanvas, port) => (
        updatePortConnection(prevCanvas, port.id)
    ), canvas)
}

export function updatePortConnections(canvas) {
    return canvas.modules.reduce((nextCanvas, { hash }) => (
        updateModulePortConnections(nextCanvas, hash)
    ), canvas)
}

export function removeModule(canvas, moduleHash) {
    const nextCanvas = disconnectAllModulePorts(canvas, moduleHash)
    return {
        ...nextCanvas,
        modules: nextCanvas.modules.filter((m) => m.hash !== moduleHash),
    }
}

let ID = 0

function getHash(canvas, iterations = 0) {
    if (iterations >= 100) {
        // bail out if seriously can't find a hash
        throw new Error(`could not find unique hash after ${iterations} attempts`)
    }

    ID += 1
    const hash = Number((
        String(Date.now() + ID)
            .slice(-10) // 32 bits
            .split('')
            .reverse() // in order (for debugging)
            .join('')
    ))

    if (canvas.modules.find((m) => m.hash === hash)) {
        // double-check doesn't exist
        return getHash(canvas, iterations + 1)
    }

    return hash
}

/**
 * Create new module from data
 */

export function addModule(canvas, moduleData) {
    const canvasModule = {
        ...moduleData,
        hash: getHash(canvas), // TODO: better IDs
        layout: {
            ...DEFAULT_MODULE_LAYOUT, // TODO: read position from mouse
        },
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

/**
 * Update properties on port.
 */

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

/**
 * Convert object of key/value pairs to:
 * modules[moduleHash].options[key].value = value
 */

export function setModuleOptions(canvas, moduleHash, newOptions = {}) {
    const { modules } = getIndex(canvas)
    const modulePath = modules[moduleHash]
    return update(modulePath.concat('options'), (options = {}) => (
        Object.keys(newOptions).reduce((options, key) => (
            update([key].concat('value'), () => newOptions[key], options)
        ), options)
    ), canvas)
}

/**
 * Prevent module positions erroneously going out of bounds.
 */

export function limitLayout(canvas) {
    let nextCanvas = { ...canvas }
    nextCanvas.modules.forEach((m) => {
        const top = parseInt(m.layout.position.top, 10) || 0
        const left = parseInt(m.layout.position.left, 10) || 0
        if (!top || !left || top < 0 || left < 0) {
            nextCanvas = updateModulePosition(nextCanvas, m.hash, {
                top: Math.max(0, top),
                left: Math.max(0, left),
            })
        }
    })

    return nextCanvas
}

export function updateCanvas(canvas, path, fn) {
    return limitLayout(updateVariadic(updatePortConnections(update(path, fn, canvas))))
}

export function moduleTreeIndex(modules = [], path = [], index = []) {
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
