/* eslint-disable no-use-before-define */
import update from 'lodash/fp/update'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import uniqBy from 'lodash/uniqBy'
import uuid from 'uuid'
import * as diff from './diff'

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
            ...config.settings,
            editorState: {
                runTab: RunTabs.realtime,
                ...(config.settings || {}).editorState,
            },
        },
        modules: [],
        state: RunStates.Stopped,
        ...config,
    }
}

export const defaultModuleLayout = {
    position: {
        top: '0px',
        left: '0px',
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

/**
 * super simple memoize. First argument is key.
 * (i.e. won't work if multiple arguments used)
 */
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

function getModulePath(canvas, moduleHash) {
    const { modules } = getIndex(canvas)
    return modules[moduleHash]
}

function validateModuleExists(canvas, moduleHash) {
    const m = getModuleIfExists(canvas, moduleHash)
    return validateModule(m, {
        canvas,
        moduleHash,
    })
}

export function getModuleIfExists(canvas, moduleHash) {
    return get(canvas, getModulePath(canvas, moduleHash))
}

export function hasModule(canvas, moduleHash) {
    return !!getModuleIfExists(canvas, moduleHash)
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

export function getModulePortsMap(canvas, moduleHash) {
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

export function getModulePorts(canvas, moduleHash) {
    return Object.values(getModulePortsMap(canvas, moduleHash))
}

export function getModulePortIds(canvas, moduleHash) {
    return Object.keys(getModulePortsMap(canvas, moduleHash))
}

export function findModule(canvas, matchFn) {
    return canvas.modules.find(matchFn)
}

export function findModules(canvas, matchFn) {
    return canvas.modules.filter(matchFn)
}

export function findModulePort(canvas, moduleHash, matchFn) {
    const ports = getModulePorts(canvas, moduleHash)
    return ports.find(matchFn)
}

export function getAllPorts(canvas) {
    const { ports } = getIndex(canvas)
    return Object.keys(ports).map((id) => getPort(canvas, id))
}

export function getConnectedPortIds(canvas, portId) {
    const port = getPort(canvas, portId)
    // handle input port
    if (!getIsOutput(canvas, portId)) {
        if (!hasPort(canvas, port.sourceId)) {
            // do not list if source port does not exist
            return []
        }
        return [port.sourceId]
    }

    // handle output port
    return getAllPorts(canvas).filter(({ sourceId }) => (
        sourceId === portId
    ))
        .filter(Boolean)
        .map(({ id }) => id)
}

export function moduleHasPort(canvas, moduleHash, portId) {
    if (!hasPort(canvas, portId)) { return false }
    const m = getModuleForPort(canvas, portId)
    return m.hash === moduleHash
}

export function isConnectedToModule(canvas, moduleHash, portIdA, portIdB) {
    if (moduleHash == null || !getModuleIfExists(canvas, moduleHash)) {
        return false
    }
    return (
        (moduleHasPort(canvas, moduleHash, portIdA) || moduleHasPort(canvas, moduleHash, portIdB)) &&
        arePortsConnected(canvas, portIdA, portIdB)
    )
}

export function moduleHasConnections(canvas, moduleHash) {
    const portIds = getModulePortIds(canvas, moduleHash)
    return portIds.some((id) => (
        isPortConnected(canvas, id)
    ))
}

export function isPortConnected(canvas, portId) {
    if (!hasPort(canvas, portId)) { return false }
    const conn = getConnectedPortIds(canvas, portId)
    return !!conn.length
}

export function arePortsConnected(canvas, portIdA, portIdB) {
    if (!hasPort(canvas, portIdA) || !hasPort(canvas, portIdB)) { return false }
    const connA = getConnectedPortIds(canvas, portIdA)
    const connB = getConnectedPortIds(canvas, portIdB)
    return connA.includes(portIdB) && connB.includes(portIdA)
}

export function isPortExported(canvas, portId) {
    if (!hasPort(canvas, portId)) { return false }
    return !!getPort(canvas, portId).export
}

export function updatePort(canvas, portId, fn) {
    const { ports } = getIndex(canvas)
    return update(ports[portId], fn, canvas)
}

export function updateModule(canvas, moduleHash, fn) {
    validateModuleExists(canvas, moduleHash)
    const modulePath = getModulePath(canvas, moduleHash)
    return update(modulePath, fn, canvas)
}

export function updateModulePosition(canvas, moduleHash, newPosition) {
    validateModuleExists(canvas, moduleHash)
    const modulePath = getModulePath(canvas, moduleHash)
    return update(modulePath.concat('layout', 'position'), (position) => ({
        ...position,
        top: `${Number.parseInt(newPosition.top, 10)}px`,
        left: `${Number.parseInt(newPosition.left, 10)}px`,
    }), canvas)
}

export function updateModuleSize(canvas, moduleHash, size) {
    validateModuleExists(canvas, moduleHash)
    const modulePath = getModulePath(canvas, moduleHash)
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

function toPortPairKey(canvas, portIdA, portIdB) {
    const [output, input] = getOutputInputPorts(canvas, portIdA, portIdB)
    return `${output && output.id}#${input && input.id}`
}

function fromPortPairKey(pairKey) {
    return pairKey.split('#').map((s) => (s !== 'undefined' ? s : undefined))
}

function findDependentConnections(canvas, portId, seen = new Set(), results = new Set()) {
    if (seen.has(portId)) { return }
    seen.add(portId)
    const connectedPortIds = getConnectedPortIds(canvas, portId)
    connectedPortIds.forEach((connectedId) => {
        results.add(toPortPairKey(canvas, portId, connectedId))
        findDependentConnections(canvas, portId, seen, results)
    })
    const linkedPort = findLinkedVariadicPort(canvas, portId)
    if (linkedPort) {
        findDependentConnections(canvas, linkedPort.id, seen, results)
    }
    return [...results].map((pairKey) => fromPortPairKey(pairKey))
}

function getPortValueType(canvas, portId, seen = new Map()) {
    if (seen.has(portId)) { return seen.get(portId) }

    const port = getPort(canvas, portId)
    seen.set(portId, port.type)
    if (port.type !== 'Object') {
        return port.type
    }

    const isOutput = getIsOutput(canvas, portId)
    if (isOutput) {
        const linkedInput = findLinkedVariadicPort(canvas, portId)
        if (!linkedInput || !isPortConnected(canvas, linkedInput.id)) {
            seen.set(portId, port.type)
            return port.type
        }
        const type = getPortValueType(canvas, linkedInput.id, seen)
        seen.set(portId, type)
        return type
    }
    const [connectedOutId] = getConnectedPortIds(canvas, portId)
    if (!connectedOutId) {
        seen.set(portId, port.type)
        return port.type
    }

    const type = getPortValueType(canvas, connectedOutId, seen)
    seen.set(portId, type)
    return type
}

export function isPortInvisible(canvas, portId) {
    return linkedOutputConnectionsDisabled(canvas, portId)
}

export function isPortRenameDisabled(canvas, portId) {
    if (isRunning(canvas)) { return true }
    if (!isVariadicPort(getPort(canvas, portId))) { return false }

    if (getIsOutput(canvas, portId)) {
        const linkedPort = findLinkedVariadicPort(canvas, portId)
        return !!linkedPort && !isPortUsed(canvas, linkedPort.id)
    }

    return !isPortUsed(canvas, portId)
}

export function linkedOutputConnectionsDisabled(canvas, outputPortId) {
    if (!getIsOutput(canvas, outputPortId)) { return false }
    const outputPort = getPort(canvas, outputPortId)
    if (!isVariadicPort(outputPort)) { return false }
    const inputPort = findLinkedVariadicPort(canvas, outputPortId)
    if (!inputPort) { return false }
    // if input is not connected, neither should the output
    // can't know if input is connected for exported ports, so ignore this check when input is exported
    return !isPortUsed(canvas, inputPort.id)
}

export function canConnectPorts(canvas, portIdA, portIdB) {
    if (portIdA === portIdB) { return false } // cannot connect port to self
    if (!hasPort(canvas, portIdA) || !hasPort(canvas, portIdB)) {
        return false // cannot connect non-existent ports
    }
    if (getIsOutput(canvas, portIdA) === getIsOutput(canvas, portIdB)) {
        // if both inputs or both outputs, cannot connect
        return false
    }

    const [output, input] = getOutputInputPorts(canvas, portIdA, portIdB)

    if (!input.canConnect || !output.canConnect) { return false }
    if (linkedOutputConnectionsDisabled(canvas, output.id)) { return false }

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
            connected: false,
        }

        delete newPort.sourceId
        if ('defaultValue' in newPort) {
            newPort.value = newPort.defaultValue
            newPort.defaultValue = undefined
        }

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
    if (!arePortsConnected(canvas, portIdA, portIdB)) {
        return canvas // nothing to do if not connected
    }
    const [, input] = getOutputInputPorts(canvas, portIdA, portIdB)
    let nextCanvas = canvas

    if (input && getPortIfExists(nextCanvas, input.id)) {
        // walk graph, find all connections dependent on input and remove them
        const dependentConnections = findDependentConnections(nextCanvas, input.id)
        dependentConnections.forEach(([outputPortId, inputPortId]) => {
            if (inputPortId != null) {
                nextCanvas = disconnectInput(nextCanvas, inputPortId)
            }
            if (outputPortId != null) {
                nextCanvas = disconnectOutput(nextCanvas, outputPortId)
            }
        })
    }

    return nextCanvas
}

export function connectPorts(canvas, portIdA, portIdB) {
    if (!canConnectPorts(canvas, portIdA, portIdB)) {
        throw new Error(`cannot connect ${portIdA}, ${portIdB}`)
    }

    const [output, input] = getOutputInputPorts(canvas, portIdA, portIdB)

    let nextCanvas = canvas

    const displayName = getDisplayNameFromPort(output)
    const outputModule = getModuleForPort(nextCanvas, output.id)
    const { contract } = outputModule || {}

    // connect input
    nextCanvas = updatePort(nextCanvas, input.id, (port) => {
        const newPort = {
            ...port,
            sourceId: output.id,
            connected: true,
        }

        // variadic inputs copy display name from output
        const portDisplayName = port.variadic ? displayName : port.displayName
        if (portDisplayName) {
            newPort.displayName = portDisplayName
        } else {
            delete newPort.displayName
        }

        // ethereum contract input
        if (newPort.type === 'EthereumContract') {
            newPort.value = contract
        } else if ('defaultValue' in newPort && !isPortUsed(canvas, input.id)) {
            // copy value to defaultValue on new connection
            newPort.defaultValue = newPort.value
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
    nextCanvas = updatePort(nextCanvas, output.id, (port) => ({
        ...port,
        connected: isPortConnected(nextCanvas, output.id),
    }))

    return nextCanvas
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
    const modulePortIds = getModulePortIds(canvas, moduleHash)
    return modulePortIds.reduce((prevCanvas, portId) => (
        disconnectAllFromPort(prevCanvas, portId)
    ), canvas)
}

export function updatePortConnection(canvas, portId) {
    if (!hasPort(canvas, portId)) { return canvas }
    const portIds = getConnectedPortIds(canvas, portId)

    const nextCanvas = portIds.reduce((prevCanvas, connectedPortId) => {
        // disconnect ports that can't be connected
        if (!canConnectPorts(prevCanvas, portId, connectedPortId)) {
            return disconnectPorts(prevCanvas, portId, connectedPortId)
        }
        return prevCanvas
    }, canvas)

    const connected = isPortConnected(nextCanvas, portId)
    if (connected === getPort(nextCanvas, portId).connected) { return nextCanvas }
    return updatePort(nextCanvas, portId, (port) => ({
        ...port,
        connected,
    }))
}

export function updateModulePortConnections(canvas, moduleHash) {
    const modulePortIds = getModulePortIds(canvas, moduleHash)
    return modulePortIds.reduce((prevCanvas, portId) => (
        updatePortConnection(prevCanvas, portId)
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

const PORT_USER_VALUE_KEYS = {
    [PortTypes.input]: 'initialValue',
    [PortTypes.param]: 'value',
    [PortTypes.output]: 'value', // not really user-configurable but whatever
}

export function isPortBoolean(canvas, portId) {
    const port = getPort(canvas, portId)
    return (
        port.type.split(' ').includes('Boolean') ||
        typeof port.value === 'boolean' ||
        typeof port.initialValue === 'boolean' ||
        typeof port.defaultValue === 'boolean'
    )
}

export function isPortNumeric(canvas, portId) {
    const port = getPort(canvas, portId)
    return (
        port.type.split(' ').includes('Double') ||
        typeof port.value === 'number' ||
        typeof port.initialValue === 'number' ||
        typeof port.defaultValue === 'number'
    )
}

/**
 * Sets initialValue for inputs
 * Sets value for output/params
 */

export function setPortUserValue(canvas, portId, value) {
    const key = PORT_USER_VALUE_KEYS[getPortType(canvas, portId)]

    const port = getPort(canvas, portId)

    const defaultValue = getPortDefaultValue(canvas, portId)
    if (isBlank(value) && defaultValue != null) {
        value = defaultValue
    }

    // coerce string to boolean
    if (isPortBoolean(canvas, portId)) {
        value = !!value && value !== 'false'
    }

    // coerce double to number if invalid
    if (isPortNumeric(canvas, portId)) {
        if (isBlank(value)) {
            value = undefined
        } else {
            // swap , for .
            value = String(value).replace(/,/gm, '.')
            const num = Number.parseFloat(value)
            // infinite/NaN = undefined
            if (Number.isNaN(num) || !Number.isFinite(num)) {
                value = defaultValue
            } else {
                value = num
            }
        }
    }

    if (JSON.stringify(port[key]) === JSON.stringify(value)) {
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

export function isPortValueEditDisabled(canvas, portId) {
    if (isRunning(canvas)) { return true }
    const portType = getPortType(canvas, portId)
    const port = getPort(canvas, portId)
    if (portType === 'output') { return true }
    if (portType === 'input' && port.canHaveInitialValue) {
        // inputs can be edited as long as canHaveInitialValue
        return false
    }
    if (portType === 'param') {
        // disable param edits when port connected
        return isPortUsed(canvas, portId)
    }
    return false
}

export function getPortPlaceholder(canvas, portId) {
    if (isPortConnected(canvas, portId)) {
        const [connectedId] = getConnectedPortIds(canvas, portId)
        const connectedPort = getPort(canvas, connectedId)
        return connectedPort.longName || connectedPort.displayName || connectedPort.name
    }

    const port = getPort(canvas, portId)
    return getDisplayNameFromPort(port)
}

export function getPortValue(canvas, portId) {
    const port = getPort(canvas, portId)
    const portType = getPortType(canvas, portId)
    if (portType === 'output') {
        return port.value
    }

    if (portType === 'input' && port.canHaveInitialValue) {
        return port.initialValue
    }

    if (isPortConnected(canvas, portId)) {
        return undefined
    }
    if (isPortExported(canvas, portId)) {
        return port.value
    }

    return getPortUserValueOrDefault(canvas, portId)
}

export function getPortUserValue(canvas, portId) {
    const key = PORT_USER_VALUE_KEYS[getPortType(canvas, portId)]
    const port = getPort(canvas, portId)
    return port[key]
}

function isBlank(value) {
    return value == null || (!Array.isArray(value) && String(value).trim() === '')
}

export function getPortDefaultValue(canvas, portId) {
    const port = getPort(canvas, portId)
    return port.defaultValue
}

export function getPortUserValueOrDefault(canvas, portId) {
    const value = getPortUserValue(canvas, portId)
    return !isBlank(value) ? value : getPortDefaultValue(canvas, portId)
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
    validateModuleExists(canvas, moduleHash)
    const modulePath = getModulePath(canvas, moduleHash)
    return update(modulePath.concat('options'), (options = {}) => (
        Object.keys(newOptions).reduce((options, key) => {
            if (get(options, [key].concat('value')) === newOptions[key]) {
                return options
            }
            return update([key].concat('value'), () => newOptions[key], options)
        }, options)
    ), canvas)
}

/**
 * Prevent module positions erroneously going out of bounds.
 */

export function limitLayout(canvas) {
    let nextCanvas = { ...canvas }
    nextCanvas.modules.forEach(({ layout, hash }) => {
        const top = (layout && parseInt(layout.position.top, 10)) || 0
        const left = (layout && parseInt(layout.position.left, 10)) || 0
        if (!top || !left || top < 0 || left < 0) {
            nextCanvas = updateModulePosition(nextCanvas, hash, {
                top: Math.max(0, top),
                left: Math.max(0, left),
            })
        }
    })

    return nextCanvas
}

/**
 * Ensures historical 'beginDate' is before 'endDate'
 */

export function setHistoricalRange(canvas, update = {}) {
    const { settings = {} } = canvas
    let { beginDate, endDate } = settings
    if (update.beginDate) {
        beginDate = update.beginDate // eslint-disable-line prefer-destructuring
        if (endDate && Date.parse(update.beginDate) > Date.parse(endDate)) {
            endDate = beginDate
        }
    }

    if (update.endDate) {
        endDate = update.endDate // eslint-disable-line prefer-destructuring
        if (beginDate && Date.parse(beginDate) > Date.parse(update.endDate)) {
            beginDate = endDate
        }
    }

    return updateCanvas({
        ...canvas,
        settings: {
            ...canvas.settings,
            beginDate: beginDate ? new Date(beginDate).toISOString() : canvas.settings.beginDate,
            endDate: endDate ? new Date(endDate).toISOString() : canvas.settings.endDate,
        },
    })
}

export function isHistoricalRunValid(canvas = {}) {
    const { settings = {} } = canvas
    const { beginDate, endDate } = settings
    return !!(beginDate && endDate && Date.parse(beginDate) <= Date.parse(endDate))
}

/**
 * True if port is currently being used for something e.g. is connected or exported
 * Unused variadic ports are candidates for removal.
 */

function isPortUsed(canvas, portId) {
    return isPortConnected(canvas, portId) || isPortExported(canvas, portId)
}

/**
 * Variadic Port Handling
 */

function isVariadicPort(port = {}) {
    return !!port.variadic
}

function hasVariadicPort(canvas, moduleHash, type) {
    if (!type) { throw new Error('type missing') }
    const canvasModule = getModule(canvas, moduleHash)
    if (isSubCanvasModule(canvasModule)) { return false } // no variadic behaviour for subcanvas
    return canvasModule[type].some(isVariadicPort)
}

function getVariadicPorts(canvas, moduleHash, type) {
    if (!hasVariadicPort(canvas, moduleHash, type)) { return [] }
    if (!type) { throw new Error('type missing') }
    const canvasModule = getModule(canvas, moduleHash)
    return canvasModule[type].filter(isVariadicPort)
}

function findLastVariadicPort(canvas, moduleHash, type) {
    if (!type) { throw new Error('type missing') }
    const variadics = getVariadicPorts(canvas, moduleHash, type)
    return variadics[variadics.length - 1]
}

function removeVariadicPort(canvas, portId) {
    const port = getPortIfExists(canvas, portId)
    if (!port) { return canvas }
    if (!isVariadicPort(port)) {
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
        const lastUsed = variadics.slice().reverse().find(({ id }) => (
            isPortUsed(canvas, id)
        ))

        // remove all variadics after last used variadic + 1 placeholder
        variadicsToRemove = variadics.slice(variadics.indexOf(lastUsed) + 2)
    }

    let nextCanvas = canvas
    variadicsToRemove.forEach(({ id }) => {
        nextCanvas = removeVariadicPort(nextCanvas, id)
    })

    return nextCanvas
}

function generateVariadicDisplayName(canvas, portId, portIndex) {
    // note portIndex starts at 1
    const type = getPortType(canvas, portId)
    if (type === 'input') {
        return `in${portIndex}`
    }
    return `out${portIndex}`
}

function getVariadicDisplayName(canvas, portId, portIndex) {
    const { displayName } = getPort(canvas, portId)
    // reset display names of unused ports
    if (!isPortUsed(canvas, portId)) {
        const linkedInput = findLinkedVariadicPort(canvas, portId)
        // reset outputs with no linked input or only when linked input not connected
        if (!linkedInput || (linkedInput && !isPortUsed(canvas, linkedInput.id))) {
            return generateVariadicDisplayName(canvas, portId, portIndex)
        }
    }
    return displayName
}

function getVariadicLongName(canvas, portId, portIndex) {
    // note portIndex starts at 1
    const m = getModuleForPort(canvas, portId)

    const port = getPort(canvas, portId)
    if (!isPortConnected(canvas, port.id)) {
        return `${m.name}.${generateVariadicDisplayName(canvas, portId, portIndex)}`
    }

    const sourcePort = getPort(canvas, portId)
    return `${m.name}.${getDisplayNameFromPort(sourcePort)}`
}

function updateVariadics(canvas, moduleHash, type) {
    let nextCanvas = removeAdditionalVariadics(canvas, moduleHash, type)
    const variadics = getVariadicPorts(nextCanvas, moduleHash, type)

    variadics.forEach(({ id }, index) => {
        nextCanvas = updatePort(nextCanvas, id, (port) => {
            const portIndex = variadics[0].variadic.index + index // variadic indexes start at 1
            const isLast = index === (variadics.length - 1)
            return Object.assign({
                ...port,
                displayName: getVariadicDisplayName(canvas, port.id, portIndex),
                longName: getVariadicLongName(canvas, port.id, portIndex),
                variadic: {
                    ...port.variadic,
                    isLast,
                    index: portIndex,
                },
            }, type === 'inputs' ? {
                requiresConnection: !isLast,
            } : {})
        })
    })
    return nextCanvas
}

function isSubCanvasModule(moduleData) {
    return moduleData.jsModule === 'CanvasModule'
}

function addVariadic(canvas, moduleHash, type, config = {}) {
    if (!type) { throw new Error('type missing') }
    const variadics = getVariadicPorts(canvas, moduleHash, type)
    const canvasModule = getModule(canvas, moduleHash)
    if (canvasModule.moduleClosed) { return canvas } // do nothing if module closed

    const id = uuid.v4()

    const port = variadics[variadics.length - 1] // previous variadic (may be none)
    const index = variadics.length + 1

    let resetMask = {
        id,
        // reset port info
        longName: undefined,
        sourceId: null,
        name: `endpoint-${id}`,
        connected: false,
        export: false,
        // index/isLast updated later
        variadic: port ? Object.assign({}, port.variadic) : { disableGrow: true },
    }

    if (type === 'inputs') {
        resetMask = {
            ...resetMask,
            sourceId: null,
            name: `endpoint-${id}`,
            displayName: `in${index}`,
            requiresConnection: port ? !!port.requiresConnection : false,
        }
        // linkedOutput name is same as input name
        if (resetMask.variadic.linkedOutput) {
            resetMask.variadic.linkedOutput = resetMask.name
        }
    } else {
        resetMask = {
            ...resetMask,
            displayName: `out${index}`,
        }
    }

    const newPort = Object.assign(port ? cloneDeep(port) : {}, resetMask, config)

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

        // disconnect output if input is not connected or not exported
        if (linkedOutputConnectionsDisabled(newCanvas, linkedOutputPort.id)) {
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

    if (isPortUsed(canvas, lastVariadicPort.id)) {
        // add new port if last variadic port is connected or exported
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
 * Fixes erroneous initialValue of {} back to null.
 * See https://streamr.atlassian.net/browse/CORE-1718
 */

export function workaroundInitialValueWeirdness(canvas) {
    let nextCanvas = canvas
    canvas.modules.forEach((canvasModule) => {
        canvasModule.inputs.forEach((port) => {
            if (port.initialValue !== null && typeof port.initialValue === 'object') {
                nextCanvas = setPortUserValue(nextCanvas, port.id, null)
            }
        })
    })
    return nextCanvas
}

/**
 * Cleanup
 */

export function updateCanvas(canvas, path, fn) {
    if (!canvas || typeof canvas !== 'object') {
        throw new Error(`bad canvas (${typeof canvas})`)
    }

    if (fn && path) { // path & fn optional
        // if we call update without a path + fn
        // so let's skip update call altogether
        canvas = update(path, fn, canvas)
    }
    return limitLayout(updateVariadic(updatePortConnections(workaroundInitialValueWeirdness(canvas))))
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
    return index.sort(compareModules)
}

// sorts module index. Sorts first by path and then by name.
function compareModules(a, b) {
    if (a.path === b.path) {
        return a.name.localeCompare(b.name)
    }
    return a.path ? a.path.localeCompare(b.path) : 0
}

const getModuleCategoriesIndex = memoize(moduleCategoriesIndex)

export function moduleSearch(moduleCategories, search) {
    const moduleIndex = getModuleCategoriesIndex(moduleCategories)
    search = search.trim().toLowerCase()
    if (!search) { return moduleIndex }

    const terms = search.split(/\s+/)
    const exactMatches = moduleIndex.filter((m) => {
        const target = m.name.toLowerCase()
        return target.split(/\s+/).join(' ') === terms.join(' ')
    })

    const startsWith = moduleIndex.filter((m) => {
        const target = m.name.toLowerCase()
        return target.split(/\s+/).join(' ').startsWith(terms.join(' '))
    })

    const nameMatches = moduleIndex.filter((m) => {
        const target = m.name.toLowerCase()
        return terms.every((searchTerm) => (
            target.includes(searchTerm)
        ))
    })

    const pathMatches = moduleIndex.filter((m) => {
        const target = m.path.toLowerCase()
        return terms.every((searchTerm) => (
            target.includes(searchTerm)
        ))
    })

    return uniqBy([...exactMatches, ...startsWith, ...nameMatches, ...pathMatches], 'id')
}

/**
 * Tries to find a port from one canvas in another canvas.
 * If failing to match by id, it will match against all of
 * - the module
 * - the port name and
 * - the port type
 */

function matchPortInPreviousCanvas(canvas, prevCanvas, portId) {
    const prevPort = getPort(prevCanvas, portId)
    const exactMatch = getPortIfExists(canvas, portId)
    if (exactMatch) { return exactMatch }
    const prevPortType = getPortType(prevCanvas, portId)
    const prevModule = getModuleForPort(prevCanvas, portId)
    const nextModule = getModuleIfExists(canvas, prevModule.hash)
    if (!nextModule) { return }
    return findModulePort(canvas, nextModule.hash, (p) => {
        if (p.name === prevPort.name) {
            return getPortType(canvas, p.id) === prevPortType
        }
    })
}

/**
 *  Replaces module definition. Tries to maintain module connections.
 */

export function replaceModule(canvas, moduleData) {
    const { hash } = moduleData
    const prevCanvas = canvas
    let nextCanvas = updateModule(prevCanvas, hash, () => moduleData)

    const prevPortIds = getModulePortIds(prevCanvas, hash)
    prevPortIds.forEach((prevPortId) => {
        const connectedIds = getConnectedPortIds(prevCanvas, prevPortId)
        if (!connectedIds.length) { return } // nothing to do if no connections
        const matchedPort = matchPortInPreviousCanvas(nextCanvas, prevCanvas, prevPortId)
        if (!matchedPort) { return } // nothing to do if port no longer exists
        connectedIds.forEach((connectedId) => {
            const matchedConnectedPort = matchPortInPreviousCanvas(nextCanvas, prevCanvas, connectedId)
            if (!matchedConnectedPort || !canConnectPorts(nextCanvas, matchedPort.id, matchedConnectedPort.id)) { return }
            // re-connect if possible
            nextCanvas = connectPorts(nextCanvas, matchedPort.id, matchedConnectedPort.id)
        })
    })
    return nextCanvas
}

export function applyChanges({ sent, received, current }) {
    if (diff.isEqualCanvas(current, sent)) {
        // if no changes use state from server
        return received
    }

    let nextCanvas = current
    const changed = new Set(diff.changedModules(sent, current))
    // apply changes from server if local state hasn't changed
    received.modules.forEach((m) => {
        // item changed again, don't update this round
        if (changed.has(m.hash)) { return }
        // ignore changes to modules not in serverCanvas
        if (!getModuleIfExists(received, m.hash)) { return }
        nextCanvas = updateModule(nextCanvas, m.hash, () => (
            getModule(received, m.hash)
        ))
    })
    return nextCanvas
}

export function getModuleCopy(canvas, moduleHash) {
    // apply transformations on temp canvas
    // ensure all ports disconnected
    let tempCanvas = disconnectAllModulePorts(canvas, moduleHash)
    let m = getModule(tempCanvas, moduleHash)
    // offset new module by 32px
    const top = ((m.layout && parseInt(m.layout.position.top, 10)) + 32) || 0
    const left = ((m.layout && parseInt(m.layout.position.left, 10)) + 32) || 0
    tempCanvas = updateCanvas(updateModulePosition(tempCanvas, moduleHash, {
        top,
        left,
    }))
    m = getModule(tempCanvas, moduleHash)

    const portIds = getModulePortIds(tempCanvas, moduleHash)
    // give all ports fresh ids
    portIds.forEach((portId) => {
        const newId = uuid.v4()
        tempCanvas = updatePort(tempCanvas, portId, (p) => ({
            ...p,
            id: newId,
        }))
    })

    const newPortIds = getModulePortIds(tempCanvas, moduleHash)
    // always unset export
    newPortIds.forEach((portId) => {
        if (isPortExported(tempCanvas, portId)) {
            tempCanvas = setPortOptions(tempCanvas, portId, {
                export: false,
            })
        }
    })

    // fix variadics
    newPortIds.forEach((portId) => {
        const portType = getPortType(tempCanvas, portId)
        if (portType === 'output') { return } // process outputs when processing input
        const linkedPort = findLinkedVariadicPort(tempCanvas, portId)
        if (!linkedPort) { return }
        const portName = `endpoint-${portId}`
        const linkedName = `endpoint-${linkedPort.id}`
        // update linked output name to match id
        tempCanvas = updatePort(tempCanvas, linkedPort.id, (p) => ({
            ...p,
            name: linkedName,
        }))
        // update input linkedOutput to match new output name
        tempCanvas = updatePort(tempCanvas, portId, (p) => ({
            ...p,
            name: portName,
            variadic: {
                ...p.variadic,
                linkedOutput: linkedName,
            },
        }))
    })

    m = getModule(tempCanvas, moduleHash)
    return {
        ...m,
        hash: undefined, // always remove hash
    }
}
