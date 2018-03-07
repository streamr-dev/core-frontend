// @flow

import path from 'path'
import isObject from 'lodash/isObject'
import last from 'lodash/last'
import queryString from 'query-string'

export const formatPath = (...args: Array<string | number | Object>): string => {
    // If last parameter is an object, use it for query string
    const query = isObject(last(args)) ? queryString.stringify(args.pop()) : null

    // Filter out other objects and join parts
    const uri = path.join.apply(null, ['/', ...args.filter(arg => !isObject(arg)).map(arg => arg.toString())])

    return query ? `${uri}?${query}` : uri
}

export const formatUrl = (...args: Array<string | number | Object>): string => {
    const rootUrl = process.env.MARKETPLACE_API_URL.replace(/\/+$/, '')
    return `${rootUrl}${formatPath.apply(null, args)}`
}
