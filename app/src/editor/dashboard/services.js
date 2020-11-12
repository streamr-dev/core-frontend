/**
 * Dashboard-specific API call wrappers
 */

import { get, put, post, del } from '$shared/utils/api'
import Autosave from '$editor/shared/utils/autosave'
import { nextUniqueName, nextUniqueCopyName } from '$editor/shared/utils/uniqueName'
import { emptyDashboard } from './state'
import routes from '$routes'

const AUTOSAVE_DELAY = 500

async function save(dashboard) {
    const body = {
        ...dashboard,
        layout: JSON.stringify(dashboard.layout || {}), // layout needs to be stringified?
    }
    return put({
        url: routes.api.dashboards.show({
            id: dashboard.id,
        }),
        data: body,
    })
}

export const autosave = Autosave(save, AUTOSAVE_DELAY)

export async function saveNow(dashboard, ...args) {
    if (autosave.pending) {
        return autosave.run(dashboard, ...args) // do not wait for debounce
    }

    return save(dashboard, ...args)
}

export async function deleteDashboard({ id }) {
    await autosave.cancel()
    return del({
        url: routes.api.dashboards.show({
            id,
        }),
    })
}

export async function deleteDashboardPermissions({ id, permissionIds }) {
    await autosave.cancel()
    return Promise.all(permissionIds.map((permissionId) => del({
        url: routes.api.dashboards.permissions.show({
            dashboardId: id,
            id: permissionId,
        }),
    })))
}

export async function loadDashboard({ id }) {
    return get({
        url: routes.api.dashboards.show({
            id,
        }),
    })
}

export async function getCanvases() {
    return get({
        url: routes.api.canvases.index({
            adhoc: false,
            sort: 'dateCreated',
            order: 'desc',
        }),
    })
}

export async function getDashboards() {
    return get({
        url: routes.api.dashboards.index(),
    })
}

async function getDashboardNames() {
    const dashboards = await getDashboards()
    return dashboards.map(({ name }) => name)
}

async function createDashboard(dashboard) {
    return post({
        url: routes.api.dashboards.index(),
        data: dashboard,
    })
}

export async function create() {
    const dashboard = emptyDashboard()
    return createDashboard({
        ...dashboard,
        name: nextUniqueName(dashboard.name, await getDashboardNames()),
    })
}

export async function duplicateDashboard(dashboard) {
    dashboard = await saveNow(dashboard) // ensure dashboard saved before duplicating

    return createDashboard({
        ...dashboard,
        name: nextUniqueCopyName(dashboard.name, await getDashboardNames()),
    })
}
