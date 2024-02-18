import qs from 'query-string'
import pick from 'lodash/pick'
import { parse, compile, Key } from 'path-to-regexp'
import getCoreConfig from '~/getters/getCoreConfig'
import definitions from './definitions.json'
type Routes = Record<string, any>
type Paths = Record<string, any>
type Variables = Record<string, string>
type DefineOptions = {
    hash?: string
    encode?: boolean
    validate?: boolean
}

/**
 * Generates a route function.
 * @param pathstr Path format.
 * @param getVariables Variable collection getter.
 * @returns Route function.
 */
export const define =
    (pathstr: string, getVariables: () => Variables) =>
    (
        params: Record<string, any> | null | undefined,
        options: DefineOptions = {},
    ): string => {
        let path = pathstr

        if (params) {
            const tokenNames = parse(path)
                .map((t: string | Key) => (t as Key).name)
                .filter(Boolean)
            const queryKeys = Object.keys(params).filter(
                (key) => !tokenNames.includes(key),
            )
            const { encode, validate, hash } = {
                encode: true,
                validate: true,
                hash: undefined,
                ...(options || {}),
            }
            const toPath = compile(path, {
                encode: (value) => (encode ? encodeURIComponent(value) : value),
                validate: !!validate,
            })
            const uri = `${toPath(params)}?${qs.stringify(
                pick(params, queryKeys),
            )}`.replace(/\?$/, '')
            path = hash ? `${uri}#${hash}` : uri
        }

        const route = Object.entries(getVariables()).reduce((acc, [name, value]) => {
            const val: any = value || ''
            const strippedValue: string = val.length > 1 ? val.replace(/\/$/, '') : val
            return acc.replace(new RegExp(`<${name}>`, 'g'), strippedValue)
        }, path)
        const unsetVariableNames = (route.match(/<[^>]+>/g) || []).map((s) =>
            s.replace(/[<>]/g, ''),
        )

        if (unsetVariableNames.length) {
            throw new Error(
                `Expected ${unsetVariableNames
                    .map((s) => `"${s}"`)
                    .join(', ')} variable(s) to be defined`,
            )
        }

        return route
    }

/**
 * Generates final route object.
 */
export const buildRoutes = (paths: Paths, getVariables: () => Variables): Routes =>
    Object.entries(paths).reduce((acc, [name, route]) => {
        const value: any = route
        return {
            ...acc,
            [name]:
                typeof value === 'string'
                    ? define(value, getVariables)
                    : buildRoutes(value, getVariables),
        }
    }, {})
const routes = buildRoutes(definitions as any, () => {
    const { streamrUrl: streamr, platformOriginUrl: platform } = getCoreConfig()
    const api = `${streamr}/api/v2`
    return {
        api,
        landingPage: 'https://streamr.network',
        platform,
        streamr,
    }
})
export default routes
