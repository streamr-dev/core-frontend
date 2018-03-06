// @flow

import path from 'path'
import isObject from 'lodash/isObject'
import last from 'lodash/last'
import queryString from 'query-string'

export const formatPath = (...args: Array<string | number | Object>): string => {
    // If last parameter is an object, use it for query string
    const query = isObject(last(args)) ? queryString.stringify(args.pop()) : null

    const uri = path.join.apply(null, ['/', ...args.map(arg => arg.toString())])

    return query ? `${uri}?${query}` : uri
}

export const formatUrl = (...args: Array<string | number | Object>): string => {
    const rootUrl = process.env.MARKETPLACE_API_URL.replace(/\/+$/, '')
    return `${rootUrl}${formatPath.apply(null, args)}`
}
