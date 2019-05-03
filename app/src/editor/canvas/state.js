/* eslint-disable no-use-before-define */
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

export function isHistoricalModeSelected(canvas) {
    const { settings = {} } = canvas
    const { editorState = {} } = settings
    return editorState.runTab === RunTabs.historical
}

export function emptyCanvas(config = {}) {
    return {
        name: 'Untitled Canvas',
        settings: {
            runTab: RunTabs.realtime,
            ...config.settings,
        },
        modules: [],
        state: RunStates.Stopped,
        ...config,
    }
}

export const defaultModuleLayout = {
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

export function getModuleIfExists(canvas, moduleHash) {
    const { modules } = getIndex(canvas)
    return get(canvas, modules[moduleHash])
}

export function getModule(canvas, moduleHash) {
    const m = getModuleIfExists(canvas, moduleHash)
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

export function getPortIfExists(canvas, portId) {
    const { ports } = getIndex(canvas)
    return get(canvas, ports[portId])
}

export function getPort(canvas, portId) {
    const port = getPortIfExists(canvas, portId)
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

export function findModules(canvas, matchFn) {
    return canvas.modules.filter(matchFn)
}

export function findModulePort(canvas, moduleHash, matchFn) {
    const ports = getModulePorts(canvas, moduleHash)
    return Object.values(ports).find(matchFn)
}

export function getAllPorts(canvas) {
    const { ports } = getIndex(canvas)
    return Object.keys(ports).map((id) => getPort(canvas, id))
}

export function getConnectedPortIds(canvas, portId) {
    const port = getPort(canvas, portId)
    if (!getIsOutput(canvas, portId)) {
        return [port.sourceId].filter(Boolean)
    }

    return getAllPorts(canvas).filter(({ sourceId }) => (
        sourceId === portId
    ))
        .filter(Boolean)
        .map(({ id }) => id)
}

export function isPortConnected(canvas, portId) {
    if (!hasPort(canvas, portId)) { return false }
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

export function updateModulePosition(canvas, moduleHash, newPosition) {
    const { modules } = getIndex(canvas)
    const modulePath = modules[moduleHash]
    return update(modulePath.concat('layout', 'position'), (position) => ({
        ...position,
        top: `${Number.parseInt(newPosition.top, 10)}px`,
        left: `${Number.parseInt(newPosition.left, 10)}px`,
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
    const ports = [getPortIfExists(canvas, portIdA), getPortIfExists(canvas, portIdB)]
    if (getIsOutput(canvas, portIdB) || !getIsOutput(canvas, portIdA)) {
        ports.reverse() // ensure output port is first
    }

    return ports
}

function getPortValueType(canvas, portId) {
    const port = getPort(canvas, portId)
    if (port.type !== 'Object') { return port.type }
    const isOutput = getIsOutput(canvas, portId)
    if (isOutput) {
        const linkedInput = findLinkedVariadicPort(canvas, portId)
        if (!linkedInput) { return port.type }
        if (!isPortConnected(canvas, linkedInput.id)) { return port.type }
        return getPortValueType(canvas, linkedInput.id)
    }
    const [connectedOutId] = getConnectedPortIds(canvas, portId)
    if (!connectedOutId) { return port.type }
    return getPortValueType(canvas, connectedOutId)
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
    const outputType = getPortValueType(canvas, output.id)
    // Object type can connect to anything
    if (outputType === 'Object' || inputTypes.has('Object')) { return true }
    return inputTypes.has(outputType)
}

export function arePortsOfSameModule(canvas, portIdA, portIdB) {
    const moduleA = getModuleForPort(canvas, portIdA)
    const moduleB = getModuleForPort(canvas, portIdB)
    if (!moduleA || !moduleB) { return false }
    return moduleA.hash === moduleB.hash
}

function disconnectInput(canvas, portId) {
    return updatePort(canvas, portId, (port) => {
        const newPort = {
            ...port,
            sourceId: null,
            connected: false,
        }

        // ethereum contract input
        if (newPort.type === 'EthereumContract' && newPort.value) {
            delete newPort.value
        }

        return newPort
    })
}

function disconnectOutput(canvas, portId) {
    return updatePort(canvas, portId, (port) => ({
        ...port,
        connected: isPortConnected(canvas, portId),
    }))
}

export function disconnectPorts(canvas, portIdA, portIdB) {
    const [output, input] = getOutputInputPorts(canvas, portIdA, portIdB)
    let nextCanvas = canvas

    // disconnect input
    if (input && getPortIfExists(nextCanvas, input.id)) {
        nextCanvas = disconnectInput(nextCanvas, input.id)
        if (getPortIfExists(nextCanvas, input.id)) {
            const m = getModuleForPort(nextCanvas, input.id)
            nextCanvas = updateVariadicModule(nextCanvas, m.hash)
        }
    }

    // disconnect output
    if (output && getPortIfExists(nextCanvas, output.id)) {
        nextCanvas = disconnectOutput(nextCanvas, output.id)
        if (getPortIfExists(nextCanvas, output.id)) {
            const m = getModuleForPort(nextCanvas, output.id)
            nextCanvas = updateVariadicModule(nextCanvas, m.hash)
        }
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

    const displayName = getDisplayNameFromPort(output)
    const outputModule = getModuleForPort(nextCanvas, output.id)
    const { contract } = outputModule || {}

    // connect input
    nextCanvas = updatePort(nextCanvas, input.id, (port) => {
        const newPort = {
            ...port,
            sourceId: output.id,
            connected: true,
            // variadic inputs copy display name from output
            displayName: port.variadic ? displayName : port.displayName,
        }

        // ethereum contract input
        if (newPort.type === 'EthereumContract') {
            newPort.value = contract
        }

        return newPort
    })

    // update paired output, if exists
    const linkedOutput = findLinkedVariadicPort(nextCanvas, input.id)
    if (linkedOutput) {
        nextCanvas = updatePort(nextCanvas, linkedOutput.id, (port) => ({
            ...port,
            displayName,
        }))
    }

    // connect output
    return updatePort(nextCanvas, output.id, (port) => ({
        ...port,
        connected: isPortConnected(nextCanvas, output.id),
    }))
}

export function movePortConnection(canvas, outputPortId, newInputId, { currentInputId }) {
    const nextCanvas = connectPorts(canvas, outputPortId, newInputId)
    // disconnect *after* connecting otherwise port being connected to may no longer exist
    return disconnectPorts(nextCanvas, outputPortId, currentInputId)
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
    if (!hasPort(canvas, portId)) { return canvas }
    const portIds = getConnectedPortIds(canvas, portId)

    return portIds.reduce((prevCanvas, connectedPortId) => {
        if (!hasPort(prevCanvas, connectedPortId)) {
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

// Hash is stored as a Java Integer.
const HASH_RANGE = ((2 ** 31) - 1) + (2 ** 31)

function getHash(canvas, iterations = 0) {
    if (iterations >= 100) {
        // bail out if seriously can't find a hash
        throw new Error(`could not find unique hash after ${iterations} attempts`)
    }

    const hash = Math.floor((Math.random() * HASH_RANGE) - (HASH_RANGE / 2))

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
    if (!moduleData || !moduleData.id) {
        throw createError(`trying to add bad module: ${moduleData}`, {
            canvas,
            moduleData,
        })
    }
    const canvasModule = {
        ...moduleData,
        hash: getHash(canvas), // TODO: better IDs
        layout: {
            ...defaultModuleLayout, // TODO: read position from mouse
            ...moduleData.layout,
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

/**
 * Variadic Port Handling
 */

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
    return variadics[variadics.length - 1]
}

function removeVariadicPort(canvas, portId) {
    const port = getPortIfExists(canvas, portId)
    if (!port) { return canvas }
    if (!port.variadic) {
        throw createError(`trying to remove non-variadic port: ${portId}`, {
            canvas,
            port,
        })
    }
    const m = getModuleForPort(canvas, portId)
    const type = `${getPortType(canvas, portId)}s`

    const newCanvas = disconnectAllFromPort(canvas, portId)
    // remove variadic port
    return updateModule(newCanvas, m.hash, (canvasModule) => ({
        ...canvasModule,
        [type]: canvasModule[type].filter(({ id }) => id !== port.id),
    }))
}

function removeAdditionalVariadics(canvas, moduleHash, type) {
    const variadics = getVariadicPorts(canvas, moduleHash, type)
    let variadicsToRemove = []
    if (type === 'outputs' && variadics[0].variadic.disableGrow) {
        // do nothing
    } else {
        const lastConnected = variadics.slice().reverse().find(({ id }) => (
            isPortConnected(canvas, id)
        ))

        // remove all variadics after last connected variadic + 1 placeholder
        variadicsToRemove = variadics.slice(variadics.indexOf(lastConnected) + 2)
    }

    let nextCanvas = canvas
    variadicsToRemove.forEach(({ id }) => {
        nextCanvas = removeVariadicPort(nextCanvas, id)
    })

    return nextCanvas
}

function getVariadicDisplayName(canvas, portId, portIndex) {
    // note portIndex starts at 1
    const port = getPort(canvas, portId)
    const type = getPortType(canvas, portId)
    let { displayName } = port
    // reset display names of disconnected ports
    if (!isPortConnected(canvas, port.id)) {
        if (type === 'input') {
            displayName = `in${portIndex}`
        } else {
            const linkedInput = findLinkedVariadicPort(canvas, port.id)
            // reset outputs with no linked input or only when linked input not connected
            if (!linkedInput || (linkedInput && !isPortConnected(canvas, linkedInput.id))) {
                displayName = `out${portIndex}`
            }
        }
    }
    return displayName
}

function getVariadicLongName(canvas, portId, portIndex) {
    // note portIndex starts at 1
    const type = getPortType(canvas, portId)
    const m = getModuleForPort(canvas, portId)
    if (type === 'input') {
        return `${m.name}.in${portIndex}`
    }

    return `${m.name}.out${portIndex}`
}

function updateVariadics(canvas, moduleHash, type) {
    let nextCanvas = removeAdditionalVariadics(canvas, moduleHash, type)
    const variadics = getVariadicPorts(nextCanvas, moduleHash, type)

    variadics.forEach(({ id }, index) => {
        nextCanvas = updatePort(nextCanvas, id, (port) => {
            const portIndex = variadics[0].variadic.index + index // variadic indexes start at 1
            return {
                ...port,
                displayName: getVariadicDisplayName(canvas, port.id, portIndex),
                longName: getVariadicLongName(canvas, port.id, portIndex),
                variadic: Object.assign({
                    ...port.variadic,
                    isLast: index === (variadics.length - 1),
                    index: portIndex,
                }, type === 'inputs' ? { requiresConnection: false } : {}),
            }
        })
    })
    return nextCanvas
}

function addVariadic(canvas, moduleHash, type, config = {}) {
    if (!type) { throw new Error('type missing') }
    const variadics = getVariadicPorts(canvas, moduleHash, type)
    const port = variadics[variadics.length - 1]
    const canvasModule = getModule(canvas, moduleHash)
    if (canvasModule.moduleClosed) { return canvas } // do nothing if module closed

    const id = uuid.v4()
    const index = variadics.length + 1

    let resetMask = {
        id,
        // reset port info
        longName: undefined,
        sourceId: undefined,
        name: `endpoint-${id}`,
        connected: false,
        export: false,
        variadic: {
            ...port.variadic, // index/isLast updated later
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
        if (port.variadic.linkedOutput) {
            resetMask.variadic.linkedOutput = `endpoint-${uuid.v4()}`
        }
    } else {
        resetMask = {
            ...resetMask,
            displayName: `out${index}`,
        }
    }

    const newPort = Object.assign(cloneDeep(port), resetMask, config)

    // append new port
    const newCanvas = updateModule(canvas, moduleHash, (canvasModule) => ({
        ...canvasModule,
        [type]: canvasModule[type].concat(newPort),
    }))

    return updateVariadics(newCanvas, moduleHash, type)
}

export function findLinkedVariadicPort(canvas, portId) {
    const port = getPort(canvas, portId)
    if (!port.variadic) { return }
    if (getIsOutput(canvas, portId)) {
        const m = getModuleForPort(canvas, portId)
        const variadicInputs = getVariadicPorts(canvas, m.hash, 'inputs')
        return variadicInputs.find((inputPort) => inputPort.variadic.linkedOutput === port.name)
    }

    if (!port.variadic.linkedOutput) { return }
    const m = getModuleForPort(canvas, portId)
    const variadicOutputs = getVariadicPorts(canvas, m.hash, 'outputs')
    return variadicOutputs.find((outputPort) => outputPort.name === port.variadic.linkedOutput)
}

function handleVariadicPairs(canvas, moduleHash) {
    if (!hasVariadicPort(canvas, moduleHash, 'inputs') && !hasVariadicPort(canvas, moduleHash, 'outputs')) {
        return canvas // ignore if no variadic ports
    }

    let newCanvas = canvas

    const variadicInputs = getVariadicPorts(newCanvas, moduleHash, 'inputs')
    const pairedVariadicInputs = variadicInputs.filter((p) => p.variadic.linkedOutput)
    pairedVariadicInputs.forEach((inputPort) => {
        let linkedOutputPort = findLinkedVariadicPort(newCanvas, inputPort.id)
        // if output does not exist, it should
        if (!linkedOutputPort) {
            newCanvas = addVariadic(newCanvas, moduleHash, 'outputs', {
                name: inputPort.variadic.linkedOutput,
            })
            linkedOutputPort = findLinkedVariadicPort(newCanvas, inputPort.id)
        }
        // if input is not connected, neither should the output
        if (!isPortConnected(newCanvas, inputPort.id)) {
            newCanvas = disconnectAllFromPort(newCanvas, linkedOutputPort.id)
        }
    })

    const variadicOutputs = getVariadicPorts(newCanvas, moduleHash, 'outputs')
    const pairedVariadicOutputs = variadicOutputs.filter((p) => p.variadic.disableGrow)
    // collect set of linked outputs from inputs
    const validLinkedOutputs = new Set(pairedVariadicInputs.map((p) => p.variadic.linkedOutput))
    // remove any outputs that don't have a corresponding input
    const variadicsToRemove = pairedVariadicOutputs.filter((p) => !validLinkedOutputs.has(p.name))
    variadicsToRemove.forEach(({ id }) => {
        newCanvas = removeVariadicPort(newCanvas, id)
    })

    return newCanvas
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

    // otherwise ignore
    return updateVariadics(canvas, moduleHash, type)
}

function getDisplayNameFromPort(port) {
    return port.displayName || port.name
}

export function updateVariadicModule(canvas, moduleHash) {
    let newCanvas = canvas
    newCanvas = updateVariadicModuleForType(newCanvas, moduleHash, 'inputs')
    newCanvas = handleVariadicPairs(newCanvas, moduleHash)
    newCanvas = updateVariadicModuleForType(newCanvas, moduleHash, 'outputs')
    return newCanvas
}

export function updateVariadic(canvas) {
    return canvas.modules.reduce((nextCanvas, { hash }) => (
        updateVariadicModule(nextCanvas, hash)
    ), canvas)
}

export function isRunning(canvas) {
    return canvas.state === RunStates.Running
}

export function getChildCanvasId(canvas) {
    return canvas.settings.childCanvasId
}

export function getParentCanvasId(canvas) {
    return canvas.settings.parentCanvasId
}

/**
 * Gets parent id, or own if no parent
 */

export function getRootCanvasId(canvas) {
    return getParentCanvasId(canvas) || canvas.id
}

/**
 * Gets child id, or own if no child
 */

export function getRelevantCanvasId(canvas) {
    return getChildCanvasId(canvas) || canvas.id
}

/**
 * Cleanup
 */

export function updateCanvas(canvas, path, fn) {
    return limitLayout(updateVariadic(updatePortConnections(update(path, fn, canvas))))
}

export function moduleCategoriesIndex(modules = [], path = [], index = []) {
    modules.forEach((m) => {
        if (m.metadata.canAdd) {
            index.push({
                id: m.metadata.id,
                name: m.data,
                path: path.join(': '),
            })
        }
        if (m.children && m.children.length) {
            moduleCategoriesIndex(m.children, path.concat(m.data), index)
        }
    })
    return index
}

const getModuleCategoriesIndex = memoize(moduleCategoriesIndex)

export function moduleSearch(moduleCategories, search) {
    const moduleIndex = getModuleCategoriesIndex(moduleCategories)
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
