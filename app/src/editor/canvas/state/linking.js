/**
 * Store links between objects (e.g. canvases) in local storage.
 *
 */

const LINK_PREFIX = 'Link'
function validateId(id) {
    if ((typeof id !== 'string' && typeof id !== 'number') || id === '') {
        throw new TypeError(`id must be non-empty string|number. Got ${typeof id}: ${id}`)
    }
}

export function getLink(parentId) {
    validateId(parentId)
    return window.localStorage.getItem(`${LINK_PREFIX}:${parentId}`)
}

export function link(parentId, childId) {
    validateId(parentId)
    validateId(childId)
    return window.localStorage.setItem(`${LINK_PREFIX}:${parentId}`, childId)
}

export function unlink(parentId) {
    validateId(parentId)
    window.localStorage.removeItem(`${LINK_PREFIX}:${parentId}`)
}
