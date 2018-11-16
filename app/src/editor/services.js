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

async function createCanvas(canvas) {
    return API.post(canvasesUrl, canvas)
}

export async function create() {
    return createCanvas(emptyCanvas()) // create new empty
}

export async function moduleHelp({ id }) {
    return API.get(`${process.env.STREAMR_API_URL}/modules/${id}/help`)
}

export async function duplicateCanvas(canvas) {
    const savedCanvas = await saveNow(canvas) // ensure canvas saved before duplicating
    return createCanvas(savedCanvas)
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

export async function loadCanvas({ id }) {
    return API.get(`${canvasesUrl}/${id}`)
}

async function startCanvas(canvas, { clearState }) {
    const savedCanvas = await saveNow(canvas)
    await API.post(`${canvasesUrl}/${savedCanvas.id}/start`, {
        clearState: !!clearState,
    })
    // ignore response body, just re-fetch
    // if canvas crashed immediately after starting this will reflect that state
    return loadCanvas(savedCanvas)
}

async function startAdhocCanvas(canvas, options = {}) {
    const savedCanvas = await saveNow(canvas)
    const adhocCanvas = await createCanvas({
        ...savedCanvas,
        adhoc: true,
        settings: {
            ...savedCanvas.settings,
            parentCanvasId: canvas.id, // track parent canvas so can return after end
        },
    })
    return startCanvas(adhocCanvas, options)
}

export async function start(canvas, options = {}) {
    const { adhoc } = options
    if (!adhoc) { return startCanvas(canvas, options) }
    return startAdhocCanvas(canvas, options)
}

export async function stop(canvas) {
    await API.post(`${canvasesUrl}/${canvas.id}/stop`)
}
