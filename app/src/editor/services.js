import debounce from 'lodash/debounce'
import * as API from '$shared/utils/api'

const canvasesUrl = `${process.env.STREAMR_API_URL}/canvases`
const getModuleURL = `${process.env.STREAMR_URL}/module/jsonGetModule`
const AUTOSAVE_DELAY = 3000

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

export const autosave = debounce(async (canvas, ...args) => {
    await save(canvas, ...args)
    // temporary log until notifications work again
    console.info('Autosaved', canvas.id) // eslint-disable-line no-console
}, AUTOSAVE_DELAY)
