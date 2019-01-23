import axios from 'axios'

import Autosave from '$editor/shared/utils/autosave'
import { emptyCanvas } from './state'

const API = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

const getData = ({ data }) => data

const canvasesUrl = `${process.env.STREAMR_API_URL}/canvases`
const getModuleURL = `${process.env.STREAMR_URL}/module/jsonGetModule`
const getModuleTreeURL = `${process.env.STREAMR_URL}/module/jsonGetModuleTree`

const AUTOSAVE_DELAY = 3000

async function save(canvas) {
    return API.put(`${canvasesUrl}/${canvas.id}`, canvas).then(getData)
}

export const autosave = Autosave(save, AUTOSAVE_DELAY)

export async function saveNow(canvas, ...args) {
    if (autosave.pending) {
        return autosave.run(canvas, ...args) // do not wait for debounce
    }

    return save(canvas, ...args)
}

async function createCanvas(canvas) {
    return API.post(canvasesUrl, canvas).then(getData)
}

export async function create() {
    return createCanvas(emptyCanvas()) // create new empty
}

export async function moduleHelp({ id }) {
    return API.get(`${process.env.STREAMR_API_URL}/modules/${id}/help`).then(getData)
}

export async function duplicateCanvas(canvas) {
    const savedCanvas = await saveNow(canvas) // ensure canvas saved before duplicating
    return createCanvas(savedCanvas)
}

export async function deleteCanvas({ id }) {
    await autosave.cancel()
    return API.delete(`${canvasesUrl}/${id}`).then(getData)
}

export async function getModuleTree() {
    return API.get(getModuleTreeURL).then(getData)
}

export async function addModule({ id }) {
    const form = new FormData()
    form.append('id', id)
    return API.post(getModuleURL, form).then(getData)
}

export async function loadCanvas({ id }) {
    return API.get(`${canvasesUrl}/${id}`).then(getData)
}

async function startCanvas(canvas, { clearState }) {
    const savedCanvas = await saveNow(canvas)
    return API.post(`${canvasesUrl}/${savedCanvas.id}/start`, {
        clearState: !!clearState,
    }).then(getData)
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
    return API.post(`${canvasesUrl}/${canvas.id}/stop`).then(getData)
}
