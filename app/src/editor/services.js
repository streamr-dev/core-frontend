import debounce from 'lodash/debounce'
import * as API from '$shared/utils/api'

const canvasesUrl = `${process.env.STREAMR_API_URL}/canvases`
const getModuleURL = `${process.env.STREAMR_URL}/module/jsonGetModule`
const AUTOSAVE_DELAY = 3000

// don't export this unless also adding handling to cancel autosaving
async function save(canvas) {
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

function unsavedUnloadWarning(event) {
    const confirmationMessage = 'You have unsaved changes'
    const evt = (event || window.event)
    evt.returnValue = confirmationMessage // Gecko + IE
    return confirmationMessage // Webkit, Safari, Chrome etc.
}

export const autosave = (...args) => {
    // keep returning the same promise until autosave fires
    // resolve/reject autosave when debounce finally runs & save is complete
    autosave.promise = autosave.promise || new Promise((resolve, reject) => {
        // warn user if changes not yet saved
        window.addEventListener('beforeunload', unsavedUnloadWarning)
        // capture debounced function
        autosave.run = debounce(async (canvas, ...args) => {
            // clear state for next run
            window.removeEventListener('beforeunload', unsavedUnloadWarning)
            autosave.run = undefined
            autosave.promise = undefined
            try {
                const result = await save(canvas, ...args)
                // TODO: temporary logs until notifications work again
                console.info('Autosaved', canvas.id) // eslint-disable-line no-console
                resolve(result)
            } catch (err) {
                console.warn('Autosave failed', canvas.id, err) // eslint-disable-line no-console
                reject(err)
            }
        }, AUTOSAVE_DELAY)
    })

    autosave.run(...args) // run debounced save with latest args
    return autosave.promise
}
