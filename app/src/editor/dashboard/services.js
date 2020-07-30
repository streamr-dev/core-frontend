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

const AUTOSAVE_DELAY = 500

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
