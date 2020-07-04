import api from '$editor/shared/utils/api'
import ModuleError from '$editor/shared/errors/ModuleError'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'

const getModulesURL = `${process.env.STREAMR_API_URL}/modules`

export const getData = ({ data }) => data

export const LOAD_JSON_REQ = {
    type: 'json',
}

export async function send({ data = {}, dashboardId, canvasId, moduleHash }) {
    const dashboardPath = dashboardId ? `/dashboards/${dashboardId}` : ''
    const modulePath = `/canvases/${canvasId}/modules/${moduleHash}`
    const url = `${process.env.STREAMR_API_URL}${dashboardPath}${modulePath}/request`
    return api().post(url, {
        ...LOAD_JSON_REQ,
        ...data,
    }).then(getData)
}

export async function getModules() {
    return api().get(getModulesURL).then(getData)
}

export async function getModule({ id, configuration } = {}) {
    return api().post(`${getModulesURL}/${id}`, configuration).then(getData)
        .then((data) => {
            if (data.error) {
                Notification.push({
                    title: data.message,
                    icon: NotificationIcon.ERROR,
                })
                throw new ModuleError(data.message || 'Module load failed', data.moduleErrors)
            }

            return data
        })
}
