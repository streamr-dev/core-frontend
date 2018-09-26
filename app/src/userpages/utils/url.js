// @flow

import isObject from 'lodash/isObject'
import last from 'lodash/last'
import qs from 'querystringify'

// Filter out objects, stringify others
const getUrlParts = (args: Array<string | number | Object>): Array<string> => args.filter((arg) => !isObject(arg)).map((arg) => arg.toString())

// Check if the last argument is object and form a query string if it is
const getQueryString = (args: Array<string | number | Object>): ?string => (isObject(last(args)) ? qs.stringify(last(args)) : null)

// Joins url parts and removes extra slashes
const joinUrlParts = (args: Array<string>) => args.map((p) => p.replace(/^\/|\/$/g, '')).join('/')

export const formatPath = (...args: Array<string | number | Object>): string => {
    const query = getQueryString(args)
    const urlParts = getUrlParts(args)

    const stringQuery = query ? `?${query}` : ''
    const uri = joinUrlParts(urlParts).replace(/^\/+$/g, '') // remove multiple consecutive occurences of '/'
    return `/${uri}${stringQuery}`
}

export const formatApiUrl = (...args: Array<string | number | Object>): string => {
    const root = process.env.STREAMR_API_URL || ''
    const rootUrl = root.replace(/\/+$/, '')
    return `${rootUrl}${formatPath(...args)}`
}

export const formatExternalUrl = (...args: Array<string | number | Object>): string => {
    const query = getQueryString(args)
    const urlParts = getUrlParts(args)
    const stringQuery = query ? `?${query}` : ''
    const uri = urlParts.length > 1 ? joinUrlParts(urlParts) : urlParts[0]
    return `${uri}${stringQuery}`
}

