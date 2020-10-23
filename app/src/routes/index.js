// @flow

import pick from 'lodash/pick'
import qs from 'query-string'
import { parse, compile } from 'path-to-regexp'

import definitions from './definitions'

type Routes = {
    [string]: any,
}

type Paths = {
    [string]: string,
}

type Variables = {
    [string]: string,
}

type DefineOptions = {
    hash?: string,
    encode?: boolean,
    validate?: boolean,
}

/**
 * Generates a route function.
 * @param pathstr Path format.
 * @param getVariables Variable collection getter.
 * @returns Route function.
 */
export const define = (pathstr: string, getVariables: () => Variables) => (params: ?Object, options: DefineOptions = {}): string => {
    const route = Object.entries(getVariables()).reduce((acc, [name, value]) => {
        const val: any = value || ''
        const strippedValue: string = val.length > 1 ? val.replace(/\/$/, '') : val
        return acc.replace(new RegExp(`<${name}>`, 'g'), strippedValue)
    }, pathstr)

    const unsetVariableNames = (route.match(/<[^>]+>/g) || []).map((s) => s.replace(/[<>]/g, ''))

    if (unsetVariableNames.length) {
        throw new Error(`Expected ${unsetVariableNames.map((s) => `"${s}"`).join(', ')} variable(s) to be defined`)
    }

    if (params) {
        const tokenNames = parse(route).map((t) => t.name).filter(Boolean)
        const queryKeys = Object.keys(params).filter((key) => !tokenNames.includes(key))
        const { encode, validate, hash } = {
            encode: true,
            validate: true,
            hash: undefined,
            ...(options || {}),
        }

        const toPath = compile(route)
        const uri = `${toPath(params, {
            encode: (value) => (encode ? encodeURIComponent(value) : value),
            validate: !!validate,
        })}?${qs.stringify(pick(params, queryKeys))}`.replace(/\?$/, '')

        return hash ? `${uri}#${hash}` : uri
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
            [name]: typeof value === 'string' ? (
                define(value, getVariables)
            ) : (
                buildRoutes(value, getVariables)
            ),
        }
    }, {})
)

export default buildRoutes(definitions, () => ({
    landingPage: 'https://streamr.network',
    streamr: process.env.STREAMR_URL,
    platform: process.env.PLATFORM_ORIGIN_URL,
    api: process.env.STREAMR_API_URL,
}))
