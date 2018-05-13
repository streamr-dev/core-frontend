// @flow

import path from 'path'
import url from 'url'
import isObject from 'lodash/isObject'
import last from 'lodash/last'
import queryString from 'query-string'

// Filter out objects, stringify others
const getUrlParts = (args: Array<string | number | Object>): Array<string> => args.filter((arg) => !isObject(arg)).map((arg) => arg.toString())

// Check if the last argument is object and form a query string if it is
const getQueryString = (args: Array<string | number | Object>): ?string => (isObject(last(args)) ? queryString.stringify(last(args)) : null)

export const formatPath = (...args: Array<string | number | Object>): string => {
    const query = getQueryString(args)
    const urlParts = getUrlParts(args)

    const stringQuery = query ? `?${query}` : ''
    const uri = path.join('/', ...urlParts)
    return `${uri}${stringQuery}`
}

export const formatApiUrl = (...args: Array<string | number | Object>): string => {
    const rootUrl = process.env.MARKETPLACE_API_URL.replace(/\/+$/, '')
    return `${rootUrl}${formatPath(...args)}`
}

export const formatExternalUrl = (...args: Array<string | number | Object>): string => {
    const query = getQueryString(args)
    const urlParts = getUrlParts(args)
    const stringQuery = query ? `?${query}` : ''
    const uri = urlParts.length > 1 ? url.resolve(...urlParts) : urlParts[0]
    return `${uri}${stringQuery}`
}
