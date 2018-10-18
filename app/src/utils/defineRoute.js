// @flow

import pick from 'lodash/pick'
import qs from 'query-string'
import p2r from 'path-to-regexp'

/**
 * Generates a route function.
 * @param pathstr Route format.
 * @param variables An object with values of the variables (i.e. <var1>).
 */
export default (pathstr: string, variables: ?Object) => {
    const route = Object.entries(variables || {}).reduce((acc, [name, value]) => {
        const val: any = value
        return pathstr.replace(new RegExp(`<${name}>`, 'g'), val)
    }, pathstr)

    return (params: ?Object): string => {
        if (params) {
            const tokenNames = p2r.parse(route).map((t) => t.name).filter(Boolean)
            const queryKeys = Object.keys(params).filter((key) => !tokenNames.includes(key))

            return `${p2r.compile(route)(params)}?${qs.stringify(pick(params, queryKeys))}`.replace(/\?$/, '')
        }

        return route
    }
}
