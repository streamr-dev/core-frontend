import update from 'lodash/fp/update'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import keyBy from 'lodash/keyBy'
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

export function emptyDashboard() {
    return {
        name: 'Untitled Dashboard',
        settings: {},
        modules: [],
    }
}

/**
 * Module hash -> path to module in dashboard
 */

function indexModules(dashboard) {
    return dashboard.modules.reduce((o, m, index) => Object.assign(o, {
        [m.hash]: ['modules', index],
    }), {})
}

/**
 * Port Id -> path to port in dashboard
 */

function indexPorts(dashboard, moduleIndex) {
    return Object.values(moduleIndex).reduce((o, modulePath) => {
        const dashboardModule = get(dashboard, modulePath)
        // create port paths by appending
        // dashboardModule path + inputs/outputs/params + port's index
        dashboardModule.params.forEach((port, index) => {
            o[port.id] = modulePath.concat('params', index)
        })
        dashboardModule.inputs.forEach((port, index) => {
            o[port.id] = modulePath.concat('inputs', index)
        })
        dashboardModule.outputs.forEach((port, index) => {
            o[port.id] = modulePath.concat('outputs', index)
        })
        return o
    }, {})
}

/**
 * Module and Port Indexes
 */

function createIndex(dashboard) {
    if (!dashboard || typeof dashboard !== 'object') {
        throw new Error(`bad dashboard (${typeof dashboard})`)
    }

    const modules = indexModules(dashboard)
    const ports = indexPorts(dashboard, modules)
    return {
        dashboard,
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

function getPortType(dashboard, portId) {
    const dashboardIndex = getIndex(dashboard)
    const path = dashboardIndex.ports[portId]
    if (!path) { return }
    return path[path.length - 2].slice(0, -1) // inputs -> input, outputs -> output
}

/**
 * Path to port's parent module
 */

function getPortModulePath(dashboard, portId) {
    const dashboardIndex = getIndex(dashboard)
    const path = dashboardIndex.ports[portId]
    if (!path) { return }
    return path.slice(0, -2)
}

/**
 * True iff port is an output port
 */

function getIsOutput(dashboard, portId) {
    const type = getPortType(dashboard, portId)
    return type === PortTypes.output
}

/**
 * Parent module for port
 */

export function getModuleForPort(dashboard, portId) {
    return get(dashboard, getPortModulePath(dashboard, portId))
}

export function getModule(dashboard, moduleHash) {
    const { modules } = getIndex(dashboard)
    return get(dashboard, modules[moduleHash])
}

export function getPort(dashboard, portId) {
    const { ports } = getIndex(dashboard)
    return get(dashboard, ports[portId])
}

export function getModulePorts(dashboard, moduleHash) {
    const dashboardModule = getModule(dashboard, moduleHash)
    const ports = {}
    dashboardModule.params.forEach((port) => {
        ports[port.id] = getPort(dashboard, port.id)
    })
    dashboardModule.inputs.forEach((port) => {
        ports[port.id] = getPort(dashboard, port.id)
    })
    dashboardModule.outputs.forEach((port) => {
        ports[port.id] = getPort(dashboard, port.id)
    })

    return ports
}

export function getConnectedPortIds(dashboard, portId) {
    const port = getPort(dashboard, portId)
    if (!getIsOutput(dashboard, portId)) {
        return [port.sourceId].filter(Boolean)
    }

    const { ports } = getIndex(dashboard)
    return Object.keys(ports).filter((id) => {
        const { sourceId } = getPort(dashboard, id)
        return sourceId === portId
    }).filter(Boolean)
}

export function isPortConnected(dashboard, portId) {
    const conn = getConnectedPortIds(dashboard, portId)
    return !!conn.length
}

export function updatePort(dashboard, portId, fn) {
    const { ports } = getIndex(dashboard)
    return update(ports[portId], fn, dashboard)
}

export function updateModule(dashboard, moduleHash, fn) {
    const { modules } = getIndex(dashboard)
    return update(modules[moduleHash], fn, dashboard)
}

export function updateModulePosition(dashboard, moduleHash, diff) {
    const { modules } = getIndex(dashboard)
    const modulePath = modules[moduleHash]
    return update(modulePath.concat('layout', 'position'), (position) => ({
        ...position,
        top: `${Number.parseInt(position.top, 10) + diff.y}px`,
        left: `${Number.parseInt(position.left, 10) + diff.x}px`,
    }), dashboard)
}

export function updateModuleSize(dashboard, moduleHash, size) {
    const { modules } = getIndex(dashboard)
    const modulePath = modules[moduleHash]
    return update(modulePath.concat('layout'), (layout) => ({
        ...layout,
        height: `${size.height}px`,
        width: `${size.width}px`,
    }), dashboard)
}

function getOutputInputPorts(dashboard, portIdA, portIdB) {
    const ports = [getPort(dashboard, portIdA), getPort(dashboard, portIdB)]
    if (getIsOutput(dashboard, portIdB)) {
        ports.reverse() // ensure output port is first
    }

    return ports
}

export function canConnectPorts(dashboard, portIdA, portIdB) {
    if (getIsOutput(dashboard, portIdA) === getIsOutput(dashboard, portIdB)) {
        // if both inputs or both outputs, cannot connect
        return false
    }

    const moduleA = getModuleForPort(dashboard, portIdA)
    const moduleB = getModuleForPort(dashboard, portIdB)
    // cannot connect module to self
    if (moduleA.hash === moduleB.hash) { return false }

    const [output, input] = getOutputInputPorts(dashboard, portIdA, portIdB)

    if (!input.canConnect || !output.canConnect) { return false }

    // verify compatible types
    const inputTypes = new Set(input.acceptedTypes)
    // Object type can connect to anything
    if (output.type === 'Object' || inputTypes.has('Object')) { return true }
    return inputTypes.has(output.type)
}

function hasVariadicPort(dashboard, moduleHash) {
    const dashboardModule = getModule(dashboard, moduleHash)
    return dashboardModule.inputs.some(({ variadic }) => variadic)
}

function getVariadicPorts(dashboard, moduleHash) {
    const dashboardModule = getModule(dashboard, moduleHash)
    return dashboardModule.inputs.filter(({ variadic }) => variadic)
}

function findLastVariadicPort(dashboard, moduleHash) {
    const variadics = getVariadicPorts(dashboard, moduleHash)
    return variadics.find(({ variadic }) => (
        variadic.isLast
    )) || variadics[variadics.length - 1]
}

function findPreviousLastVariadicPort(dashboard, moduleHash) {
    const variadics = getVariadicPorts(dashboard, moduleHash)
    const last = findLastVariadicPort(dashboard, moduleHash)
    const index = variadics.indexOf(last)
    return variadics[index - 1]
}

function addVariadic(dashboard, moduleHash) {
    const port = findLastVariadicPort(dashboard, moduleHash)

    // update current last port
    const nextDashboard = updatePort(dashboard, port.id, (port) => ({
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
    return updateModule(nextDashboard, moduleHash, (dashboardModule) => ({
        ...dashboardModule,
        inputs: dashboardModule.inputs.concat(newPort),
    }))
}

function removeVariadic(dashboard, moduleHash) {
    const lastVariadicPort = findLastVariadicPort(dashboard, moduleHash)
    const prevVariadicPort = findPreviousLastVariadicPort(dashboard, moduleHash)
    // make second-last variadic port the last
    const nextDashboard = updatePort(dashboard, prevVariadicPort.id, (port) => ({
        ...port,
        variadic: {
            ...port.variadic,
            isLast: true,
            requiresConnection: false,
        },
    }))

    // remove last variadic port
    return updateModule(nextDashboard, moduleHash, (dashboardModule) => ({
        ...dashboardModule,
        inputs: dashboardModule.inputs.filter(({ id }) => id !== lastVariadicPort.id),
    }))
}

export function updateVariadicModule(dashboard, moduleHash) {
    if (!hasVariadicPort(dashboard, moduleHash)) {
        return dashboard // ignore if no variadic ports
    }

    const lastVariadicPort = findLastVariadicPort(dashboard, moduleHash)
    if (!lastVariadicPort) {
        throw new Error('no last variadic port') // should not happen
    }

    if (isPortConnected(dashboard, lastVariadicPort.id)) {
        // add new port if last variadic port is connected
        return addVariadic(dashboard, moduleHash)
    }

    const variadics = getVariadicPorts(dashboard, moduleHash)
    const lastConnected = variadics.slice().reverse().find(({ id }) => (
        isPortConnected(dashboard, id)
    ))

    // remove all variadics after last connected variadic + 1 placeholder
    const variadicsToRemove = variadics.slice(variadics.indexOf(lastConnected) + 2)
    if (variadicsToRemove.length) {
        // remove last variadic for each variadic that needs removing
        // TODO: remove all in one go
        let newDashboard = dashboard
        variadicsToRemove.forEach(() => {
            newDashboard = removeVariadic(newDashboard, moduleHash)
        })
        return newDashboard
    }

    // otherwise ignore
    return dashboard
}

export function updateVariadic(dashboard) {
    return dashboard.modules.reduce((nextDashboard, { hash }) => (
        updateVariadicModule(nextDashboard, hash)
    ), dashboard)
}

export function disconnectPorts(dashboard, portIdA, portIdB) {
    const [output, input] = getOutputInputPorts(dashboard, portIdA, portIdB)
    if (input.sourceId !== output.id) {
        return dashboard // not connected
    }

    // disconnect input
    const nextDashboard = updatePort(dashboard, input.id, (port) => ({
        ...port,
        sourceId: null,
        connected: false,
    }))

    // disconnect output
    return updatePort(nextDashboard, output.id, (port) => ({
        ...port,
        connected: isPortConnected(nextDashboard, output.id),
    }))
}

export function connectPorts(dashboard, portIdA, portIdB) {
    if (!canConnectPorts(dashboard, portIdA, portIdB)) {
        throw new Error(`cannot connect ${portIdA}, ${portIdB}`)
    }

    const [output, input] = getOutputInputPorts(dashboard, portIdA, portIdB)

    let nextDashboard = dashboard

    if (input.sourceId) {
        // disconnect existing input connection
        nextDashboard = disconnectPorts(nextDashboard, input.sourceId, input.id)
    }

    // connect input
    nextDashboard = updatePort(nextDashboard, input.id, (port) => ({
        ...port,
        sourceId: output.id,
        connected: true,
    }))

    // connect output
    return updatePort(nextDashboard, output.id, (port) => ({
        ...port,
        connected: isPortConnected(nextDashboard, output.id),
    }))
}

export function disconnectAllFromPort(dashboard, portId) {
    if (!isPortConnected(dashboard, portId)) { return dashboard }
    const portIds = getConnectedPortIds(dashboard, portId)
    return portIds.reduce((prevDashboard, connectedPortId) => (
        disconnectPorts(prevDashboard, portId, connectedPortId)
    ), dashboard)
}

export function disconnectAllModulePorts(dashboard, moduleHash) {
    const allPorts = getModulePorts(dashboard, moduleHash)
    return Object.values(allPorts).reduce((prevDashboard, port) => (
        disconnectAllFromPort(prevDashboard, port.id)
    ), dashboard)
}

export function removeModule(dashboard, id) {
    return {
        ...dashboard,
        items: dashboard.items.filter((m) => m.id !== id),
    }
}

export function addModule(dashboard, canvasId, module) {
    const dashboardModule = {
        id: uuid.v4(),
        dashboard: dashboard.id,
        module: module.hash,
        canvas: canvasId,
        webcomponent: module.uiChannel.webcomponent,
        title: module.name,
    }

    return {
        ...dashboard,
        items: dashboard.items.concat(dashboardModule),
    }
}

/**
 * Sets initialValue for inputs
 * Sets value for output/params
 */

export function setPortUserValue(dashboard, portId, value) {
    const portType = getPortType(dashboard, portId)
    const key = {
        [PortTypes.input]: 'initialValue',
        [PortTypes.param]: 'value',
        [PortTypes.output]: 'value', // not really user-configurable but whatever
    }[portType]

    if (JSON.stringify(getPort(dashboard, portId)[key]) === JSON.stringify(value)) {
        // noop if no change
        return dashboard
    }

    return updatePort(dashboard, portId, (port) => {
        if (port[key] === value) { return port }
        return {
            ...port,
            [key]: value,
        }
    })
}

export function setPortOptions(dashboard, portId, options = {}) {
    const port = getPort(dashboard, portId)
    if (Object.entries(options).every(([key, value]) => port[key] === value)) {
        // noop if no change
        return dashboard
    }

    return updatePort(dashboard, portId, (port) => ({
        ...port,
        ...options,
    }))
}

export function setModuleOptions(dashboard, moduleHash, newOptions = {}) {
    const { modules } = getIndex(dashboard)
    const modulePath = modules[moduleHash]
    return update(modulePath.concat('options'), (options = {}) => (
        Object.keys(newOptions).reduce((options, key) => (
            update([key].concat('value'), () => newOptions[key], options)
        ), options)
    ), dashboard)
}

export function updateDashboard(dashboard, path, fn) {
    return updateVariadic(update(path, fn, dashboard))
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

export function dashboardModuleSearch(canvases, search) {
    const canvasModules = canvases.map((canvas) => (
        canvas.modules
            .filter((m) => m.uiChannel)
            .sort((a, b) => (a.name ? a.name.localeCompare(b.name) : 0))
            .map((m) => ({
                ...m,
                canvasId: canvas.id,
            }))
    ))
    const canvasMap = keyBy(canvases, 'id')
    const allModules = [].concat(...canvasModules)
    if (!search) { return allModules }
    return allModules.filter((m) => (
        m.name.toLowerCase().includes(search) ||
        canvasMap[m.canvasId].name.toLowerCase().includes(search)
    ))
}
