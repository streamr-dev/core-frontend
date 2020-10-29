import { get, post } from '$shared/utils/api'
import ModuleError from '$editor/shared/errors/ModuleError'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import routes from '$routes'

export const getData = ({ data }) => data

export const LOAD_JSON_REQ = {
    type: 'json',
}

export async function send({ data = {}, dashboardId, canvasId, moduleHash }) {
    const dashboardPath = dashboardId ? `/dashboards/${dashboardId}` : ''
    const modulePath = `/canvases/${canvasId}/modules/${moduleHash}`
    const url = `${process.env.STREAMR_API_URL}${dashboardPath}${modulePath}/request`

    return post({
        url,
        data: {
            ...LOAD_JSON_REQ,
            ...data,
        },
    })
}

export async function getModules() {
    return get({
        url: routes.api.modules.index(),
    })
}

export async function getModule({ id, configuration } = {}) {
    return post({
        url: routes.api.modules.show({
            id,
        }),
        data: configuration,
    })
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
