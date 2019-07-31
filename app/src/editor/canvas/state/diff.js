import isEqual from 'lodash/isEqual'
import differenceWith from 'lodash/differenceWith'
import orderBy from 'lodash/orderBy'

const EMPTY = []

function isEqualModule(moduleA, moduleB) {
    if (!moduleA.modules && !moduleB.modules) {
        return isEqual(moduleA, moduleB)
    }

    // ignore module internals e.g. subcanvas module
    return isEqual({
        ...moduleA,
        modules: [],
    }, {
        ...moduleB,
        modules: [],
    })
}

export function changedModules(canvasA, canvasB) {
    if (canvasA === canvasB || canvasA.modules === canvasB.modules) { return EMPTY }
    const modulesA = orderBy(canvasA.modules || [], 'hash')
    const modulesB = orderBy(canvasB.modules || [], 'hash')
    const AtoB = differenceWith(modulesA, modulesB, isEqualModule).map(({ hash }) => hash)
    const BtoA = differenceWith(modulesB, modulesA, isEqualModule).map(({ hash }) => hash)
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
    return isEqual({
        ...canvasA,
        updated: '',
        created: '',
        modules: [],
    }, {
        ...canvasB,
        updated: '',
        created: '',
        modules: [],
    })
}
