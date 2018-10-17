import * as API from '$shared/utils/api'

const canvasesUrl = `${process.env.STREAMR_API_URL}/canvases`
const getModuleURL = `${process.env.STREAMR_URL}/module/jsonGetModule`

export async function save(canvas) {
    return API.put(`${canvasesUrl}/${canvas.id}`, canvas)
}

export async function duplicateCanvas(canvas) {
    return API.post(canvasesUrl, canvas)
}

export async function addModule({ id }) {
    const form = new FormData()
    form.append('id', id)
    const moduleData = await API.post(getModuleURL, form)
    if (moduleData.error) {
        // TODO handle this better
        throw new Error(`error getting module ${moduleData.message}`)
    }
    return moduleData
}
