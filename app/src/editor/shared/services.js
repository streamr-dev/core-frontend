import axios from 'axios'

const getModuleURL = `${process.env.STREAMR_URL}/module/jsonGetModule`

const API = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

const getData = ({ data }) => data

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

export async function getModule(module) {
    const form = new FormData()
    form.append('id', module.id)
    form.append('configuration', JSON.stringify(module))
    return API.post(getModuleURL, form).then(getData)
        .then((data) => {
            if (data.error) {
                throw new Error(data.message || 'Module load failed')
            }

            return data
        })
}
