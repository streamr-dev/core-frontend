import keyBy from 'lodash/keyBy'
import uuid from 'uuid'

export function emptyDashboard() {
    return {
        name: 'Untitled Dashboard',
        settings: {},
        items: [],
        layout: {},
        editingLocked: false,
        new: true,
        saved: true,
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

export function removeModule(dashboard, id) {
    return {
        ...dashboard,
        items: dashboard.items.filter((m) => m.id !== id),
    }
}

export function updateModule(dashboard, id, fn) {
    const items = dashboard.items.slice()
    const index = items.findIndex((item) => item.id === id)
    items[index] = fn(items[index])
    return {
        ...dashboard,
        items,
    }
}

/**
 * Find all modules in canvases matching search
 */

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
