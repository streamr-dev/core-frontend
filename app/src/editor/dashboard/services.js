/**
 * Dashboard-specific API call wrappers
 */

import api from '$editor/shared/utils/api'
import Autosave from '$editor/shared/utils/autosave'
import { nextUniqueName, nextUniqueCopyName } from '$editor/shared/utils/uniqueName'
import { emptyDashboard } from './state'

const getData = ({ data }) => data

const dashboardsURL = `${process.env.STREAMR_API_URL}/dashboards`
const canvasesURL = `${process.env.STREAMR_API_URL}/canvases?adhoc=false&sort=dateCreated&order=desc`

const AUTOSAVE_DELAY = 3000

async function save(dashboard) {
    const body = {
        ...dashboard,
        layout: JSON.stringify(dashboard.layout || {}), // layout needs to be stringified?
    }
    return api().put(`${dashboardsURL}/${dashboard.id}`, body).then(getData)
}

export const autosave = Autosave(save, AUTOSAVE_DELAY)

export async function saveNow(dashboard, ...args) {
    if (autosave.pending) {
        return autosave.run(dashboard, ...args) // do not wait for debounce
    }

    return save(dashboard, ...args)
}

export async function getModuleData({ apiKey, dashboard, item: { canvas, module: itemModule } }) {
    // If the db is new the user must have the ownership of the canvas so use url /api/v1/canvases/<canvasId>/modules/<module>
    // Else use the url /api/v1/dashboards/<dashboardId>/canvases/<canvasId>/modules/<module>
    const dashboardPath = (dashboard && !dashboard.new) ? `/dashboards/${dashboard.id}` : ''
    const modulePath = `/canvases/${canvas}/modules/${itemModule}`
    const url = `${process.env.STREAMR_API_URL}${dashboardPath}${modulePath}/request`
    return api().post(url, { type: 'json' }, {
        Authorization: `Token ${apiKey}`,
    }).then(getData).then(({ json }) => json)
}

export async function deleteDashboard({ id }) {
    await autosave.cancel()
    return api().delete(`${dashboardsURL}/${id}`).then(getData)
}

export async function loadDashboard({ id }) {
    return api().get(`${dashboardsURL}/${id}`).then(getData)
}

export async function getCanvases() {
    return api().get(canvasesURL).then(getData)
}

export async function getDashboards() {
    return api().get(dashboardsURL).then(getData)
}

async function getDashboardNames() {
    const dashboards = await getDashboards()
    return dashboards.map(({ name }) => name)
}

async function createDashboard(dashboard) {
    return api().post(dashboardsURL, dashboard).then(getData)
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
