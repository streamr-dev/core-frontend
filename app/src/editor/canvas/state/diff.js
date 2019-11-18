import isEqual from 'lodash/isEqual'
import differenceWith from 'lodash/differenceWith'
import orderBy from 'lodash/orderBy'

const EMPTY = []

function getIsEqualIgnoring(ignoreKeys = new Set()) {
    return (objA, objB) => {
        if (objA === objB) { return true }
        const keysA = Object.keys(objA)
        /* eslint-disable no-continue */
        for (let i = 0; i < keysA.length; i += 1) {
            const key = keysA[i]
            if (ignoreKeys.has(key)) {
                // ignore module internals e.g. subcanvas module
                continue
            }
            if (objA[key] === objB[key]) {
                continue
            }
            const areEqual = isEqual(objA[key], objB[key])
            if (!areEqual) { return false }
        }
        /* eslint-enable no-continue */
        return true
    }
}

const MODULE_IGNORE_KEYS = new Set([
    'modules',
])

const CANVAS_IGNORE_KEYS = new Set([
    'created',
    'updated',
    'modules',
])

const isEqualModule = getIsEqualIgnoring(MODULE_IGNORE_KEYS)
const isEqualCanvasCheck = getIsEqualIgnoring(CANVAS_IGNORE_KEYS)

export function changedModules(canvasA, canvasB) {
    if (!canvasA || !canvasB) { return EMPTY }
    if (canvasA === canvasB || canvasA.modules === canvasB.modules) { return EMPTY }
    const modulesA = orderBy(canvasA.modules || [], 'hash')
    const modulesB = orderBy(canvasB.modules || [], 'hash')
    const AtoB = new Set(differenceWith(modulesA, modulesB, isEqualModule).map(({ hash }) => hash))
    const BtoA = new Set(differenceWith(
        // ignore items already flagged as changed
        modulesB.filter(({ hash }) => !AtoB.has(hash)),
        modulesA.filter(({ hash }) => !AtoB.has(hash)),
        isEqualModule,
    ).map(({ hash }) => hash))
    const result = Array.from(new Set([...AtoB, ...BtoA]))
    if (!result.length) { return EMPTY }
    return result
}

export function isEqualCanvas(canvasA, canvasB) {
    if (canvasA === canvasB) { return true }
    if (!canvasA || !canvasB) { return false }
    const hasChangedModules = changedModules(canvasA, canvasB)
    if (hasChangedModules.length) { return false }
    // don't re-check modules, ignore updated time
    return isEqualCanvasCheck(canvasA, canvasB)
}

