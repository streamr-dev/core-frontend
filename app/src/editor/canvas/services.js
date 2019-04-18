/**
 * Canvas-specific API call wrappers
 */

import api from '$editor/shared/utils/api'
import Autosave from '$editor/shared/utils/autosave'
import { nextUniqueName, nextUniqueCopyName } from '$editor/shared/utils/uniqueName'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { emptyCanvas, isRunning, RunStates, RunTabs } from './state'

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
    if (id == null) { throw new TypeError(`loadCanvas missing id: ${id}`) }
    return api().get(`${canvasesUrl}/${id}`).then(getData)
}

export async function loadCanvases() {
    return api().get(canvasesUrl).then(getData)
}

async function getCanvasNames() {
    const canvases = await loadCanvases()
    return canvases.map(({ name }) => name)
}

async function createCanvas(canvas) {
    return api().post(canvasesUrl, {
        ...canvas,
        // adhoc canvases should use parent name
        name: canvas.adhoc ? canvas.name : await getUniqueCanvasName(canvas.name),
        state: RunStates.Stopped, // always create stopped canvases
    }).then(getData)
}

export async function create(config) {
    const canvas = emptyCanvas(config)
    return createCanvas({
        ...canvas,
        // adhoc canvases should use parent name
       name: canvas.adhoc ? canvas.name : nextUniqueName(canvas.name, await getCanvasNames()),
    })
}

export async function duplicateCanvas(canvas) {
    if (!isRunning(canvas) && !canvas.adhoc) {
        canvas = await saveNow(canvas) // ensure canvas saved before duplicating
    }
    return createCanvas({
        ...canvas,
        adhoc: false, // duplicate canvases are never adhoc
        name: nextUniqueCopyName(canvas.name, await getCanvasNames()),
    })
}

export async function deleteCanvas({ id } = {}) {
    await autosave.cancel()
    return api().delete(`${canvasesUrl}/${id}`).then(getData)
}

export async function moduleHelp({ id }) {
    return api().get(`${process.env.STREAMR_API_URL}/modules/${id}/help`).then(getData)
}

export async function getModuleCategories() {
    return api().get(getModuleCategoriesURL).then(getData)
}

async function startCanvas(canvas, { clearState }) {
    const savedCanvas = await saveNow(canvas)
    return api().post(`${canvasesUrl}/${savedCanvas.id}/start`, {
        clearState: !!clearState,
    }).then((data) => {
        Notification.push({
            title: 'Canvas started.',
            icon: NotificationIcon.CHECKMARK,
        })
        return getData(data)
    })
}

/**
 * Duplicates passed in parent canvas as an adhoc child canvas.
 * Links parent and child canvas.
 */

export async function createAdhocCanvas(canvas) {
    const savedCanvas = await saveNow(canvas)
    const child = await createCanvas({
        ...savedCanvas,
        adhoc: true,
        settings: {
            ...savedCanvas.settings,
            parentCanvasId: savedCanvas.id, // track parent canvas so can return after end
        },
    })
    await saveNow({
        ...savedCanvas,
        settings: {
            ...savedCanvas.settings,
            childCanvasId: child.id, // track child canvas so can return after end
        },
    })
    return child
}

export async function start(canvas, options = {}) {
    const savedCanvas = await saveNow(canvas)
    return startCanvas(savedCanvas, options)
}

export async function stop(canvas) {
    return api().post(`${canvasesUrl}/${canvas.id}/stop`)
        .then((data) => {
            Notification.push({
                title: 'Canvas stopped.',
                icon: NotificationIcon.CHECKMARK,
            })
            return getData(data)
        })
}

/**
 * Realtime runs can start immediately.
 * Historical runs need to create a new adhoc canvas first.
 */

export async function startOrCreateAdhocCanvas(canvas, options) {
    const { settings = {} } = canvas
    const { editorState = {} } = settings
    const isHistorical = editorState.runTab === RunTabs.historical
    if (isHistorical && !canvas.adhoc) {
        return createAdhocCanvas(canvas)
    }

    return start(canvas, {
        clearState: !!options.clearState || isHistorical,
    })
}

/**
 * Unlinks parent from child.
 */

export async function exitAdhocCanvas(canvas) {
    const { settings = {} } = canvas
    const parent = await loadCanvas({ id: settings.parentCanvasId })
    return saveNow({
        ...parent,
        settings: {
            ...parent.settings,
            childCanvasId: undefined,
        },
    })
}

/**
 * Loads child canvas if one is active, otherwise loads passed-in canvas.
 */

export async function loadRelevantCanvas({ id }) {
    const canvas = await loadCanvas({ id })
    if (canvas.settings.childCanvasId) {
        return loadCanvas({ id: canvas.settings.childCanvasId })
    }
    return canvas
}

export async function getStreams(params) {
    return api().get(`${streamsUrl}`, { params }).then(getData)
}

export async function getStream(id) {
    return api().get(`${streamsUrl}/${id}`).then(getData)
}

export async function deleteAllCanvases() {
    // try do some clean up so we don't fill the server with cruft
    const canvases = await loadCanvases()
    return Promise.all(canvases.map((canvas) => (
        deleteCanvas(canvas)
    )))
}
