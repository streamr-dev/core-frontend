import * as API from '$shared/utils/api'

import Autosave from './utils/autosave'
import { emptyCanvas } from './state'

const canvasesUrl = `${process.env.STREAMR_API_URL}/canvases`
const getModuleURL = `${process.env.STREAMR_URL}/module/jsonGetModule`
const getModuleTreeURL = `${process.env.STREAMR_URL}/module/jsonGetModuleTree`

const AUTOSAVE_DELAY = 3000

async function save(canvas) {
    return API.put(`${canvasesUrl}/${canvas.id}`, canvas)
}

export const autosave = Autosave(save, AUTOSAVE_DELAY)

export async function saveNow(canvas, ...args) {
    if (autosave.pending) {
        return autosave.run(canvas, ...args) // do not wait for debounce
    }

    return save(canvas, ...args)
}

export async function create() {
    return API.post(canvasesUrl, emptyCanvas())
}

export async function moduleHelp({ id }) {
    return API.get(`${process.env.STREAMR_API_URL}/modules/${id}/help`)
}

export async function duplicateCanvas(canvas) {
    const savedCanvas = await saveNow(canvas) // ensure canvas saved before duplicating
    return API.post(canvasesUrl, savedCanvas)
}

export async function deleteCanvas({ id }) {
    await autosave.cancel()
    return API.del(`${canvasesUrl}/${id}`)
}

export async function getModuleTree() {
    const moduleData = await API.get(getModuleTreeURL)
    if (moduleData.error) {
        // TODO handle this better
        throw new Error(`error getting module tree ${moduleData.message}`)
    }
    return moduleData
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
