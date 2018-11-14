// @flow

import pick from 'lodash/pick'
import qs from 'query-string'
import p2r from 'path-to-regexp'

import definitions from './definitions'

type Routes = {
    [string]: (?Object) => string,
}

type Paths = {
    [string]: string,
}

type Variables = {
    [string]: string,
}

/**
 * Generates a route function.
 * @param pathstr Path format.
 * @param getVariables Variable collection getter.
 * @returns Route function.
 */
export const define = (pathstr: string, getVariables: () => Variables) => (params: ?Object): string => {
    const route = Object.entries(getVariables()).reduce((acc, [name, value]) => {
        const val: any = value
        return pathstr.replace(new RegExp(`<${name}>`, 'g'), val)
    }, pathstr)

    const unsetVariableNames = (route.match(/<[^>]+>/g) || []).map((s) => s.replace(/[<>]/g, ''))

    if (unsetVariableNames.length) {
        throw new Error(`Expected ${unsetVariableNames.map((s) => `"${s}"`).join(', ')} variable(s) to be defined`)
    }

    if (params) {
        const tokenNames = p2r.parse(route).map((t) => t.name).filter(Boolean)
        const queryKeys = Object.keys(params).filter((key) => !tokenNames.includes(key))

        return `${p2r.compile(route)(params)}?${qs.stringify(pick(params, queryKeys))}`.replace(/\?$/, '')
    }

    return route
}

/**
 * Generates final route object.
 */
export const buildRoutes = (paths: Paths, getVariables: () => Variables): Routes => (
    Object.entries(paths).reduce((acc, [name, route]) => {
        const value: any = route

        return {
            ...acc,
            [name]: define(value, getVariables),
        }
    }, {})
)

export default buildRoutes(definitions, () => ({
    landingPage: 'https://www.streamr.com',
    streamr: process.env.STREAMR_URL,
}))
