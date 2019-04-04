import axios from 'axios'

const getModulesURL = `${process.env.STREAMR_API_URL}/modules`

export const API = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

export const getData = ({ data }) => data

export const LOAD_JSON_REQ = {
    type: 'json',
}

export async function send({
    apiKey,
    data = {},
    dashboardId,
    canvasId,
    moduleHash,
}) {
    const dashboardPath = dashboardId ? `/dashboards/${dashboardId}` : ''
    const modulePath = `/canvases/${canvasId}/modules/${moduleHash}`
    const url = `${process.env.STREAMR_API_URL}${dashboardPath}${modulePath}/request`
    return API.post(url, {
        ...LOAD_JSON_REQ,
        ...data,
    }, {
        Authorization: `Token ${apiKey}`,
    }).then(getData)
}

export async function getModules() {
    return API.get(getModulesURL).then(getData)
}

export async function getModule({ id, configuration } = {}) {
    return API.post(`${getModulesURL}/${id}`, configuration).then(getData)
}
