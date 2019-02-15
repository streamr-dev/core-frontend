/**
 * Dashboard-specific API call wrappers
 */

import axios from 'axios'

import Autosave from '$editor/shared/utils/autosave'
import { emptyDashboard } from './state'

const API = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

const getData = ({ data }) => data

const dashboardsURL = `${process.env.STREAMR_API_URL}/dashboards`
const getModuleURL = `${process.env.STREAMR_URL}/module/jsonGetModule`
const getModuleTreeURL = `${process.env.STREAMR_URL}/module/jsonGetModuleTree`
const canvasesURL = `${process.env.STREAMR_API_URL}/canvases?adhoc=false&sort=dateCreated&order=desc`

const AUTOSAVE_DELAY = 3000

async function save(dashboard) {
    const body = {
        ...dashboard,
        layout: JSON.stringify(dashboard.layout || {}), // layout needs to be stringified?
    }
    return API.put(`${dashboardsURL}/${dashboard.id}`, body).then(getData)
}

export const autosave = Autosave(save, AUTOSAVE_DELAY)

export async function saveNow(dashboard, ...args) {
    if (autosave.pending) {
        return autosave.run(dashboard, ...args) // do not wait for debounce
    }

    return save(dashboard, ...args)
}

async function createDashboard(dashboard) {
    return API.post(dashboardsURL, dashboard).then(getData)
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
    return API.post(url, { type: 'json' }, {
        Authorization: `Token ${apiKey}`,
    }).then(getData).then(({ json }) => json)
}

export async function deleteDashboard({ id }) {
    await autosave.cancel()
    return API.delete(`${dashboardsURL}/${id}`).then(getData)
}

export async function getModuleTree() {
    return API.get(getModuleTreeURL).then(getData)
}

export async function addModule({ id }) {
    const form = new FormData()
    form.append('id', id)
    return API.post(getModuleURL, form).then(getData)
}

export async function loadDashboard({ id }) {
    return API.get(`${dashboardsURL}/${id}`).then(getData)
}

export async function getCanvases() {
    return API.get(canvasesURL).then(getData)
}
