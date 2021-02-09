/**
 * Canvas-specific API call wrappers
 */

import { get, post, put, del } from '$shared/utils/api'
import Autosave from '$editor/shared/utils/autosave'
import { nextUniqueName, nextUniqueCopyName } from '$editor/shared/utils/uniqueName'
import routes from '$routes'
import { emptyCanvas, RunStates, isHistoricalModeSelected } from './state'
import { link, unlink, getLink } from './state/linking'
import analytics from '$shared/../analytics'

const AUTOSAVE_DELAY = 500

async function save(canvas) {
    return put({
        url: routes.api.canvases.show({
            id: canvas.id,
        }),
        data: canvas,
    })
}

export const autosave = Autosave(save, AUTOSAVE_DELAY)

export async function saveNow(canvas, ...args) {
    if (autosave.pending) {
        return autosave.run(canvas, ...args) // do not wait for debounce
    }

    return save(canvas, ...args)
}

export async function loadCanvas({ id } = {}) {
    if (id == null) { throw new TypeError(`loadCanvas missing id: ${id}`) }

    return get({
        url: routes.api.canvases.show({
            id,
        }),
    })
}

export async function loadCanvases() {
    return get({
        url: routes.api.canvases.index(),
    })
}

async function getCanvasNames() {
    const canvases = await loadCanvases()
    return canvases.map(({ name }) => name)
}

async function createCanvas(canvas) {
    return post({
        url: routes.api.canvases.index(),
        data: {
            ...canvas,
            state: RunStates.Stopped, // always create stopped canvases
        },
    })
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
    return createCanvas({
        ...canvas,
        adhoc: false, // duplicate canvases are never adhoc
        name: nextUniqueCopyName(canvas.name, await getCanvasNames()),
    })
}

export async function deleteCanvas({ id } = {}) {
    await autosave.cancel()

    return del({
        url: routes.api.canvases.show({
            id,
        }),
    })
}

export async function getModuleCategories() {
    return get({
        url: routes.api.moduleCategories(),
    })
}

export async function deleteCanvasPermissions({ id, permissionIds }) {
    await autosave.cancel()
    return Promise.all(permissionIds.map((permissionId) => del({
        url: routes.api.canvases.permissions.show({
            canvasId: id,
            id: permissionId,
        }),
    })))
}

export async function getStreams(params) {
    return get({
        url: routes.api.streams.index({
            ...(params || {}),
        }),
    })
}

export async function getStream(id) {
    return get({
        url: routes.api.streams.show({
            id,
        }),
    })
}

export async function deleteAllCanvases() {
    // try do some clean up so we don't fill the server with cruft
    const canvases = await loadCanvases()
    return Promise.all(canvases.map((canvas) => (
        deleteCanvas(canvas)
    )))
}

/**
 * Starts whatever canvasId is passed in
 */
async function startCanvasId(canvasId, { clearState }) {
    return post({
        url: routes.api.canvases.start({
            id: canvasId,
        }),
        data: {
            clearState: !!clearState,
        },
    })
}

/**
 * Duplicates passed in parent canvas as an adhoc child canvas.
 * Links parent and child canvas.
 * When parent is re-loaded, the child (historical canvas) will be loaded in its place until unlinked.
 */

export async function createAdhocCanvas(canvas) {
    unlink(canvas.id) // remove existing link
    const savedCanvas = await saveNow(canvas) // ensure state is saved
    // create adhoc version of passed-in canvas
    const child = await createCanvas({
        ...savedCanvas,
        adhoc: true,
        settings: {
            ...savedCanvas.settings,
            parentCanvasId: savedCanvas.id, // track parent canvas so can return after end
        },
    })
    // if page reloaded before this point, child canvas is effectively lost
    link(savedCanvas.id, child.id)
    return child
}

export async function start(canvas, options = {}) {
    await saveNow(canvas)
    return startCanvasId(canvas.id, options)
}

export async function stop({ id }) {
    return post({
        url: routes.api.canvases.stop({
            id,
        }),
    })
}

/**
 * Realtime runs can start immediately.
 * Historical runs need to create a new adhoc canvas first.
 */

export async function startOrCreateAdhocCanvas(canvas, options) {
    const isHistorical = isHistoricalModeSelected(canvas)
    if (isHistorical && !canvas.adhoc) {
        return createAdhocCanvas(canvas)
    }

    return start(canvas, {
        clearState: !!options.clearState || isHistorical,
    })
}

/**
 * Unlinks parent from child, loads parent.
 * i.e. return to parent canvas
 */

export async function unlinkAndLoadParentCanvas(canvas) {
    const { settings = {} } = canvas
    const parent = await loadCanvas({ id: settings.parentCanvasId })
    unlink(parent.id)
    return parent
}

/**
 * Loads child canvas if one is active, otherwise loads passed-in canvas.
 * i.e. show same historical canvas on refresh until exited.
 */

export async function loadRelevantCanvas({ id }) {
    const childCanvasId = getLink(id)
    if (childCanvasId == null) {
        return loadCanvas({ id }) // load canvas if no child
    }

    // load linked child
    return loadCanvas({ id: childCanvasId }).catch((error) => {
        analytics.reportWarning(error, {
            message: 'error loading child canvas',
            parentCanvasId: id,
            childCanvasId,
        })
        // unlink & load parent if loading child broken
        unlink(id)
        return loadCanvas({ id })
    })
}
