// @flow

import defineRoute from './defineRoute'

type Routes = {
    (?string, ?Object): Routes,
    [string]: (?Object) => string,
}

/**
 * Generates final route object.
 * @param paths An object where keys are route names and values are (optionally parametrized) URLs.
 * @returns A callable name-to-url object.
 */
export default (paths: Object): Routes => {
    const buildRouteObject = (prefix: ?string, params: ?Object): Routes => {
        const route = (prefix2: ?string, params2: ?Object): Routes => (
            buildRouteObject(`${prefix || ''}${prefix2 || ''}`, Object.assign({}, params || {}, params2 || {}))
        )

        Object.entries(Object.assign({}, paths, {
            void: '',
            root: '/',
        })).forEach(([name, value]) => {
            const val: any = value
            route[name] = defineRoute(val, prefix, params)
        })

        return route
    }

    return buildRouteObject('', {})
}
