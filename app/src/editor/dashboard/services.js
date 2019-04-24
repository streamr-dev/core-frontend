/**
 * Dashboard-specific API call wrappers
 */

import api from '$editor/shared/utils/api'
import Autosave from '$editor/shared/utils/autosave'
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

async function createDashboard(dashboard) {
    return api().post(dashboardsURL, dashboard).then(getData)
}

export async function create() {
    return createDashboard(emptyDashboard()) // create new empty
}

export async function duplicateDashboard(dashboard) {
    const savedDashboard = await saveNow(dashboard) // ensure dashboard saved before duplicating
    return createDashboard(savedDashboard)
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
