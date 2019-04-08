/**
 * Canvas-specific API call wrappers
 */

import api from '$editor/shared/utils/api'
import Autosave from '$editor/shared/utils/autosave'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { emptyCanvas } from './state'

const getData = ({ data }) => data

const canvasesUrl = `${process.env.STREAMR_API_URL}/canvases`
const getModuleCategoriesURL = `${process.env.STREAMR_API_URL}/module_categories`
const streamsUrl = `${process.env.STREAMR_API_URL}/streams`

const AUTOSAVE_DELAY = 3000

async function save(canvas) {
    return api().put(`${canvasesUrl}/${canvas.id}`, canvas).then(getData)
}

function autoSaveWithNotification() {
    const autosave = Autosave(save, AUTOSAVE_DELAY)

    autosave.on('fail', () => {
        Notification.push({
            title: 'Autosave failed.',
            icon: NotificationIcon.ERROR,
        })
    })

    return autosave
}

export const autosave = autoSaveWithNotification()

export async function saveNow(canvas, ...args) {
    if (autosave.pending) {
        return autosave.run(canvas, ...args) // do not wait for debounce
    }

    return save(canvas, ...args)
}

export async function loadCanvas({ id } = {}) {
    return api().get(`${canvasesUrl}/${id}`).then(getData)
}

export async function loadCanvases() {
    return api().get(canvasesUrl).then(getData)
}

async function getUniqueName(canvasName) {
    const canvases = await loadCanvases()
    let name = canvasName
    if (!canvasName) {
        name = emptyCanvas().name // eslint-disable-line prefer-destructuring
    }
    const nameSplit = /(.*) \((\d)\)$/g.exec(name)
    if (nameSplit) {
        name = nameSplit[1] // eslint-disable-line prefer-destructuring
    }
    const names = canvases.map(({ name }) => name)
    let highestCounter = 1
    const matchingNames = names.filter((currentName) => {
        if (currentName === name) { return true }
        const matches = /(.*) \((\d)\)$/g.exec(currentName)
        if (!matches) { return false }
        const [, innerName, counter] = matches
        if (innerName !== name) { return false }
        highestCounter = Math.max(highestCounter, parseInt(counter, 10))
        return true
    })
    if (!matchingNames.length) { return canvasName }
    return `${name} (${highestCounter + 1})`
}

async function createCanvas(canvas) {
    return api().post(canvasesUrl, {
        ...canvas,
        name: await getUniqueName(canvas.name),
    }).then(getData)
}

export async function create() {
    return createCanvas(emptyCanvas()) // create new empty
}

export async function moduleHelp({ id }) {
    return api().get(`${process.env.STREAMR_API_URL}/modules/${id}/help`).then(getData)
}

export async function duplicateCanvas(canvas) {
    const savedCanvas = await saveNow(canvas) // ensure canvas saved before duplicating
    return createCanvas(savedCanvas)
}

export async function deleteCanvas({ id } = {}) {
    await autosave.cancel()
    return api().delete(`${canvasesUrl}/${id}`).then(getData)
}

export async function getModuleCategories() {
    return api().get(getModuleCategoriesURL).then(getData)
}

async function startCanvas(canvas, { clearState }) {
    const savedCanvas = await saveNow(canvas)
    return api().post(`${canvasesUrl}/${savedCanvas.id}/start`, {
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
    return api().post(`${canvasesUrl}/${canvas.id}/stop`).then(getData)
}

export async function getStreams(params) {
    return api().get(`${streamsUrl}`, { params }).then(getData)
}

export async function deleteAllCanvases() {
    // try do some clean up so we don't fill the server with cruft
    const canvases = await loadCanvases()
    return Promise.all(canvases.map((canvas) => (
        deleteCanvas(canvas)
    )))
}
