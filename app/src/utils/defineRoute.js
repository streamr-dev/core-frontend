// @flow

import pick from 'lodash/pick'
import qs from 'query-string'

/**
 * Generates a URL/path helper.
 * @param pathstr Route format, e.g. /resource/:id
 * @param prefix Prepended part of the path. Can be another route definition.
 * @param defaultParams An object with default params.
 * @returns A function that takes an object with params as an argument and gives a string.
 */
export default (pathstr: string, prefix: ?string, defaultParams: ?Object) => (params: ?Object): string => {
    const route = `${prefix || ''}${pathstr}`.replace(/\/+/g, '/').replace(/:\//, '://')
    if (!params) {
        return route
    }
    const paramsDup = Object.assign({}, defaultParams || {}, params)
    const result = Object.keys(paramsDup).reduce((path, key) => {
        const exp = new RegExp(`:${key}(?=(/.*)?$)`, 'g')
        if (exp.test(path)) {
            const value = paramsDup[key]
            delete paramsDup[key]
            return path.replace(exp, value)
        }
        return path
    }, route.replace(/\([^)]*\)/g, ''))
    if (/:[\w]/.test(result)) {
        throw new Error(`Missing params in "${result}"`)
    }
    // We stringify remaining non-default params.
    return `${result}?${qs.stringify(pick(paramsDup, Object.keys(params)))}`.replace(/\?$/, '')
}
