import isEqual from 'lodash/isEqual'
import differenceWith from 'lodash/differenceWith'
import orderBy from 'lodash/orderBy'

const EMPTY = []

/**
 * Quick memoize fn
 * Memoizes most recent call with the first arg + second arg.
 */

function memoizeLast(fn) {
    const cache = new WeakMap() // WeakMap keyed by arg1 containing WeakMap of arg2 -> result
    // i.e. lastArgs.get(arg1).get(arg2) === result
    const name = `memoizeLast(${fn.name})`
    // wrap in obj so can assign dynamic name
    // (returns a function)
    return {
        [name](arg1, arg2, ...args) {
            if (cache.has(arg1) && cache.get(arg1).has(arg2)) {
                return cache.get(arg1).get(arg2)
            }

            const result = fn.call(this, arg1, arg2, ...args)
            if (!arg1 || !arg2 || typeof arg1 !== 'object' || typeof arg2 !== 'object') {
                // don't memoize if arguments aren't objects
                return result
            }

            if (!cache.has(arg1)) {
                cache.set(arg1, new WeakMap())
            }

            const results = cache.get(arg1)
            results.set(arg2, result)
            return result
        },
    }[name]
}

function getIsEqualIgnoring(ignoreKeys = new Set()) {
    // eslint-disable-next-line prefer-arrow-callback
    return function getIsEqualIgnoring(objA, objB) {
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

// eslint-disable-next-line no-underscore-dangle, prefer-arrow-callback
export const changedModules = memoizeLast(function changedModules(canvasA, canvasB) {
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
})

// eslint-disable-next-line prefer-arrow-callback
export const isEqualCanvas = memoizeLast(function isEqualCanvas(canvasA, canvasB) {
    if (canvasA === canvasB) { return true }
    if (!canvasA || !canvasB) { return false }
    const hasChangedModules = changedModules(canvasA, canvasB)
    if (hasChangedModules.length) { return false }
    // don't re-check modules, ignore updated time
    return isEqualCanvasCheck(canvasA, canvasB)
})
