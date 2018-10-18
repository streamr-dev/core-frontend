// @flow

import defineRoute from './defineRoute'

type Routes = {
    [string]: (?Object) => string,
}

type Paths = {
    [string]: string,
}

export type Variables = {
    [string]: string,
}

/**
 * Generates final route object.
 */
export default (paths: Paths, variables: Variables): Routes => (
    Object.entries(paths).reduce((acc, [name, route]) => ({
        ...acc,
        [name]: defineRoute((route: any), variables),
    }), {})
)
