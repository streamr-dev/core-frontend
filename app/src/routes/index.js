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

/**
 * Generates a route function.
 * @param pathstr Path format.
 * @returns Route function.
 */
export const define = (pathstr: string) => (params: ?Object): string => {
    if (params) {
        const tokenNames = p2r.parse(pathstr).map((t) => t.name).filter(Boolean)
        const queryKeys = Object.keys(params).filter((key) => !tokenNames.includes(key))

        return `${p2r.compile(pathstr)(params)}?${qs.stringify(pick(params, queryKeys))}`.replace(/\?$/, '')
    }

    return pathstr
}

/**
 * Generates final route object.
 */
export const buildRoutes = (paths: Paths): Routes => (
    Object.entries(paths).reduce((acc, [name, route]) => {
        const value: any = route

        return {
            ...acc,
            [name]: define(value),
        }
    }, {})
)

export default buildRoutes(definitions({
    landingPage: 'https://www.streamr.com',
    streamr: process.env.STREAMR_URL,
}))
